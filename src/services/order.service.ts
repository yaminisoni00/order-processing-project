import { CreateOrderArgs, GetOrderListArgs } from "./args/order.args";
import User from '../models/user.model';
import { ERROR_TYPES } from "../error";
import Order from "../models/order.model";
import { ORDER_STATUS } from "../enums";
import mongoose from "mongoose";
import Inventory from "../models/inventory.model";
import redis from "../config/redis";
import { ConstantsModule } from "../constants.module";
import { SUCCESS_TYPES } from "../success";
import { sendOrderToQueue } from "./orderQueue.service";

export const createOrder = async (createOrderArgs: CreateOrderArgs): Promise<any> => {
    const session = await mongoose.startSession();
    session.startTransaction(); // START A TRANSACTION TO MAINTAIN CONSISTENCY
    try {
        const userExists = await User.findById(createOrderArgs.userId).session(session);
        if (!userExists) {
            return { message: ERROR_TYPES.USER_DOES_NOT_EXISTS.message };
        }

        let updatedItems: any[] = [];
        let inventoryUpdates: { inventoryItem: any; quantity: number }[] = [];
        let totalAmount = 0;
        // INVENTORY CHECK LOGIC
        for (let index = 0; index < createOrderArgs.items.length; index++) {
            const itemIndex = createOrderArgs.items[index];
            const inventoryItem = await Inventory.findOne({ productId: itemIndex.productId }).session(session);
            if (!inventoryItem) {
                return { message: ERROR_TYPES.INVENTORY_ITEM_NOT_FOUND.message };
            }
            if (inventoryItem.stock < itemIndex.quantity) {
                return { message: ERROR_TYPES.NOT_ENOUGH_STOCK_FOR_ORDER.message };
            }

            inventoryUpdates.push({ inventoryItem, quantity: itemIndex.quantity });

            updatedItems.push({
                productId: itemIndex.productId,
                name: inventoryItem.name,
                quantity: itemIndex.quantity,
                price: inventoryItem.price,
            });
            totalAmount += inventoryItem.price * itemIndex.quantity;
        }

        // DEDUCT STOCK ONLY AFTER VERIFYING ALL PRODUCTS
        for (let index = 0; index < inventoryUpdates.length; index++) {
            inventoryUpdates[index].inventoryItem.stock -= inventoryUpdates[index].quantity;
            await inventoryUpdates[index].inventoryItem.save({ session });
        }

        const order = new Order({
            userId: createOrderArgs.userId,
            items: updatedItems,
            totalAmount,
            status: ORDER_STATUS.PENDING
        })
        await redis.setex(`order:${order._id}`, ConstantsModule.ORDER_CACHE_EXPIRY, JSON.stringify(order)); // SETTING ORDER IN REDIS CACHE
        await order.save({ session });

        // SEND ORDER TO SQS QUEUE
        await sendOrderToQueue(order);

        // PUSHING ORDER ID TO USER'S ORDER HISTORY
        userExists.orders.push(order._id as mongoose.Types.ObjectId);
        await userExists.save({ session });

        // COMMIT TRANSACTION
        await session.commitTransaction();
        session.endSession();

        return { message: SUCCESS_TYPES.ORDER_CREATED.message, order };
    } catch (error) {
        // IF ANY ERROR OCCURS, ROLLBACK CHANGES
        await session.abortTransaction();
        session.endSession();
        console.log('Error creating order', error);
        return error;
    }
}

export const getOrder = async (getOrderListArgs: GetOrderListArgs): Promise<any> => {
    try {
        const cachedOrder = await redis.get(`order:${getOrderListArgs.id}`);
        console.log('cachedOrder: ', cachedOrder);
        if (cachedOrder) {
            console.log("Order found in Redis cache");
            return JSON.parse(cachedOrder);
        }

        // FINDING ORDER IN MONGO IF IT DOESN'T EXISTS IN REDIS
        const orderExists = await Order.findOne({ _id: getOrderListArgs.id });
        if (!orderExists) {
            return { message: ERROR_TYPES.ORDER_NOT_FOUND.message };
        }

        // STORE ORDER IN REDIS (CACHE IT)
        await redis.setex(`order:${orderExists._id}`, ConstantsModule.ORDER_CACHE_EXPIRY, JSON.stringify(orderExists));
        console.log("Order cached in Redis");

        // RETURNING THE ORDER FROM MONGO DB IF DOESN'T EXISTS IN REDIS
        return { orderExists, message: SUCCESS_TYPES.ORDER_FETCHED.message };
    } catch (error) {
        console.log('Error getting order list', error);
        return error;
    }
}