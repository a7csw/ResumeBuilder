# 🚀 Paddle Payment Integration Setup Guide

## Overview
Your Resume Builder now has complete Paddle payment integration using the modern `@paddle/paddle-node-sdk v3.2.0`. This guide will help you configure Paddle for both development and production.

## ✅ What's Already Implemented

### 🔧 Backend Integration
- **Modern Paddle SDK**: Using `@paddle/paddle-node-sdk v3.2.0`
- **Secure Webhooks**: Proper signature verification with raw body preservation
- **Payment Endpoints**: 
  - `POST /api/v1/payments/checkout` - Create checkout URLs
  - `POST /api/v1/payments/webhook/paddle` - Handle Paddle webhooks
- **Event Handling**: Automatic user plan upgrades and subscription management
- **Vercel Compatible**: Optimized for serverless deployment

### 🎯 Supported Features
- ✅ One-time payments (Basic plan - $5)
- ✅ Recurring subscriptions (Pro plan - $11/month)
- ✅ Webhook event processing
- ✅ Automatic user plan upgrades
- ✅ Payment verification
- ✅ Subscription cancellation
- ✅ Refund handling

## 🛠️ Setup Instructions

### 1. Paddle Dashboard Configuration

#### Create a Paddle Account
1. Go to [Paddle.com](https://paddle.com) and create an account
2. Complete your seller verification process
3. Access your [Paddle Dashboard](https://vendors.paddle.com)

#### Create Products and Prices
1. **Navigate to Catalog > Products**
2. **Create Basic Plan Product:**
   ```
   Name: Resume Builder - Basic Plan
   Description: One-time access to basic resume building features
   Type: Standard Product
   ```

3. **Create Pro Plan Product:**
   ```
   Name: Resume Builder - Pro Plan  
   Description: Monthly subscription with unlimited AI generations
   Type: Standard Product
   ```

4. **Create Prices for Each Product:**
   
   **Basic Plan Price:**
   ```
   Product: Resume Builder - Basic Plan
   Amount: $5.00 USD
   Billing Cycle: One-time
   Price ID: Will generate something like "pri_01abc123..."
   ```
   
   **Pro Plan Price:**
   ```
   Product: Resume Builder - Pro Plan
   Amount: $11.00 USD
   Billing Cycle: Monthly
   Price ID: Will generate something like "pri_01def456..."
   ```

### 2. Environment Variables Setup

#### For Development (.env)
```bash
# Paddle Configuration (Modern SDK)
PADDLE_API_KEY=your_paddle_api_key_here
PADDLE_ENVIRONMENT=sandbox
PADDLE_WEBHOOK_SECRET=your_webhook_secret_here

# Paddle Price IDs (from dashboard)
PADDLE_BASIC_PLAN_ID=pri_01abc123...
PADDLE_PRO_PLAN_ID=pri_01def456...

# Other required variables
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

#### For Production (Vercel Environment Variables)
Set these in your Vercel dashboard:
```bash
PADDLE_API_KEY=your_production_paddle_api_key
PADDLE_ENVIRONMENT=production
PADDLE_WEBHOOK_SECRET=your_production_webhook_secret
PADDLE_BASIC_PLAN_ID=pri_production_basic_id
PADDLE_PRO_PLAN_ID=pri_production_pro_id
```

### 3. Webhook Configuration

#### Paddle Dashboard Webhook Setup
1. **Go to Developer Tools > Webhooks**
2. **Create New Webhook:**
   ```
   Webhook URL: https://your-domain.vercel.app/api/v1/payments/webhook/paddle
   Events to Subscribe:
   - transaction.completed
   - transaction.payment_failed
   - subscription.created
   - subscription.updated
   - subscription.canceled
   - adjustment.created
   ```
3. **Copy the Webhook Secret** and add to environment variables

#### Webhook Security
- ✅ Signature verification implemented
- ✅ Raw body preservation for verification
- ✅ IP restriction capability
- ✅ Proper error handling

### 4. Testing the Integration

#### Local Testing
```bash
# Start the backend
cd backend
npm run dev

# Test health endpoint
curl http://localhost:5000/api/v1/health

# Test checkout creation (requires auth token)
curl -X POST http://localhost:5000/api/v1/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"planId": "basic"}'
```

#### Webhook Testing
Use Paddle's webhook testing tool or ngrok for local testing:
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 5000

# Use the ngrok URL in Paddle webhook settings
# https://abc123.ngrok.io/api/v1/payments/webhook/paddle
```

### 5. Frontend Integration

#### Payment Button Implementation
```javascript
// Create checkout and redirect to Paddle
const handlePayment = async (planId) => {
  try {
    const response = await fetch('/api/v1/payments/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ planId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      window.location.href = data.data.checkoutUrl;
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

## 🔧 API Endpoints Reference

### Create Checkout
```http
POST /api/v1/payments/checkout
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "planId": "basic" | "pro"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout URL generated successfully",
  "data": {
    "checkoutUrl": "https://buy.paddle.com/checkout/...",
    "plan": "basic",
    "price": 5.00,
    "currency": "USD"
  }
}
```

### Webhook Endpoint
```http
POST /api/v1/payments/webhook/paddle
Paddle-Signature: <signature>
Content-Type: application/json

{
  "eventType": "transaction.completed",
  "data": { ... }
}
```

## 🚨 Important Notes

### Security Considerations
- ✅ Never expose API keys in frontend code
- ✅ Webhook signature verification is mandatory
- ✅ Use HTTPS in production
- ✅ Implement proper error handling

### Paddle Dashboard Navigation
- **Modern Dashboard**: Use the new Paddle dashboard (not Classic)
- **Price IDs**: Use Price IDs (not Product IDs) for the modern SDK
- **Webhooks**: Configure in Developer Tools, not Classic Webhooks

### Vercel Deployment
- ✅ Environment variables configured
- ✅ Serverless function compatibility
- ✅ Raw body middleware for webhooks
- ✅ Proper CORS configuration

## 🎯 Next Steps

1. **Configure Paddle Dashboard** with your products and prices
2. **Set Environment Variables** in both development and production
3. **Test Payment Flow** with Paddle's sandbox environment
4. **Deploy to Vercel** with production Paddle configuration
5. **Monitor Webhooks** in Paddle dashboard for successful processing

## 🔗 Useful Links

- [Paddle Dashboard](https://vendors.paddle.com)
- [Paddle Developer Docs](https://developer.paddle.com)
- [Node.js SDK Documentation](https://developer.paddle.com/sdks/nodejs)
- [Webhook Reference](https://developer.paddle.com/webhooks/overview)

---

**🚀 Your Resume Builder is now ready for secure payment processing with Paddle!**
