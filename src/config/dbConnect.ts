import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Inventory from '../models/inventory.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('DB connected');
        // // ADDING DUMMY DATA FOR INVENTORY TESTING
        // const sampleInventoryData = new Inventory({
        //     productId: new mongoose.Types.ObjectId(),
        //     name: 'Test Product',
        //     stock: 100,
        //     price: 1000
        // })
        // await sampleInventoryData.save();
        // console.log('Sample inventory data added'); 
    } catch (err) {
        console.log('Error connecting DB', err);
        process.exit(1);
    }
}

export default dbConnect;