# 🚀 NovaCV Backend

A robust Node.js Express backend with **Paddle payment integration** for the NovaCV resume builder platform.

---

## 🌟 Features

### **💳 Payment Integration**
- **Paddle checkout** for subscription plans
- **Webhook processing** for real-time subscription updates
- **Two-tier pricing**: Basic ($5/10 days) & Professional ($11/month)
- **Subscription lifecycle management** (create, update, cancel)
- **Payment verification and security**

### **🔐 Authentication & Security**
- **JWT-based authentication** with refresh tokens
- **Comprehensive middleware** for security (Helmet, CORS, Rate Limiting)
- **Input validation and sanitization**
- **Role-based access control**
- **Password encryption** with bcrypt

### **📊 User Management**
- **Complete user profiles** with subscription tracking
- **Usage analytics** and limits enforcement
- **Feature access control** based on subscription
- **Account management** (update, delete, password reset)

### **🏗️ Professional Architecture**
- **Organized folder structure** with separation of concerns
- **Comprehensive error handling** with custom error classes
- **Logging system** with file and console output
- **Database models** with Mongoose schemas
- **API versioning** and documentation

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── config.js     # Main app configuration
│   │   └── database.js   # Database connection
│   ├── controllers/      # Route controllers
│   │   ├── paymentController.js
│   │   └── userController.js
│   ├── middlewares/      # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── errorHandler.js
│   │   ├── security.js   # Security middleware
│   │   └── validation.js # Input validation
│   ├── models/           # Database models
│   │   ├── User.js       # User schema
│   │   └── Subscription.js
│   ├── routes/           # API routes
│   │   ├── index.js      # Main router
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── services/         # Business logic
│   │   └── paddleService.js
│   ├── utils/            # Utility functions
│   │   ├── helpers.js    # Common utilities
│   │   └── logger.js     # Logging utility
│   └── server.js         # Main server file
├── logs/                 # Application logs
├── env.example          # Environment variables template
├── package.json         # Dependencies and scripts
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+ 
- MongoDB database
- Paddle account with configured products

### **1. Installation**

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env
```

### **2. Environment Setup**

Edit `.env` file with your configuration:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/novacv

# JWT
JWT_SECRET=your-super-secure-jwt-secret

# Paddle Configuration
PADDLE_VENDOR_ID=your-paddle-vendor-id
PADDLE_API_KEY=your-paddle-api-key
PADDLE_PUBLIC_KEY=your-paddle-public-key
PADDLE_ENVIRONMENT=sandbox

# Paddle Product IDs
PADDLE_BASIC_PLAN_ID=your-basic-plan-product-id
PADDLE_PRO_PLAN_ID=your-pro-plan-product-id

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### **3. Start Development Server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

---

## 📖 API Documentation

### **Base URL**
```
http://localhost:5000/api/v1
```

### **Authentication**
Include JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### **🔐 User Endpoints**

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

### **💳 Payment Endpoints**

#### Get Plans
```http
GET /payments/plans
```

#### Create Checkout
```http
POST /payments/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "basic",
  "userId": "user-id",
  "successUrl": "https://yourdomain.com/success",
  "cancelUrl": "https://yourdomain.com/cancel"
}
```

#### Get Subscription
```http
GET /payments/subscription
Authorization: Bearer <token>
```

#### Cancel Subscription
```http
POST /payments/subscription/cancel
Authorization: Bearer <token>
```

#### Paddle Webhook
```http
POST /payments/webhook/paddle
Content-Type: application/json

{
  "alert_name": "subscription_created",
  "alert_id": "123456",
  "passthrough": "{\"userId\":\"user-id\",\"planId\":\"basic\"}"
}
```

---

## 🗄️ Database Models

### **User Model**
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  subscription: {
    plan: String (free|basic|pro),
    status: String (active|cancelled|expired),
    startDate: Date,
    endDate: Date,
    paddleSubscriptionId: String,
    paddleCustomerId: String
  },
  usage: {
    aiGenerations: {
      used: Number,
      limit: Number
    },
    templatesUsed: [String],
    exportsThisMonth: {
      pdf: Number,
      docx: Number
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Subscription Model**
```javascript
{
  userId: ObjectId,
  paddleSubscriptionId: String,
  paddleCustomerId: String,
  plan: String (basic|pro),
  status: String (active|cancelled|deleted),
  startDate: Date,
  endDate: Date,
  nextBillDate: Date,
  currency: String,
  unitPrice: Number,
  events: [Object], // Webhook events log
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Features

### **Authentication Security**
- JWT tokens with configurable expiration
- Refresh token rotation
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints

### **API Security**
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Request size limiting
- IP whitelisting for webhooks

### **Data Protection**
- MongoDB injection prevention
- XSS protection
- SQL injection prevention
- Sensitive data masking in logs

---

## 🧪 Testing

### **Manual Testing**

Test the API endpoints:

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Register user
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"Test123456","confirmPassword":"Test123456"}'

