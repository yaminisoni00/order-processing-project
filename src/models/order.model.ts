import mongoose, { Schema, Document } from "mongoose";
import { ORDER_STATUS } from "../enums";

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    items: {
        productId: mongoose.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: ORDER_STATUS;
    createdAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Relation with User model
            required: true,
        },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Inventory", required: true }, // Reference to Inventory
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
