import mongoose, { Schema } from "mongoose"

export interface IInventory extends Document {
    productId: string,
    name: string,
    stock: number,
    price: number   
}

const InventorySchema: Schema =  new Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Inventory = mongoose.model<IInventory>("Inventory", InventorySchema);
export default Inventory;