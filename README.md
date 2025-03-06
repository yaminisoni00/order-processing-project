ORDER PROCESSING SYSTEM
- A scalable Order Processing System using Node.js, Express.js, MongoDB, Redis, AWS SQS, and AWS SES.
- Handles authentication, order management, inventory tracking, async processing, caching, and email notifications.

FEATURES: 
- JWT Authentication (Access & Refresh Tokens)
- Order Management (MongoDB, User-Order relation)
- Inventory Tracking (Stock validation before order confirmation)
- Redis Caching (Order data for quick retrieval)
- Async Order Processing (AWS SQS for background processing)
- Email Notifications (AWS SES for order confirmation)
- Retry Mechanisms & Error Handling

TECH STACK
- BACKEND: Node.js, Express.js
- DATABASE: MongoDB (Mongoose)
- CACHING: Redis (Aiven, RedisInsight)
- QUEUE PROCESSING: AWS SQS
- EMAIL SERVICE: AWS SES
- AUTHENTICATION: JWT & Refresh Tokens

SETUP INSTRUCTIONS
1. Clone the repository
2. Install Dependencies: npm i -f
3. Configure Environment Variables:
MONGO_URI=""
PORT=5000
ACCESS_TOKEN_SECRET="accessTokenSecret"
REFRESH_TOKEN_SECRET="refreshTokenSecret"
JWT_SECRET="jwtSecret"
TWILIO_APIKEY_SID="AC"
TWILIO_AUTH_TOKEN="twilio-auth-token"
TWILIO_ACCOUNT_SID="twilio-account-sid"
TWILIO_PHONE_NUMBER=""
REDIS_HOST=""
REDIS_PORT=
REDIS_USERNAME=""
REDIS_PASSWORD=""
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-region"
AWS_SQS_QUEUE_URL="your-sqs-queue-url"
SES_SENDER_EMAIL="your-ses-sender-email"
4. Start MondoDB & Redis
5. Start the dev server (Typescript): npm run dev 
   To build the project: npm run build (Compile typescript)
   To start the production server: npm start
   To start the worker: npm run worker
6. Start order processing queue

API ENDPOINTS
1. AUTHENTICATION
- USER REGISTERATION
Endpoint: POST /api/auth/register
Description: Registers a new user and sends an OTP for email verification.

- VERIFY OTP
Endpoint: POST /api/auth/verify-otp
Description: Verifies the OTP sent to the user's email.

- USER LOGIN 
Endpoint: POST /api/auth/login
Description: This API allows users to log in using their email and password. It returns an access token (for making authenticated requests) and a refresh token (to get a new access token when it expires).

- REFRESH TOKEN
Endpoint: POST /api/auth/refresh
Description: This API generates a new access token using a valid refresh token. This helps the user stay logged in without re-entering credentials.

🔹 LOGOUT
Endpoint: POST /api/auth/logout
Description: Logs out the user by invalidating the refresh token.

2. ORDERS
- Create Order
Endpoint: POST /api/orders
Description: This API creates a new order for a user. It saves the order in the database and sends it to AWS SQS for asynchronous processing.
Headers: (Requires authentication)

- Get Order by ID
Endpoint: GET /api/orders/:id
Description: This API retrieves order details. It first checks Redis cache for fast retrieval. If not found in Redis, it fetches from MongoDB and stores it in Redis for future requests.
Headers: (Requires authentication)

- Process Order (Worker - AWS SQS)
Triggered By: AWS SQS (Worker Process)
Description: Orders are stored in a queue and processed asynchronously. The worker:
- Updates the order status in MongoDB
- Sends a confirmation email via AWS SES
- Deletes the order from the queue after processing

No direct API call required; this runs in the background.

EMAIL NOTIFICATIONS
- Triggered Automatically when an order is processed.
- Sent via AWS SES
