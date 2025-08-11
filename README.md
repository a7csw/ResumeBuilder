# ResumeAI - Professional Resume Builder

A production-ready SaaS platform for building professional resumes with AI-powered content suggestions and ATS-optimized templates.

## 🚀 Features

- **3-Tier Pricing System**: Basic ($3/10 days), AI ($7/10 days), Pro ($15/month)
- **11+ Professional Templates**: ATS-optimized designs for all career levels
- **AI-Powered Content Enhancement**: Smart suggestions and content optimization
- **Secure Export System**: PDF/DOCX exports with watermarking and copy protection
- **Real-time Live Preview**: Secure, blurred preview system until payment
- **Subscription Management**: Full Stripe integration with customer portal
- **Mobile Responsive**: Optimized for all device sizes
- **Authentication**: Email verification and secure user management

## 📋 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments**: Stripe (Checkout, Subscriptions, Webhooks)
- **AI**: OpenAI GPT-4 integration
- **Deployment**: Vercel/Netlify ready

## 🛠️ Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- OpenAI API key (optional, for AI features)

### 1. Clone and Install

\`\`\`bash
git clone https://github.com/a7csw/ResumeBuilder.git
cd ResumeBuilder
npm install
\`\`\`

### 2. Environment Variables

Copy the environment template and fill in your values:

\`\`\`bash
cp env.example .env.local
\`\`\`

**Required Environment Variables:**

| Variable | Description | Where to get |
|----------|-------------|--------------|
| \`VITE_SUPABASE_URL\` | Supabase project URL | Supabase Dashboard > Settings > API |
| \`VITE_SUPABASE_ANON_KEY\` | Supabase anonymous key | Supabase Dashboard > Settings > API |
| \`VITE_STRIPE_PUBLISHABLE_KEY\` | Stripe publishable key | Stripe Dashboard > Developers > API keys |

**Server-side Environment Variables (for Supabase functions):**

| Variable | Description | Where to get |
|----------|-------------|--------------|
| \`SUPABASE_SERVICE_ROLE_KEY\` | Supabase service role key | Supabase Dashboard > Settings > API |
| \`STRIPE_SECRET_KEY\` | Stripe secret key | Stripe Dashboard > Developers > API keys |
| \`STRIPE_WEBHOOK_SECRET\` | Stripe webhook secret | Stripe Dashboard > Developers > Webhooks |
| \`OPENAI_API_KEY\` | OpenAI API key (optional) | OpenAI Platform |

### 3. Supabase Setup

1. **Create a Supabase project**: https://supabase.com/dashboard
2. **Install Supabase CLI**: \`npm install -g supabase\`
3. **Login to Supabase**: \`supabase login\`
4. **Link your project**: \`supabase link --project-ref YOUR_PROJECT_ID\`
5. **Push database schema**: \`supabase db push\`
6. **Deploy edge functions**: \`supabase functions deploy\`

### 4. Payment Provider Setup

#### Option A: Lemon Squeezy (Recommended)

1. **Create Lemon Squeezy Account**:
   - Go to [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com/dashboard)
   - Create a new store

2. **Create Products**:
   - **Basic Plan**: $3.00 USD (one-time payment)
   - **AI Plan**: $7.00 USD (one-time payment)
   - **Monthly Plan**: $15.00 USD (monthly recurring)

3. **Update environment variables**:
   ```bash
   VITE_LEMON_STORE_ID=your-store-id
   VITE_LEMON_PRODUCT_BASIC=your-basic-product-id
   VITE_LEMON_PRODUCT_AI=your-ai-product-id
   VITE_LEMON_PRODUCT_MONTHLY=your-monthly-product-id
   PAYMENTS_PROVIDER=lemonsqueezy
   VITE_PAYMENTS_PROVIDER=lemonsqueezy
   ```

4. **Set up webhook**:
   - In Lemon Squeezy Dashboard, go to Settings > Webhooks
   - Add webhook URL: `https://your-project.supabase.co/functions/v1/lemon-webhook`
   - Copy the webhook secret and add to Supabase secrets:
     ```bash
     npx supabase secrets set LEMON_WEBHOOK_SECRET=your-webhook-secret
     ```

#### Option B: Stripe (Legacy)

1. **Create Stripe products and prices**:
   - Basic Plan: $3 one-time payment
   - AI Plan: $7 one-time payment  
   - Pro Plan: $15 monthly subscription

