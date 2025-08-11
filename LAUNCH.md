# 🚀 ResumeAI Launch Guide

Complete setup, deployment, and launch guide for the ResumeAI platform.

## 📋 Quick Setup Checklist

### ✅ **Prerequisites**
- [ ] Node.js 18+ installed
- [ ] Supabase account and project created
- [ ] Stripe account (test mode for development)
- [ ] Supabase CLI installed: `npm install -g supabase`

---

## 🔧 **1. Local Development Setup**

### Install Dependencies
```bash
npm install
```

### Environment Variables
Copy the template and fill in your values:
```bash
cp .env.local.template .env.local
```

**Required values in `.env.local`:**
```bash
# Get from https://supabase.com/dashboard > Settings > API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key

# Get from https://dashboard.stripe.com > Developers > API keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...your-test-key

# Optional (defaults provided)
VITE_APP_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

### 🧪 Test Mode (Optional)
For development without payment setup, enable test mode:
```bash
VITE_TEST_MODE=true
VITE_PAYMENTS_PROVIDER=disabled
VITE_SHOW_TEST_BANNER=true
```

**Test Mode Features:**
- ✅ All templates unlocked
- ✅ Unlimited AI usage  
- ✅ Unlimited downloads
- ✅ No payment required
- ✅ Visual indicators throughout UI
- ✅ Pricing page hidden/redirected

**Safety:** Test mode is automatically disabled in production builds

### Start Development Server
```bash
npm run dev
```
→ **App available at:** http://localhost:8080

---

## 🏗️ **2. Supabase Setup**

### Link Project
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
```

### Deploy Database Schema
```bash
supabase db push
```

### Deploy Edge Functions
```bash
supabase functions deploy
```

### Set Server-Side Secrets
```bash
# Get from Supabase Dashboard > Settings > API
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# Get from Stripe Dashboard > Developers > API keys
supabase secrets set STRIPE_SECRET_KEY=sk_test_...your-secret-key

# Get from webhook setup (see below)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...your-webhook-secret

# Optional: for AI features
supabase secrets set OPENAI_API_KEY=sk-...your-openai-key
```

---

## 💳 **3. Payment Provider Configuration**

### Option A: Lemon Squeezy (Recommended)

#### Create Products
1. Go to https://app.lemonsqueezy.com/dashboard
2. Create a new store
3. Create 3 products:

**Basic Plan:**
- Name: "Basic Resume Access"
- Price: $3.00 USD (one-time payment)
- Description: "10-day access to basic templates"

**AI Plan:**
- Name: "AI-Enhanced Resume Builder"
- Price: $7.00 USD (one-time payment)
- Description: "10-day access to all templates + AI features"

**Monthly Plan:**
- Name: "Pro Monthly Subscription"
- Price: $15.00 USD (monthly recurring)
- Description: "Unlimited access with premium support"

#### Update Environment Variables
Add to `.env.local`:
```bash
VITE_LEMON_STORE_ID=your-store-id
VITE_LEMON_PRODUCT_BASIC=your-basic-product-id
VITE_LEMON_PRODUCT_AI=your-ai-product-id
VITE_LEMON_PRODUCT_MONTHLY=your-monthly-product-id
PAYMENTS_PROVIDER=lemonsqueezy
VITE_PAYMENTS_PROVIDER=lemonsqueezy
```

#### Set up Webhook
1. In Lemon Squeezy Dashboard, go to Settings > Webhooks
2. Add webhook URL: `https://your-project.supabase.co/functions/v1/lemon-webhook`
3. Copy the webhook secret
4. Add to Supabase secrets:
```bash
supabase secrets set LEMON_WEBHOOK_SECRET=your-webhook-secret
supabase secrets set PAYMENTS_PROVIDER=lemonsqueezy
```

### Option B: Stripe (Legacy)

#### Create Products
1. Go to https://dashboard.stripe.com/products
2. Create 3 products:

**Basic Plan:**
- Name: "Basic Resume Access"
- Price: $3.00 USD (one-time payment)
- Description: "10-day access to basic templates"

**AI Plan:**
- Name: "AI-Enhanced Resume Builder"
- Price: $7.00 USD (one-time payment)
- Description: "10-day access to all templates + AI features"

**Pro Plan:**
- Name: "Pro Monthly Subscription"
- Price: $15.00 USD (monthly recurring)
- Description: "Unlimited access to all features"

### Update Pricing Config
Open `src/lib/pricing.ts` and replace these 6 values:
```typescript
export const STRIPE_CONFIG = {
  BASIC_PRODUCT_ID: 'prod_YOUR_BASIC_ID',      // ← Paste here
  BASIC_PRICE_ID: 'price_YOUR_BASIC_PRICE',    // ← Paste here
  
  AI_PRODUCT_ID: 'prod_YOUR_AI_ID',            // ← Paste here
  AI_PRICE_ID: 'price_YOUR_AI_PRICE',          // ← Paste here
  
  PRO_PRODUCT_ID: 'prod_YOUR_PRO_ID',          // ← Paste here
  PRO_PRICE_ID: 'price_YOUR_PRO_PRICE',       // ← Paste here
};
```

