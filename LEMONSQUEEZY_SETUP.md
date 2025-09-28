# 🍋 LemonSqueezy Integration Setup Guide

## Overview
Complete integration guide for LemonSqueezy payment processing in the ResumeBuilder application. This includes checkout, webhooks, customer management, and subscription handling.

## ✅ What's Already Implemented

### 🔧 Frontend Integration
- **LemonSqueezy.js SDK**: Complete client-side integration
- **Checkout Page**: Professional checkout with product selection
- **Success Page**: Post-purchase confirmation and next steps
- **Plan Selection**: Integration with existing form flow
- **Test Mode Support**: Automatic test mode detection and UI indicators

### 🎯 Backend Integration
- **Webhook Handling**: Complete webhook event processing
- **Customer Management**: User creation and access control
- **Order Tracking**: Database storage for orders and subscriptions
- **Access Control**: Product-based feature gating
- **Event Logging**: Comprehensive webhook event storage

### 📊 Supported Features
- ✅ One-time payments (Single Resume - $2)
- ✅ Time-limited access (Basic Plan - $5/10 days)
- ✅ Monthly subscriptions (Professional Plan - $11/month)
- ✅ "Pay what you want" pricing option
- ✅ Webhook event processing (orders, subscriptions, refunds)
- ✅ Customer access management
- ✅ Test mode with visual indicators

## 🛠️ Setup Instructions

### 1. LemonSqueezy Dashboard Configuration

