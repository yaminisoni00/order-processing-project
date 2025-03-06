import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const ses = new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

export const sendOrderNotifications = async (email: string, orderData: any) => {
    try {
        if (!process.env.SES_SENDER_EMAIL) {
            throw new Error('SES_SENDER_EMAIL environment variable is not defined');
        }

        const params = {
            Source: process.env.SES_SENDER_EMAIL,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: `Order Confirmation - ${orderData._id}`,
                },
                Body: {
                    Text: {
                        Data: `Hello, Your order has been processed successfully.\n\nOrder Details:\nOrder ID: ${orderData._id}\nItems: ${JSON.stringify(orderData.items, null, 2)}\nStatus: ${orderData.status}`
                    }
                }
            }
        }
        
        const result = await ses.sendEmail(params).promise();
        console.log('✅ Email sent successfully:', result);
        return result;

    } catch (error) {
        console.log('Error sending order notifications', error);
        return error;
    }
}