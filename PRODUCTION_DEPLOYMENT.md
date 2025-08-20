# NovaCV - Production Deployment Guide

## 🚀 Complete Production Setup with Lemon Squeezy Integration

### Overview
Your NovaCV application is now fully integrated with:
- **Supabase** (Authentication + Database + Edge Functions)
- **Lemon Squeezy** (Payment Processing)
- **Vercel** (Frontend Hosting - Recommended)
- **Gray Color Scheme** (Consistent branding)

---

## 📋 Pre-Deployment Checklist

### ✅ What's Already Done:
- [x] Frontend converted to use gray/slate color scheme
- [x] Lemon Squeezy payment integration implemented
- [x] Supabase authentication system connected
- [x] Database schema updated for new pricing ($5/10 days, $11/month)
- [x] Edge Functions created for webhook handling
- [x] TypeScript errors resolved
- [x] All Stripe dependencies removed

### 🔧 What You Need to Do:

#### 1. Set Up Lemon Squeezy Account
1. Create account at [lemonsqueezy.com](https://lemonsqueezy.com)
2. Create a new store
3. Create products:
   - **Basic Plan**: $5.00 (One-time payment)
   - **Professional Plan**: $11.00 (Monthly subscription)
4. Copy your Store ID and Variant IDs
5. Generate API key and webhook secret

#### 2. Update Environment Configuration
In `src/lib/env.ts`, replace the demo values:

```typescript
// Lemon Squeezy Configuration
const LEMON_SQUEEZY_CONFIG = {
  storeId: "YOUR_ACTUAL_STORE_ID", // Replace with your store ID
  products: {
    basic: "YOUR_BASIC_VARIANT_ID", // Replace with actual variant ID
    pro: "YOUR_PRO_VARIANT_ID", // Replace with actual variant ID
  }
};
```

#### 3. Configure Lemon Squeezy Webhooks
1. In Lemon Squeezy dashboard, go to Settings > Webhooks
2. Add webhook URL: `https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/lemon-squeezy-webhook`
3. Select these events:
   - `order_created`
   - `order_refunded`
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
4. Copy the webhook secret

#### 4. Deploy Supabase Edge Functions
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project reference)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the Lemon Squeezy webhook function
supabase functions deploy lemon-squeezy-webhook

# Set webhook secret
supabase secrets set LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

#### 5. Apply Database Migration
```bash
# Push the database migration for new pricing structure
supabase db push
```

#### 6. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set up custom domain (optional)
vercel domains add yourdomain.com
```

---

## 🔐 Environment Variables Setup

### For Vercel Deployment:
In your Vercel dashboard, add these environment variables:

```bash
# These are already configured in src/lib/env.ts but you can override them
VITE_ENVIRONMENT=production
VITE_APP_URL=https://yourdomain.com
```

### For Supabase Edge Functions:
```bash
# Set these secrets in Supabase
supabase secrets set LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_your_webhook_secret
supabase secrets set LEMON_SQUEEZY_API_KEY=your_api_key_here
```

---

## 🧪 Testing Your Deployment

### 1. Test Authentication Flow
1. Go to your deployed site
2. Click "Sign In" → "Sign Up"
3. Create a test account
4. Verify email confirmation works
5. Test sign in/out functionality

### 2. Test Payment Flow
1. Go to `/pricing`
2. Select a plan (Basic or Pro)
3. Use Lemon Squeezy test mode for testing
4. Complete checkout process
5. Verify plan activation in Supabase dashboard

### 3. Test Webhooks
1. Use Lemon Squeezy's webhook testing tools
2. Trigger test events
3. Check Supabase logs for webhook processing
4. Verify plan updates in database

---

## 📊 Monitoring & Analytics

### 1. Supabase Dashboard
Monitor:
- User registrations
- Plan activations
- Webhook events
- Database performance

### 2. Lemon Squeezy Dashboard
Track:
- Revenue
- Conversion rates
- Customer metrics
- Refund requests

### 3. Vercel Analytics
Monitor:
- Page views
- Performance metrics
- Error rates
- User engagement

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain Setup
```bash
# Add your domain to Vercel
vercel domains add yourdomain.com

# Update CORS settings in Supabase
# Go to Authentication > Settings > Site URL
# Add: https://yourdomain.com
```

### 2. Email Configuration
In Supabase Dashboard → Authentication → Settings:
- Configure SMTP settings for custom email templates
- Set up custom email templates for sign up/reset password

### 3. Security Settings
- Enable RLS (Row Level Security) on all tables
- Configure rate limiting
- Set up IP restrictions if needed
- Enable audit logging

---

## 🚨 Important Security Notes

### 1. Environment Variables
- Never commit API keys to git
- Use Vercel/Supabase secret management
- Rotate keys regularly

### 2. Database Security
- All tables have RLS policies enabled
- User data is isolated per user
- Webhook signatures are verified

### 3. Payment Security
- All payments processed by Lemon Squeezy (PCI compliant)
- Webhook signatures verified with HMAC
- No sensitive payment data stored in your database

---

## 🔄 Backup & Recovery

### 1. Database Backups
- Supabase automatically backs up your database
- Set up additional backup schedules if needed
- Test restore procedures

### 2. Code Backups
- Code is backed up in Git repository
- Set up automated deployments from main branch
- Tag releases for rollback capability

---

## 📈 Scaling Considerations

### 1. Database Performance
- Monitor query performance in Supabase
- Add indexes as needed
- Consider read replicas for high traffic

### 2. Edge Function Limits
- Monitor function invocations
- Optimize webhook processing
- Consider caching strategies

### 3. Frontend Performance
- Vercel automatically handles CDN and caching
- Monitor Core Web Vitals
- Optimize images and assets

---

## 🆘 Troubleshooting

### Common Issues:

#### 1. Blank Page on Load
- Check browser console for errors
- Verify Supabase URL/key in env.ts
- Check if all dependencies are installed

#### 2. Authentication Not Working
- Verify Supabase project settings
- Check email confirmation settings
- Ensure site URL is configured correctly

#### 3. Payments Failing
- Verify Lemon Squeezy variant IDs
- Check webhook URL configuration
- Monitor webhook logs in Supabase

#### 4. Database Errors
- Check RLS policies
- Verify migration was applied
- Review database logs in Supabase

---

## 📞 Support & Maintenance

### Regular Tasks:
- [ ] Monitor error rates weekly
- [ ] Review payment analytics monthly
- [ ] Update dependencies quarterly
- [ ] Review security settings regularly
- [ ] Backup database monthly
- [ ] Test disaster recovery procedures

### When You Need Help:
1. Check Supabase documentation
2. Review Lemon Squeezy API docs
3. Check Vercel deployment logs
4. Review this deployment guide
5. Check GitHub issues for similar problems

---

## 🎉 You're Ready for Production!

Your NovaCV application is now:
- ✅ **Fully functional** with authentication and payments
- ✅ **Production-ready** with proper error handling
- ✅ **Scalable** with Supabase and Vercel infrastructure
- ✅ **Secure** with proper authentication and payment processing
- ✅ **Maintainable** with clear documentation and structure

### Next Steps:
1. Complete the Lemon Squeezy setup
2. Deploy to Vercel
3. Configure your custom domain
4. Set up monitoring and analytics
5. Launch your resume builder! 🚀

---

**Good luck with your launch! 🎊**
