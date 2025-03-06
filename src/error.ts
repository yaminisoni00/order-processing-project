export const ERROR_TYPES = {
    USER_ALREADY_EXISTS: {
        code: 400,
        message: 'User already exists'
    },
    VERIFICATION_FAILED: {
        code: 400,
        message: 'Verification failed'
    },
    USER_DOES_NOT_EXISTS: {
        code: 400,
        message: 'User does not exists'
    },
    INVALID_PHONE_NUMBER: {
        code: 400,
        message: 'Invalid phone number'
    },
    INVALID_PASSWORD: {
        code: 400,
        message: 'Invalid password'
    },
    INVALID_REFRESH_TOKEN: {
        code: 400,
        message: 'Invalid refresh token'
    },
    INVALID_ACCESS_TOKEN: {
        code: 400,
        message: 'Invalid access token'
    },
    ORDER_NOT_FOUND: {
        code: 400,
        message: 'Order not found'
    },
    INVENTORY_ITEM_NOT_FOUND: {
        code: 400,
        message: 'Inventory item not found'
    },
    NOT_ENOUGH_STOCK_FOR_ORDER: {
        code: 400,
        message: 'Not enough stock for order'
    },
    ORDER_FAILED_AFTER_MULTIPLE_RETRIES: {
        code: 400,
        message: 'Order failed after multiple retries'
    }
}