# Get plans
curl http://localhost:5000/api/v1/payments/plans
```

### **Paddle Webhook Testing**

Use Paddle's webhook testing tools or simulate with:

```bash
curl -X POST http://localhost:5000/api/v1/payments/webhook/paddle \
  -H "Content-Type: application/json" \
  -d '{
    "alert_name": "subscription_created",
    "alert_id": "test-123",
    "subscription_id": "sub_123",
    "user_id": "customer_123",
    "subscription_plan_id": "plan_123",
    "status": "active",
    "unit_price": "11.00",
    "currency": "USD",
    "passthrough": "{\"userId\":\"user-id\",\"planId\":\"pro\"}"
  }'
```

---

## 📊 Monitoring & Logging

### **Application Logs**
Logs are written to `logs/app.log` and console:

```bash
# View logs in development
npm run dev

# View log file
tail -f logs/app.log
```

### **Log Levels**
- **ERROR**: Application errors, failed operations
- **WARN**: Warnings, deprecated usage
- **INFO**: General information, HTTP requests
- **DEBUG**: Detailed debugging information

### **Monitoring Endpoints**

#### Health Check
```http
GET /api/v1/health
```

#### System Info
```http
GET /api/v1/info
```

---

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development`, `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/novacv` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `PADDLE_VENDOR_ID` | Paddle vendor ID | `12345` |
| `PADDLE_API_KEY` | Paddle API key | `your-api-key` |
| `PADDLE_ENVIRONMENT` | Paddle environment | `sandbox`, `production` |

### **Subscription Plans**

Configure your plans in `src/config/config.js`:

```javascript
subscriptionPlans: {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 5.00,
    duration: 10, // days
    features: {
      aiGenerations: 1,
      templates: 3,
      exports: ['pdf'],
      watermark: true
    }
  },
  pro: {
    id: 'pro',
    name: 'Professional Plan', 
    price: 11.00,
    recurring: true,
    features: {
      aiGenerations: -1, // unlimited
      templates: 20,
      exports: ['pdf', 'docx'],
      watermark: false
    }
  }
}
```

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive production deployment guide.

### **Quick Deploy Steps**
1. Set up server (Ubuntu/Linux)
2. Install Node.js and MongoDB
3. Configure environment variables
4. Set up Nginx reverse proxy
5. Configure SSL certificate
6. Set up Paddle webhooks
7. Deploy with PM2

### **Docker Deployment** (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["node", "src/server.js"]
```

---

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### **Coding Standards**
- Use ES6+ features
- Follow consistent naming conventions
- Add JSDoc comments for functions
- Validate all inputs
- Handle errors gracefully
- Write comprehensive tests

---

## 📝 License

This project is licensed under the MIT License.

---

## 🆘 Support

### **Common Issues**

1. **MongoDB Connection Failed**
   - Check connection string
   - Ensure MongoDB is running
   - Verify network access

2. **Paddle Webhook Not Working**
   - Verify webhook URL is accessible
   - Check signature verification
   - Ensure correct HTTP method (POST)

3. **JWT Token Invalid**
   - Check token expiration
   - Verify JWT secret matches
   - Ensure proper Authorization header format

### **Getting Help**
- Review logs in `logs/app.log`
- Check API documentation
- Verify environment variables
- Test with curl commands

---

## 🎉 Ready to Launch!

Your NovaCV backend is now configured with:

✅ **Paddle Payment Integration**
✅ **Secure Authentication System**  
✅ **Professional API Structure**
✅ **Comprehensive Error Handling**
✅ **Production-Ready Security**
✅ **Detailed Logging & Monitoring**

**Next Steps:**
1. Configure your Paddle account
2. Set up your environment variables
3. Deploy to production
4. Connect your frontend
5. Start building amazing resumes! 🚀

---

**Happy Coding! 💻✨**
