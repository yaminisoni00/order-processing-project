import express from 'express';
import { getUserProfileForMyself, loginUser, refreshToken, register, verifyOtpForUser } from '../controllers/auth.controller';
import { logout } from '../services/auth.services';
import { verifyAccessTokenMiddleware } from '../middlewares/auth.middleware';

const router = express.Router(); 

router.post('/register', register);
router.post('/verify-otp', verifyOtpForUser);
router.post('/login', loginUser);
router.get('/getUserProfile', verifyAccessTokenMiddleware, getUserProfileForMyself)

router.post('/logout', verifyAccessTokenMiddleware, logout);
router.post('/refresh', verifyAccessTokenMiddleware, refreshToken)

export default router;