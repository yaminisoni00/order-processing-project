import { QUEUE_URL, sqs } from "../config/aws";
import { SUCCESS_TYPES } from "../success";

export const sendOrderToQueue = async (order: any) => {
    // SEND ORDER TO SQS QUEUE
    const params = {
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(order),
    };

    try {
        const result = await sqs.sendMessage(params).promise();
        console.log('Order sent to queue', result);
        return { message: SUCCESS_TYPES.DEFAULT_SUCCESS.message, result }
    } catch (error) {
        console.log('Error sending order to queue', error);
        return error;
    }
}