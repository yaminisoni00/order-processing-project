import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET: any = process.env.JWT_SECRET; 

export const generateToken = async (user: any): Promise<any> => {
    try {
        const payload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            phoneNumber: user.phoneNumber
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

        return {  accessToken, refreshToken };
    } catch (err) {
        console.log('Error generating token', err);
        return err;
    }
}

export const refreshAccessToken = async (refreshToken: string): Promise<any> => {
    try {
        const decodedToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        return jwt.sign({ userId: decodedToken.userId, email: decodedToken.email, username: decodedToken.username }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    } catch (err) {
        console.log('Error refreshing token', err);
        return err;
    }
}