import { Request, Response } from "express";
import { CreateOrderArgs, GetOrderListArgs } from "../services/args/order.args";
import { createOrder, getOrder } from "../services/order.service";

export const createOrderForUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const createOrderArgs: CreateOrderArgs = req.body;
        const response = await createOrder(createOrderArgs);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error creating order for user', error);
        return error;
    }
}

export const getOrderList = async (req: Request, res: Response): Promise<any> => {
    try {
        const getOrderListArgs: GetOrderListArgs = req.body;
        const response = await getOrder(getOrderListArgs);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error getting orders', error);
        return error;
    }
}