#### A. Create LemonSqueezy Account
1. Go to [LemonSqueezy.com](https://lemonsqueezy.com) and create an account
2. Complete your store setup and identity verification
3. Set your currency to **USD**
4. Enable **Test Mode** for development

#### B. Get Your API Keys
1. Go to **Settings > API** in your LemonSqueezy dashboard
2. Copy your **API Key** (starts with `lmsq_api_`)
3. Copy your **Store ID** from **Settings > Stores**

#### C. Create Products and Variants
Create these three products in your LemonSqueezy dashboard:

**1. Single Resume ($2)**
```
Name: Single Resume
Description: One-time professional resume generation
Price: $2.00 USD
Type: One-time payment
```

**2. Basic Plan ($5)**
```
Name: Basic Plan  
Description: 10 days unlimited resume generation
Price: $5.00 USD
Type: One-time payment
```

**3. Professional Plan ($11)**
```
Name: Professional Plan
Description: Monthly subscription with unlimited access
Price: $11.00 USD
Type: Subscription (Monthly)
```

#### D. Configure Webhooks
1. Go to **Settings > Webhooks**
2. Add webhook endpoint: `https://your-domain.com/api/v1/lemonsqueezy/webhook`
3. Select **ALL** events (or specific ones you need):
   - `order_created`
   - `order_refunded`
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
   - `subscription_payment_success`
   - `subscription_payment_failed`
4. Copy the **Webhook Secret**

### 2. Environment Configuration

#### Frontend Environment Variables
Create/update `frontend/.env.local`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# LemonSqueezy Configuration
VITE_LEMONSQUEEZY_STORE_ID=your-store-id-here
VITE_LEMONSQUEEZY_TEST_MODE=true
VITE_LEMONSQUEEZY_CHECKOUT_URL=https://your-store.lemonsqueezy.com/checkout

# Application Configuration
VITE_APP_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

#### Backend Environment Variables
Create/update `backend/.env.local`:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=lmsq_api_your-api-key-here
LEMONSQUEEZY_STORE_ID=your-store-id-here
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret-here
LEMONSQUEEZY_TEST_MODE=true

# Other Configuration
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Update Product Configuration

#### A. Get Variant IDs
After creating products in LemonSqueezy, you need to get the **Variant IDs**:

1. Go to your LemonSqueezy dashboard
2. Navigate to **Products**
3. Click on each product and copy the **Variant ID**
4. Update the variant IDs in `frontend/src/lib/lemonsqueezy.ts`:

```typescript
export const PRODUCTS: Record<string, LemonProduct> = {
  single: {
    // ... other properties
    variantId: 'PASTE_SINGLE_VARIANT_ID_HERE',
  },
  basic: {
    // ... other properties  
    variantId: 'PASTE_BASIC_VARIANT_ID_HERE',
  },
  professional: {
    // ... other properties
    variantId: 'PASTE_PROFESSIONAL_VARIANT_ID_HERE',
  }
};
```

### 4. Database Schema

#### A. Required Tables
Add these tables to your Supabase database:

```sql
-- Webhook events tracking
CREATE TABLE lemonsqueezy_webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  test_mode BOOLEAN DEFAULT false,
  data JSONB NOT NULL,
  meta JSONB NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders tracking
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lemonsqueezy_order_id VARCHAR(255) UNIQUE NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  variant_id VARCHAR(100) NOT NULL,
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  test_mode BOOLEAN DEFAULT false,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions tracking
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lemonsqueezy_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  variant_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  test_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User access control
CREATE TABLE user_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL,
  variant_id VARCHAR(100) NOT NULL,
  access_type VARCHAR(50) NOT NULL, -- 'lifetime', 'temporary', 'subscription'
  expires_at TIMESTAMPTZ,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Indexes for performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_lemonsqueezy_id ON orders(lemonsqueezy_order_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_lemonsqueezy_id ON subscriptions(lemonsqueezy_subscription_id);
CREATE INDEX idx_user_access_user_id ON user_access(user_id);
CREATE INDEX idx_webhook_events_event_id ON lemonsqueezy_webhook_events(event_id);
```

#### B. Row Level Security (RLS)
Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions policies  
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- User access policies
CREATE POLICY "Users can view own access" ON user_access
  FOR SELECT USING (auth.uid() = user_id);
```

### 5. Testing Setup

#### A. Test the Integration
1. **Start your servers**:
   ```bash
   # Backend
   cd backend && npm start
   
   # Frontend  
   cd frontend && npm run dev
   ```

2. **Test the flow**:
   - Fill out resume form
   - Select a plan
   - Complete checkout (use test mode)
   - Verify webhook processing
   - Check database records

#### B. Test Cards (LemonSqueezy Test Mode)
Use these test card numbers in test mode:
- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0000 0000 3220`

### 6. Production Deployment

#### A. Environment Setup
1. **Set test mode to false**:
   ```bash
   LEMONSQUEEZY_TEST_MODE=false
   VITE_LEMONSQUEEZY_TEST_MODE=false
   ```

2. **Update webhook URL** in LemonSqueezy dashboard to your production domain

3. **Update redirect URLs** in checkout configuration

#### B. Security Checklist
- ✅ Environment variables properly set
- ✅ Webhook signature verification enabled
- ✅ HTTPS enabled for webhook endpoint
- ✅ Database RLS policies configured
- ✅ API keys secured and not exposed in frontend

## 🧪 Testing Guide

### Manual Testing Checklist

#### User Flow Testing
- [ ] **Form Submission**: User fills form and reaches plan selection
- [ ] **Plan Selection**: User can select different plans
- [ ] **Checkout Process**: LemonSqueezy checkout loads correctly
- [ ] **Payment Processing**: Test payments complete successfully
- [ ] **Success Page**: Users see confirmation after payment
- [ ] **Resume Generation**: Paid users can generate resumes
- [ ] **Access Control**: Unpaid users cannot access features

#### Webhook Testing
- [ ] **Order Created**: Webhook received and processed
- [ ] **User Creation**: New users created automatically
- [ ] **Access Granted**: Users get appropriate access after payment
- [ ] **Subscription Events**: Subscription webhooks processed correctly
- [ ] **Refund Handling**: Access revoked after refund

#### Error Handling
- [ ] **Invalid Webhooks**: Properly rejected with 401/400
- [ ] **Failed Payments**: Users see appropriate error messages
- [ ] **Network Issues**: Graceful degradation and retry logic
- [ ] **Database Errors**: Proper error logging and user feedback

### API Testing

#### Test Webhook Endpoint
```bash
curl -X POST http://localhost:3000/api/v1/lemonsqueezy/webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: test-signature" \
  -d '{"test": "webhook"}'
```

#### Test Product Endpoint
```bash
curl http://localhost:3000/api/v1/lemonsqueezy/products
```

#### Test Health Endpoint
```bash
curl http://localhost:3000/api/v1/lemonsqueezy/health
```

## 🎯 Integration Points

### Frontend Integration
- **Plan Selection**: `PlanSelection.tsx` → `LemonSqueezyCheckout.tsx`
- **Checkout Flow**: LemonSqueezy embedded checkout
- **Success Handling**: `CheckoutSuccess.tsx` → Resume generation
- **Access Control**: Check user purchase status before features

### Backend Integration
- **Webhook Processing**: Automatic user and access management
- **Database Updates**: Real-time order and subscription tracking
- **Access Control**: API endpoint to check user access status
- **Event Logging**: Complete audit trail of all webhook events

## 🔧 Troubleshooting

### Common Issues

#### 1. Webhooks Not Received
- Check webhook URL is correct and accessible
- Verify webhook secret matches
- Check server logs for errors
- Test webhook endpoint manually

#### 2. Checkout Not Loading
- Verify variant IDs are correct
- Check LemonSqueezy script is loaded
- Verify store ID and test mode settings
- Check browser console for errors

#### 3. Access Not Granted
- Check webhook processing logs
- Verify user creation in database
- Check access table for granted permissions
- Verify order/subscription status

#### 4. Test Mode Issues
- Ensure both frontend and backend have test mode enabled
- Use test card numbers only
- Check LemonSqueezy dashboard test mode is active

### Debug Commands

#### Check webhook events:
```sql
SELECT * FROM lemonsqueezy_webhook_events ORDER BY created_at DESC LIMIT 10;
```

#### Check user access:
```sql
SELECT * FROM user_access WHERE user_id = 'user-uuid';
```

#### Check recent orders:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

## 📞 Support

### LemonSqueezy Resources
- [LemonSqueezy Documentation](https://docs.lemonsqueezy.com/)
- [API Reference](https://docs.lemonsqueezy.com/api)
- [Webhooks Guide](https://docs.lemonsqueezy.com/webhooks)
- [SDK Documentation](https://github.com/lmsqueezy/lemonsqueezy.js)

### Need Help?
1. Check the logs in `backend/logs/` directory
2. Review webhook events in database
3. Test with LemonSqueezy's webhook testing tool
4. Contact LemonSqueezy support for payment issues

---

## 🎉 Launch Checklist

Before going live:

- [ ] All environment variables configured for production
- [ ] Database schema deployed and RLS policies active
- [ ] Webhook URL updated to production domain
- [ ] Test mode disabled in both frontend and backend
- [ ] Product variant IDs updated with production values
- [ ] Payment flow tested end-to-end in production environment
- [ ] Monitoring and logging configured for production
- [ ] Error handling tested for various failure scenarios
- [ ] Customer support process defined for billing issues

---

**🚀 Your LemonSqueezy integration is now complete and ready for production!**
