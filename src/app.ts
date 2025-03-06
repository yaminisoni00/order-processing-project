import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes/auth.routes";
import orderRouter from "./routes/order.routes";
import connectRedis from "./config/redis";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// AS OF NOW, WE ARE USING REDIS INSIGHT FOR TESTING
// connectRedis();

// Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 Order Processing API is running...");
});

//REGISTER ROUTES
app.use('/api/auth', router);
app.use('/api/auth', orderRouter);

export default app;
