import app from "./app";
import connectDB from "./config/dbConnect";
// import { connectRedis } from "./config/redis";
import dotenv from 'dotenv'
import '../src/services/orderQueue.service';
dotenv.config()

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
//   await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
