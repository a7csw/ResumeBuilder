# Backend Integration Guide

## Overview
This document outlines the backend integration for NovaCV with the new pricing structure:
- **Basic Plan**: $5 for 10 days (limited features)
- **Professional Plan**: $11 per month (full features)

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payments**: Stripe
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## Setup Steps

### 1. Environment Configuration
Update your `.env.local` file with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration (Client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key-here

# Basic Plan Configuration
VITE_BASIC_PLAN_PRICE_ID=price_basic_plan_id_here
VITE_BASIC_PLAN_PRICE=5.00

# Professional Plan Configuration  
VITE_PRO_PLAN_PRICE_ID=price_pro_plan_id_here
VITE_PRO_PLAN_PRICE=11.00

# Application Configuration
VITE_APP_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

### 2. Supabase Edge Functions Environment
Set these secrets in your Supabase project:

```bash
# Server-side secrets (DO NOT prefix with VITE_)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
STRIPE_SECRET_KEY=sk_test_your-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

### 3. Database Schema
Run the migration file to update your database:
```bash
supabase db push
```

The migration includes:
- Updated `user_plans` table with new pricing structure
- Added usage tracking columns (templates_used, exports_used)
- Created plan capability checking functions
- Added RLS policies for security

### 4. Stripe Setup

#### Create Products in Stripe Dashboard:
1. **Basic Plan**
   - Name: "Basic Plan"
   - Price: $5.00
   - Billing: One-time payment
   - Copy the Price ID to `VITE_BASIC_PLAN_PRICE_ID`

2. **Professional Plan**
   - Name: "Professional Plan" 
   - Price: $11.00
   - Billing: Monthly subscription
   - Copy the Price ID to `VITE_PRO_PLAN_PRICE_ID`

#### Configure Webhooks:
1. In Stripe Dashboard, go to Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. Deploy Supabase Edge Functions

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy stripe-portal

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

## Features Implemented

### 1. Authentication System
- **Sign Up/Sign In**: Full Supabase auth integration
- **Profile Management**: User profiles with first/last name
- **Session Management**: Persistent login state
- **Protected Routes**: Authentication required for plan selection

### 2. Pricing & Plans
- **Plan Configuration**: Centralized pricing in `src/lib/pricing.ts`
- **Plan Limits**: Basic vs Pro feature restrictions
- **Usage Tracking**: AI calls, template access, exports
- **Plan Expiry**: Automatic expiration for Basic (10 days) and Pro (monthly)

### 3. Payment Processing
- **Stripe Checkout**: Secure payment processing
- **Subscription Management**: Monthly billing for Pro plan
- **Customer Portal**: Self-service billing management
- **Webhook Processing**: Real-time payment status updates

### 4. User Plan Management
- **Plan Capabilities**: Check user access to features
- **Usage Limits**: Track and enforce plan restrictions
- **Upgrade/Downgrade**: Seamless plan transitions
- **Refund Policy**: No refunds after first export

## API Integration Points

### Frontend to Backend
1. **Authentication**: `src/pages/Auth.tsx` → Supabase Auth
2. **Plan Selection**: `src/pages/Pricing.tsx` → Stripe Checkout
3. **User State**: `src/hooks/useUserPlan.ts` → User plan management
4. **Navigation**: `src/components/NavigationHeader.tsx` → Auth state

### Backend Functions
1. **stripe-checkout**: Creates Stripe checkout sessions
2. **stripe-webhook**: Processes payment webhooks  
3. **stripe-portal**: Customer billing portal access

### Database Operations
1. **User Plans**: Track active subscriptions and usage
2. **Billing Events**: Log all payment-related events
3. **Export Logs**: Track downloads for refund policy
4. **Profiles**: User account information

## Testing the Integration

### 1. Local Development
```bash
npm run dev
```

### 2. Test Authentication
1. Go to `/auth`
2. Create a new account
3. Verify email confirmation flow
4. Test sign in/out

### 3. Test Payment Flow  
1. Go to `/pricing`
2. Select a plan (use Stripe test cards)
3. Complete checkout process
4. Verify plan activation in database
5. Test feature access restrictions

### 4. Test Webhooks (using Stripe CLI)
```bash
stripe listen --forward-to https://your-project.supabase.co/functions/v1/stripe-webhook
stripe trigger checkout.session.completed
```

## Security Considerations

1. **Environment Variables**: Client vs server-side separation
2. **RLS Policies**: Row-level security on all tables
3. **API Authentication**: Supabase JWT validation
4. **Webhook Verification**: HMAC signature validation
5. **SQL Injection**: Parameterized queries only

## Deployment Checklist

- [ ] Environment variables configured in production
- [ ] Supabase Edge Functions deployed
- [ ] Database migrations applied
- [ ] Stripe webhooks configured
- [ ] SSL certificates in place
- [ ] Error monitoring configured
- [ ] Payment testing completed

## Support & Maintenance

### Monitoring
- Track payment success/failure rates
- Monitor webhook delivery
- Watch for expired plans
- Review usage patterns

### Updates
- Keep Stripe API version current
- Update Supabase client libraries
- Monitor security advisories
- Regular database backups

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env.local
# (Edit .env.local with your values)

# Run database migrations
supabase db push

# Deploy edge functions
supabase functions deploy --no-verify-jwt

# Start development server
npm run dev
```

Your NovaCV backend is now fully integrated and ready for production! 🚀
