import { QUEUE_URL, sqs } from "../config/aws";
import { ConstantsModule } from "../constants.module";
import { ORDER_STATUS } from "../enums";
import { ERROR_TYPES } from "../error";
import Order from "../models/order.model";
import User from '../models/user.model'
import { sendOrderNotifications } from "../services/email.service";
import { SUCCESS_TYPES } from "../success";

const processOrder = async (orderData: any, retryCount = 0) => {
    try {
        console.log('Processing order', orderData);

        // FINDING UPDATING ORDER STATUS
        const order = await Order.findById(orderData._id);
        if (!order) {
            console.error(`Order ${orderData._id} not found!`);
            return { message: ERROR_TYPES.ORDER_NOT_FOUND.message };
        }

        await Order.findByIdAndUpdate(orderData._id, { status: ORDER_STATUS.PROCESSED }, { new: true });
        console.log(`Order ${orderData._id} marked as Processed`);

        // FETCH USER DETAILS TO SEND EMAIL
        const user = await User.findById(orderData.userId);
        if (!user) {
            console.error(`User for Order ${orderData._id} not found!`);
            return { message: ERROR_TYPES.USER_DOES_NOT_EXISTS.message };
        }

        // SEND ORDER CONFIRMATION EMAIL
        await sendOrderNotifications(user.email, {
            orderId: orderData._id,
            items: orderData.items,
            status: orderData.status
        });
        console.log(`Email notification sent for Order ${orderData._id}`);
        return { message: SUCCESS_TYPES.ORDER_PROCESSED.message };

    } catch (error) {
        console.error('Error processing order', error);
        if (retryCount < ConstantsModule.MAX_RETRIES_FOR_ORDER) {
            console.log(`Retrying order ${orderData._id} (Attempt ${retryCount + 1})`);
            return await processOrder(orderData, retryCount + 1);
        } else {
            console.error(`Order ${orderData._id} failed after ${ConstantsModule.MAX_RETRIES_FOR_ORDER} attempts! Moving to DLQ`);
            return { message: ERROR_TYPES.ORDER_FAILED_AFTER_MULTIPLE_RETRIES.message };
        }
    }
}

export const pollQueue = async () => {
    const params = {
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
    }

    while (true) {
        try {
            const data = await sqs.receiveMessage(params).promise();

            if (data.Messages) {
                for (const message of data.Messages) {
                    const orderData = JSON.parse(message.Body!);
                    const result = await processOrder(orderData);

                    if (result.message !== ERROR_TYPES.ORDER_FAILED_AFTER_MULTIPLE_RETRIES.message) {
                        // DELETE MESSAGE FROM QUEUE ONLY IF SUCCESSFUL
                        await sqs.deleteMessage({
                            QueueUrl: QUEUE_URL,
                            ReceiptHandle: message.ReceiptHandle!,
                        }).promise();
                    } else {
                        console.log(`Order ${orderData._id} needs to be sent to DLQ`);
                    }
                }
            }
        } catch (error) {
            console.log('Error polling queue', error);
        }
    }
}

pollQueue();