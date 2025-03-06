import { ERROR_TYPES } from "../error";
import User from "../models/user.model";
import { generateToken } from "../tokens/generateToken";
import { UniversalService } from "../universal/universal.service";
import { LoginUserArgs, LogoutUserArgs, RegisterUserArgs, VerifyOtpArgs } from "./args/user.args";
import bcrypt from 'bcryptjs';
import moment from 'moment';
import jwt from 'jsonwebtoken'
import { SUCCESS_TYPES } from "../success";

export const registerUser = async (registerUserArgs: RegisterUserArgs) => {
    try {
        const existingUser = await User.findOne({
            email: registerUserArgs.email,
            username: registerUserArgs.username,
            phoneNumber: registerUserArgs.phoneNumber,
        });
        // IF USER ALREADY EXISTS
        if (existingUser) {
            throw new Error(ERROR_TYPES.USER_ALREADY_EXISTS.message);
        }

        // VERIFYING THE PHONE NUMBER USING TWILIO - AS OF NOW IT IS COMMENTED, JUST TO SHOW THE FLOW
        // const phoneNumber = await UniversalService.checkNumberRegion(registerUserArgs.countryCode, registerUserArgs.phoneNumber);
        // if (phoneNumber !== registerUserArgs.countryCode) {
        //     throw new Error(ERROR_TYPES.VERIFICATION_FAILED.message);
        // }

        // SENDING OTP USING TWILIO - AS OF NOW IT IS COMMENTED, JUST TO SHOW THE FLOW
        // const otp = await UniversalService.sendOtp(registerUserArgs.countryCode,registerUserArgs.phoneNumber);

        const otp = 1234; // TAKING RANDOM OTP
        // HASHING THE PASSWORD
        const hashedPassword = await bcrypt.hash(registerUserArgs.password, 10);
        const newUser = new User({
            username: registerUserArgs.username,
            email: registerUserArgs.email,
            password: hashedPassword,
            firstName: registerUserArgs.firstName,
            lastName: registerUserArgs.lastName,
            phoneNumber: registerUserArgs.phoneNumber,
            address: registerUserArgs.address,
            city: registerUserArgs.city,
            postalCode: registerUserArgs.postalCode,
            country: registerUserArgs.country,
            countryCode: registerUserArgs.countryCode,
            token: '',
            otp: otp,
            otpGeneratedAt: moment().toDate(),
            isPhoneNumberVerified: false,
        });
        await newUser.save();

        return { newUser, message: SUCCESS_TYPES.USER_REGISTERED.message };
    } catch (error) {
        console.log('Error registering user', error);
        return error;
    }
}

export const verifyOtp = async (verifyOtpArgs: VerifyOtpArgs): Promise<any> => {
    try {
        const userExists = await User.findOne({ phoneNumber: verifyOtpArgs.phoneNumber });
        if (!userExists) {
            return { message: ERROR_TYPES.USER_DOES_NOT_EXISTS.message };
        }

        console.log('userExists.otp: ', userExists.otp)
        console.log('verifyOtpArgs.otp: ', verifyOtpArgs.otp)
        if (userExists.otp !== verifyOtpArgs.otp) {
            return { message: ERROR_TYPES.VERIFICATION_FAILED.message };
        }

        userExists.isPhoneNumberVerified = true;
        userExists.otp = '';
        userExists.otpGeneratedAt = new Date(0);
        await userExists.save();
        return { message: SUCCESS_TYPES.OTP_VERIFIED.message };

    } catch (error) {
        console.log('Error verifying OTP', error);
        return error;
    }
}

export const login = async (loginUserArgs: LoginUserArgs): Promise<any> => {
    try {
        const userExists = await User.findOne({ email: loginUserArgs.email });
        if (!userExists) {
            return { message: ERROR_TYPES.USER_DOES_NOT_EXISTS.message };
        }

        // VERIFYING THE PASSWORD
        const isPasswordValid = await bcrypt.compare(loginUserArgs.password, userExists.password);
        if (!isPasswordValid) {
            return { message: ERROR_TYPES.INVALID_PASSWORD.message };
        }

        const { accessToken, refreshToken } = await generateToken(userExists);
        userExists.refreshToken = refreshToken;
        userExists.accessToken = accessToken;
        await userExists.save();
        return { message: SUCCESS_TYPES.USER_LOGGED_IN.message, accessToken, refreshToken };
    } catch (error) {
        console.log('Error logging in user', error);
        return error;
    }
}

export const logout = async (logoutUserArgs: LogoutUserArgs): Promise<any> => {
    try {
        const userExists = await User.findOne({ _id: logoutUserArgs.userId });
        if (!userExists) {
            throw new Error(ERROR_TYPES.USER_DOES_NOT_EXISTS.message);
        }
        if (!logoutUserArgs.refreshToken) {
            throw new Error(ERROR_TYPES.INVALID_REFRESH_TOKEN.message);
        }
        userExists.refreshToken = '';
        await userExists.save();
        return { message: SUCCESS_TYPES.USER_LOGGED_OUT.message };
    } catch (error) {
        console.log('Error logging out user', error);
        return error;
    }
}

// GET USER PROFILE API TO TEST AUTH MIDDLEWARE
export const getUserProfile = async (userId: string): Promise<any> => {
    try {
        const userExists = await User.findOne({ _id: userId });
        if (!userExists) {
            throw new Error(ERROR_TYPES.USER_DOES_NOT_EXISTS.message);
        }
        return { userExists, message: SUCCESS_TYPES.USER_FETCHED.message };
    } catch (error) {
        console.log('Error getting user profile and details', error);
        return error;
    }
}

export const refreshTokenLogic = async (refreshToken: string): Promise<any> => {
    try {
        const userExists = await User.findOne({ refreshToken: refreshToken });
        if (!userExists) {
            throw new Error(ERROR_TYPES.INVALID_REFRESH_TOKEN.message);
        }
        const decodedToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

        const newAccessToken = jwt.sign({ userId: decodedToken.userId, email: decodedToken.email, username: decodedToken.username },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15m' }
        );
        return newAccessToken;
    } catch (error) {
        console.log('Error refreshing token', error);
        return error;
    }
}




