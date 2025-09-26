# 🚀 RevenueCat + Stripe Integration Setup Guide

## Overview
The premium version of NOVAECV uses RevenueCat for subscription management with Stripe as the payment processor. This guide will walk you through the complete setup process.

## ✅ What's Already Implemented

### 🔧 Frontend Integration
- **RevenueCat Web SDK**: Integrated with subscription state management
- **Premium Feature Gating**: PDF export and premium templates locked behind paywall
- **Paywall UI Components**: Professional upgrade modals and banners
- **Feature Access Control**: Granular permissions for different features
- **Subscription Management**: Real-time subscription status updates

### 🎯 Supported Features
- ✅ Free Plan (Basic templates, Word export, 3 resumes)
- ✅ Premium Plan ($1/month - All templates, PDF export, unlimited resumes)
- ✅ Real-time subscription status
- ✅ Feature access enforcement
- ✅ Upgrade/downgrade flow
- ✅ Subscription cancellation
- ✅ Purchase restoration

## 🛠️ Setup Instructions

### 1. RevenueCat Dashboard Configuration

#### Create a RevenueCat Account
1. Go to [RevenueCat.com](https://revenuecat.com) and create an account
2. Create a new project for your resume builder
3. Note your **Public API Key** from the project settings

#### Create Products and Entitlements
1. **Navigate to Entitlements**
   ```
   Entitlement ID: premium
   Description: Premium features including PDF export and premium templates
   ```

2. **Navigate to Products**
   ```
   Product ID: premium_monthly
   Display Name: Premium Plan
   Duration: 1 month
   Price: $1.00
   ```

### 2. Stripe Setup

#### Create Products in Stripe Dashboard
1. **Premium Monthly Product:**
   ```
   Name: "NOVAECV Premium"
   Description: "Access to premium resume templates and PDF export"
   Price: $1.00
   Billing: Monthly subscription
   ```

2. **Copy the Price ID** to use in RevenueCat configuration

#### Configure RevenueCat-Stripe Connection
1. In RevenueCat, go to **Integrations > Stripe**
2. Connect your Stripe account
3. Map your Stripe price to the RevenueCat product
4. Enable webhooks for real-time updates

### 3. Environment Configuration

Update your `.env.local` file:

```bash
# RevenueCat Configuration
VITE_REVENUECAT_PUBLIC_KEY=your-revenuecat-public-key-here

# Stripe Configuration (for reference)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key-here

# Application Configuration
VITE_APP_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

### 4. Test the Integration

#### Test Free User Experience
1. Create a new account or log in as a free user
2. Try to export PDF → Should show paywall modal
3. Try to access premium templates → Should show upgrade prompt
4. Verify upgrade banner appears for free users

#### Test Premium Upgrade Flow
1. Click "Upgrade to Premium" button
2. Complete Stripe checkout process
3. Verify subscription activates in RevenueCat
4. Confirm premium features are unlocked
5. Test PDF export functionality
6. Verify access to all premium templates

#### Test Subscription Management
1. Test subscription cancellation
2. Verify feature access revoked after cancellation
3. Test subscription restoration
4. Test multiple devices/sessions

## 📊 Feature Access Matrix

| Feature | Free Plan | Premium Plan |
|---------|-----------|--------------|
| Basic Templates | ✅ | ✅ |
| Premium Templates | ❌ | ✅ |
| Word Export | ✅ | ✅ |
| PDF Export | ❌ | ✅ |
| Resume Limit | 3 | Unlimited |
| AI Suggestions | Basic | Advanced |
| Watermarks | Yes | No |
| Priority Support | ❌ | ✅ |

## 🎯 RevenueCat Configuration Details

### Entitlements Configuration
```json
{
  "entitlements": {
    "premium": {
      "products": ["premium_monthly"],
      "features": [
        "pdf_export",
        "premium_templates", 
        "unlimited_resumes",
        "advanced_ai",
        "no_watermarks"
      ]
    }
  }
}
```

### Webhook Configuration
RevenueCat will automatically sync subscription events with your frontend through the Web SDK. No backend webhook configuration is required for the current implementation.

## 🔧 Development Notes

### Feature Gating Implementation
Features are gated using the `useRevenueCat` hook:

```typescript
const { canAccessFeature, isPremium } = useRevenueCat();

// Check specific feature access
if (!canAccessFeature("pdf_export")) {
  // Show paywall
}

// Check overall premium status
if (!isPremium) {
  // Show upgrade banner
}
```

### Subscription State Management
The app automatically syncs with RevenueCat and updates the UI in real-time when subscription status changes.

### Testing Stripe Integration
Use Stripe test mode with test card numbers:
- **Successful payment**: 4242 4242 4242 4242
- **Declined payment**: 4000 0000 0000 0002

## 🚀 Deployment Considerations

### Environment Variables for Production
Ensure you have production RevenueCat and Stripe keys configured in your deployment environment.

### SSL Requirement
RevenueCat requires HTTPS in production. Ensure your domain has a valid SSL certificate.

### Domain Configuration
Add your production domain to RevenueCat's allowed domains list in the project settings.

## 🛡️ Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Use environment variables** for all configuration
3. **Validate subscriptions** server-side for critical operations
4. **Implement proper error handling** for payment failures
5. **Log subscription events** for debugging and analytics

## 📞 Support and Troubleshooting

### Common Issues
1. **RevenueCat not initializing**: Check public key configuration
2. **Stripe checkout not opening**: Verify Stripe-RevenueCat connection
3. **Features not unlocking**: Check entitlement configuration
4. **Subscription not syncing**: Verify webhook configuration

### Debug Mode
Enable RevenueCat debug mode in development:
```typescript
// In development only
if (import.meta.env.DEV) {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
}
```

## 🎉 Launch Checklist

- [ ] RevenueCat project configured with correct entitlements
- [ ] Stripe products created and connected to RevenueCat
- [ ] Environment variables set for production
- [ ] Payment flow tested end-to-end
- [ ] Feature gating verified for all premium features
- [ ] Subscription cancellation flow tested
- [ ] Error handling implemented for payment failures
- [ ] Analytics configured for subscription events
- [ ] Legal pages updated with subscription terms
- [ ] Customer support process defined for billing issues

---

For additional support, refer to:
- [RevenueCat Documentation](https://docs.revenuecat.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Integration Troubleshooting](https://docs.revenuecat.com/docs/stripe)
