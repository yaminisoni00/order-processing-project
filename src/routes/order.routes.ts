import express from 'express';
import { createOrderForUser, getOrderList } from '../controllers/order.controller';
import { verifyAccessTokenMiddleware } from '../middlewares/auth.middleware';

const orderRouter = express.Router();

try {
    orderRouter.post('/orders', verifyAccessTokenMiddleware, createOrderForUser);
} catch (error) {
    console.log('Error creating order', error);
}
orderRouter.post('/orders/:id', verifyAccessTokenMiddleware, getOrderList);

export default orderRouter