// MIDDLEWARES FOR ACCESS TOKEN VERIFICATION

import jwt from 'jsonwebtoken';
import { ERROR_TYPES } from '../error';
import dotenv from 'dotenv';
import { error } from 'console';
dotenv.config();


export const verifyAccessTokenMiddleware = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken || !accessToken.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: ERROR_TYPES.INVALID_ACCESS_TOKEN.message 
            });
        }

        const token = accessToken.split(' ')[1];
        const decodedToken = jwt.verify(token, (process.env.ACCESS_TOKEN_SECRET! || process.env.REFRESH_TOKEN_SECRET!));
        
        // Attach decoded user information to the request
        req.user = decodedToken;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ 
                message: 'Access token has expired' 
            });
        }

        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ 
                message: 'Invalid access token signature',
                error: err.message 
            });
        }

        // Generic error handler for unexpected errors
        console.error('Unexpected error in token verification:', err);
        return res.status(500).json({ 
            message: 'Internal server error during token verification' 
        });
    }
}