2. **Update pricing configuration**:
   Edit \`src/lib/pricing.ts\` with your actual Stripe product and price IDs:
   
   \`\`\`typescript
   export const STRIPE_CONFIG = {
     BASIC_PRODUCT_ID: 'prod_YOUR_ACTUAL_ID',
     BASIC_PRICE_ID: 'price_YOUR_ACTUAL_ID',
     // ... etc
   };
   \`\`\`

3. **Set up webhook endpoint**:
   - URL: \`https://your-project.supabase.co/functions/v1/stripe-webhooks\`
   - Events: \`checkout.session.completed\`, \`customer.subscription.updated\`, \`customer.subscription.deleted\`

4. **Test webhooks locally**:
   \`\`\`bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhooks
   \`\`\`

5. **Configure for Stripe**:
   ```bash
   PAYMENTS_PROVIDER=stripe
   VITE_PAYMENTS_PROVIDER=stripe
   ```

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:8080\`

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── enhanced/          # Enhanced page components
│   ├── premium/           # Premium feature components
│   ├── templates/         # Resume templates
│   └── ui/               # Reusable UI components
├── hooks/
│   ├── useEnhancedUserPlan.ts  # Plan management
│   └── useUserPlan.ts          # Legacy plan hook
├── lib/
│   ├── env.ts            # Environment variables
│   ├── pricing.ts        # Stripe configuration
│   ├── analytics.ts      # Analytics tracking
│   └── seo.ts           # SEO utilities
├── pages/               # Main pages
└── integrations/
    └── supabase/        # Supabase client and types

supabase/
├── functions/           # Edge functions
│   ├── stripe-webhooks/
│   ├── customer-portal/
│   ├── ai-enhance-content/
│   └── export-resume/
└── migrations/         # Database migrations
\`\`\`

## 🏗️ Database Schema

Key tables:
- \`profiles\` - User profile information
- \`user_plans\` - Subscription and usage tracking
- \`resumes\` - Resume data
- \`export_logs\` - Export audit trail
- \`billing_events\` - Payment history

## 🔒 Security Features

- **Row Level Security (RLS)** on all tables
- **Secure preview system** with blur and watermarks
- **Copy/print protection** for non-subscribers
- **Webhook signature verification**
- **Export audit logging**
- **Refund protection** (no refunds if exports occurred)

## 🚦 Subscription Flow

1. **Free User** → Browse templates (blurred)
2. **Select Template** → Redirected to auth if not logged in
3. **Choose Plan** → Stripe Checkout
4. **Payment Success** → Webhook updates user plan
5. **Build Resume** → Access based on plan tier
6. **Export** → Usage tracking and audit logging

## 📊 Plan Capabilities

| Feature | Free | Basic | AI | Pro |
|---------|------|-------|----|----|
| Template Access | Preview only | 3 basic | All 11+ | All 11+ |
| AI Assistance | ❌ | ❌ | 30 uses | Unlimited |
| PDF Export | ❌ | 5 exports | 10 exports | Unlimited |
| Duration | Forever | 10 days | 10 days | Monthly |

## 🚀 Deployment

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Set build settings**:
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
4. **Deploy**

### Environment Variables for Production

\`\`\`
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-key
VITE_APP_URL=https://yourdomain.com
VITE_ENVIRONMENT=production
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

### Supabase Production Setup

1. **Upgrade to Pro plan** for production usage
2. **Deploy edge functions**: \`supabase functions deploy --project-ref YOUR_PROJECT_ID\`
3. **Set production secrets**:
   \`\`\`bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   supabase secrets set OPENAI_API_KEY=sk-...
   \`\`\`

## ✅ Production Checklist

### Pre-Launch
- [ ] Update Stripe price IDs in \`src/lib/pricing.ts\`
- [ ] Configure production environment variables
- [ ] Test payment flow end-to-end
- [ ] Verify webhook endpoints
- [ ] Set up domain and SSL
- [ ] Configure analytics (GA4/Plausible)

### Security
- [ ] Enable RLS on all Supabase tables
- [ ] Verify webhook signature validation
- [ ] Test export audit logging
- [ ] Confirm secure preview overlay
- [ ] Test refund policy enforcement

### Legal & Compliance
- [ ] Review Terms of Service
- [ ] Update Privacy Policy
- [ ] Configure refund policy
- [ ] Add GDPR compliance features
- [ ] Set up customer support

### Performance
- [ ] Optimize images and assets
- [ ] Enable CDN for static files
- [ ] Test mobile responsiveness
- [ ] Verify loading speeds
- [ ] Set up monitoring

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| \`npm run dev\` | Start development server |
| \`npm run build\` | Build for production |
| \`npm run preview\` | Preview production build |
| \`npm run lint\` | Run ESLint |
| \`npm run type-check\` | Run TypeScript checks |

## 🐛 Troubleshooting

### Common Issues

**Development server won't start:**
- Check environment variables in \`.env.local\`
- Ensure Node.js version is 18+
- Clear node_modules and reinstall: \`rm -rf node_modules package-lock.json && npm install\`

**Stripe webhooks failing:**
- Verify webhook secret in environment variables
- Check webhook endpoint URL
- Test locally with Stripe CLI

**Supabase connection issues:**
- Verify project URL and keys
- Check if project is paused
- Ensure RLS policies allow access

**TypeScript errors:**
- Run \`npm run type-check\` for detailed errors
- Ensure all dependencies are installed
- Check for missing type definitions

## 📞 Support

For technical support or questions:
- Create an issue in this repository
- Check existing documentation
- Review Supabase and Stripe documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React, TypeScript, Supabase, and Stripe.