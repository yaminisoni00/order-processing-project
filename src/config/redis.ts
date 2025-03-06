import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 14016,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: { rejectUnauthorized: false }
})

redis.on('connect', () => console.log('Redis connected'))
redis.on('error', (err) => console.error('Redis connection error:', err))

// const connectRedis = async () => {
//     try {
//       await redis.connect();
//       console.log("Redis Connected");
//     } catch (error) {
//       console.error("Redis Connection Error:", error);
//     }
//   };

export default redis;