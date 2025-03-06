export interface RegisterUserArgs {
    username: string,
    email: string,
    password: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    postalCode: string,
    country: string,
    countryCode: string
}

export interface VerifyOtpArgs {
    phoneNumber: string,
    otp: string
}

export interface LoginUserArgs {
    email: string,
    password: string
}

export interface LogoutUserArgs {
    userId: string,
    refreshToken: string
}