import twilio from 'twilio';

// WRITING THESE FUNCTIONS JUST FOR THE SAKE OF DEMONSTRATION
// AS OF NOW THESE FUNCTIONS ARE NOT BEING USED IN THE APPLICATION

export class UniversalService {
    // Create a Twilio client
    static getTwilioClient = () => {
        return twilio(process.env.TWILIO_APIKEY_SID,
            process.env.TWILIO_AUTH_TOKEN,
            { accountSid: process.env.TWILIO_ACCOUNT_SID });
    };

    static async checkNumberRegion(countryCode: string, phoneNumber: string): Promise<string> {
        try {
            const twilioClient = this.getTwilioClient();
            const number = await twilioClient.lookups.v1
                .phoneNumbers(countryCode + phoneNumber)
                .fetch({ type: ['carrier', 'caller-name'] });

            return number.countryCode; // phoneNumber region
        } catch (error) {
            console.error('Error retrieving phone number information:', error);
            throw error;
        }
    }

    static async validatePhoneNumber(countryCode: string, phoneNumber: string): Promise<boolean> {
        try {
            const twilioClient = this.getTwilioClient();
            await twilioClient.lookups.v1.phoneNumbers(countryCode + phoneNumber).fetch();
            return true;
        } catch (error) {
            return false;
        }
    }

    async sendSMS(countryCode: string, phoneNumber: string, message: string): Promise<any> {
        try {
            // Use the Twilio client to send a message
            const twilioClient = UniversalService.getTwilioClient();
            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: countryCode + phoneNumber
            });
            console.log(`Message (${message}) sent to ${countryCode}-${phoneNumber}`);
            return;
        } catch (error) {
            console.error('Error in sending otp', error);
            throw error;
        }
    }

    static async sendOtp(countryCode: string, phoneNumber: string): Promise<any> {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
            const OTP_EXPIRY_TIME = 5 * 60 * 1000;
            const twilioClient = UniversalService.getTwilioClient();

            await twilioClient.messages.create({
                body: `Your OTP is ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `${countryCode}-${phoneNumber}`,
            });

            return { message: "OTP sent successfully" };
        } catch (error) {
            console.log('Error sending otp');
            return error;
        }
    }
}

