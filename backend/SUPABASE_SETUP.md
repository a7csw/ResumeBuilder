# 🚀 Supabase Backend Setup Guide

## ✅ **Good News: Your Supabase is Already Configured!**

Your project already has a fully configured Supabase setup:
- **Project URL**: `https://sqvaqiepymfoubwibuds.supabase.co`
- **Database Schema**: Complete with user profiles, plans, billing, etc.
- **Edge Functions**: Ready for AI, PDF generation, payments
- **Frontend Integration**: Already connected and working

---

## 🔧 **What You Need to Do**

### **Step 1: Get Your Supabase Service Role Key**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `sqvaqiepymfoubwibuds`
3. Go to **Settings** → **API**
4. Copy the **`service_role` secret** (NOT the `anon public` key)
5. This is your `SUPABASE_SERVICE_ROLE_KEY`

### **Step 2: Update Render Environment Variables**

Add these to your Render service environment variables:

```bash
# Required for backend
SUPABASE_URL=https://sqvaqiepymfoubwibuds.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-from-step-1
JWT_SECRET=e08f314680f13c5c42ece3062efc72f01ef9e851efe41ec32e5d9804e5aea293e8a1d08f9cae823d78aa4675e388603db93159de6b80a564005b7bd62a2c564a
```

**That's it!** Your backend will now connect to your existing Supabase database.

---

## 📊 **Your Database Schema**

Your Supabase project already includes these tables:
- ✅ **`profiles`** - User profile data
- ✅ **`user_plans`** - Subscription and billing info
- ✅ **`resumes`** - Resume data and templates
- ✅ **`billing_events`** - Payment tracking
- ✅ **`export_logs`** - Export history
- ✅ **`rate_limits`** - API rate limiting
- ✅ **`security_audit_logs`** - Security tracking

---

## 💳 **Payment Integration**

Your app supports both payment providers:

### **Stripe** (Recommended)
```bash
PAYMENTS_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### **Lemon Squeezy** (Alternative)
```bash
PAYMENTS_PROVIDER=lemonsqueezy
LEMON_SQUEEZY_API_KEY=your-api-key
LEMON_STORE_ID=92893
```

---

## 🧪 **Testing the Connection**

After setting the environment variables, your backend will:

1. **Initialize Supabase client** ✅
2. **Test database operations** ✅
3. **Start the Express server** ✅

Expected logs:
```
✅ Supabase client initialized successfully
🧪 Testing Supabase database operations...
✅ Database operations test successful
🚀 NovaCV Backend Server Started!
💳 Payment Provider: stripe
🗄️ Database: Supabase
```

---

## 🔍 **Health Check Endpoints**

Test these endpoints after deployment:
```bash
# Basic health check
GET https://your-backend.onrender.com/api/v1/health

# Database status
GET https://your-backend.onrender.com/api/v1/status
```

---

## 🎯 **Key Differences from MongoDB**

✅ **No database connection needed** - Uses HTTP requests  
✅ **No schema management** - Already configured  
✅ **Built-in auth** - Supabase handles authentication  
✅ **Real-time features** - If needed later  
✅ **Edge functions** - Server-side logic already deployed

---

## 🆘 **Troubleshooting**

### **"Missing SUPABASE_SERVICE_ROLE_KEY"**
- Go to Supabase Dashboard → Settings → API
- Copy the `service_role` secret (long string starting with `eyJ...`)
- NOT the `anon public` key

### **"Error accessing profiles table"**
- Check your service role key is correct
- Verify the Supabase URL is: `https://sqvaqiepymfoubwibuds.supabase.co`
- Make sure Row Level Security (RLS) allows service role access

### **"Database operations test failed"**
- Check the Supabase project is active (not paused)
- Verify your API keys are not expired
- Check Supabase status: [status.supabase.com](https://status.supabase.com)

---

## 🎉 **Expected Result**

After setup, your backend will:
- ✅ **Start without MongoDB errors**
- ✅ **Connect to your existing Supabase database**
- ✅ **Work with your existing frontend**
- ✅ **Handle authentication via Supabase**
- ✅ **Process payments via Stripe/Lemon Squeezy**
- ✅ **Generate PDFs via Edge Functions**

**Your app is already fully functional - just need the environment variables!**