### Webhook Setup

**1. Create Webhook Endpoint:**
- URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhooks`
- Events to send:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `charge.refunded`

**2. Test Locally:**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhooks
```

**3. Copy webhook secret to Supabase Secrets:**
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase functions deploy stripe-webhooks
```

---

## 🌐 **4. Production Deployment (Vercel)**

### Environment Variables
Set these in Vercel Dashboard > Settings > Environment Variables:

**Required:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...your-live-key
VITE_APP_URL=https://yourdomain.com
VITE_ENVIRONMENT=production
```

**Optional:**
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
```

### Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x

### Deploy Commands
```bash
# Build and test locally
npm run build
npm run preview

# Deploy to Vercel
npx vercel --prod
```

### Production Supabase Secrets
```bash
# Switch to live Stripe keys
supabase secrets set STRIPE_SECRET_KEY=sk_live_...your-live-key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...your-live-webhook

# Redeploy functions with new secrets
supabase functions deploy

# Update webhook URL to production domain
# https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhooks
```

---

## 🧪 **5. Testing Checklist**

### Local Development
- [ ] `npm run dev` starts without errors
- [ ] Environment variables load correctly
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Supabase connection works
- [ ] Pages load without console errors

### Authentication Flow
- [ ] Sign up with email works
- [ ] Email verification works  
- [ ] Sign in/out works
- [ ] Protected routes redirect to auth

### Subscription Flow
- [ ] Pricing page displays all plans
- [ ] Stripe checkout opens correctly
- [ ] Test payment works (card: `4242 4242 4242 4242`)
- [ ] Webhook processes payment
- [ ] User plan updates in database
- [ ] Access granted after payment

### Plan Gating
- [ ] Free users see blurred previews
- [ ] Basic plan: 3 templates only
- [ ] AI plan: All templates + AI features
- [ ] Pro plan: Everything unlimited
- [ ] Usage limits enforced correctly

### Security Features
- [ ] Preview blur/watermark works
- [ ] Right-click disabled on previews
- [ ] Export requires active plan
- [ ] Export logs recorded
- [ ] First export blocks refunds

### Customer Portal
- [ ] Subscription management works
- [ ] Cancel/upgrade flows work
- [ ] Billing history shows
- [ ] Download invoices work

---

## 🛠️ **6. Available Commands**

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint
npx tsc --noEmit     # Type checking

# Supabase
supabase start       # Start local Supabase
supabase db push     # Deploy schema changes
supabase functions deploy  # Deploy edge functions
supabase secrets set KEY=value  # Set secrets

# Stripe
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhooks
stripe products list  # View products
stripe prices list    # View prices
```

---

## ⚡ **7. Quick Launch Commands**

Once everything is configured:

```bash
# 1. Install and start
npm install
npm run dev

# 2. Deploy Supabase (first time)
supabase db push
supabase functions deploy
supabase secrets set STRIPE_SECRET_KEY=sk_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# 3. Test webhooks locally
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhooks

# 4. Deploy to production
npm run build
npx vercel --prod
```

---

## 🐛 **Troubleshooting**

### Common Issues

**Environment variable errors:**
```bash
# Check .env.local exists and has correct values
cat .env.local
# Restart dev server after changes
npm run dev
```

**Supabase connection failed:**
```bash
# Verify project isn't paused
# Check URL and anon key are correct
# Ensure RLS policies allow access
supabase projects list
```

**Stripe webhook failing:**
```bash
# Verify webhook secret matches
# Check endpoint URL is correct
# Test with Stripe CLI
stripe webhooks list
```

**Build errors:**
```bash
# Check TypeScript errors
npx tsc --noEmit
# Verify all dependencies installed
npm install
```

### Support Resources
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## ✅ **Final Launch Checklist**

### Before Going Live
- [ ] All environment variables set
- [ ] Stripe products created and IDs updated
- [ ] Webhook endpoint configured
- [ ] Database migrations deployed
- [ ] Edge functions deployed
- [ ] All tests passing
- [ ] Domain configured with SSL
- [ ] Analytics configured
- [ ] Legal pages updated

### Post-Launch
- [ ] Monitor webhook events in Stripe
- [ ] Check error logs in Supabase
- [ ] Verify payment flows work
- [ ] Test customer support flows
- [ ] Monitor app performance

---

🎉 **You're ready to launch ResumeAI!** 

For support, check the logs in Supabase Dashboard and Stripe Dashboard.