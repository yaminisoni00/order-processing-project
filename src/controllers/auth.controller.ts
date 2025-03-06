import { LoginUserArgs, LogoutUserArgs, RegisterUserArgs, VerifyOtpArgs } from "../services/args/user.args";

import { Request, Response } from 'express';
import { getUserProfile, login, logout, registerUser, verifyOtp } from "../services/auth.services";
import { refreshAccessToken } from "../tokens/generateToken";

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const registerUserArgs: RegisterUserArgs = req.body;
        const response = await registerUser(registerUserArgs);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error registering user', error);
        return error;
    }
}

export const verifyOtpForUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const verifyOtpArgs: VerifyOtpArgs = req.body;
        const response = await verifyOtp(verifyOtpArgs);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error verifying OTP', error);
        return error;
    }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const loginUserArgs: LoginUserArgs = req.body;
        const response = await login(loginUserArgs);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error logging in user', error);
        return error;
    }
}

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const logoutUserArgs: LogoutUserArgs = req.body;
        const response = await logout(logoutUserArgs);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error logging out user', error);
        return error;
    }
}

export const getUserProfileForMyself = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.body;
        const response = await getUserProfile(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error getting user profile', error);
        return error;
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const { refreshToken } = req.body;
        const response = await refreshAccessToken(refreshToken);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error refreshing token', error);
        return error;
    }
}