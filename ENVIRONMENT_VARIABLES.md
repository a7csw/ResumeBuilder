# Environment Variables Configuration

## Frontend (.env.local)

Create a `frontend/.env.local` file with the following variables:

```bash
# Gumroad Product URLs
VITE_GUMROAD_SINGLE_RESUME_URL=https://alfaiadiabood.gumroad.com/l/resume-single
VITE_GUMROAD_10DAY_ACCESS_URL=https://alfaiadiabood.gumroad.com/l/10daypass
VITE_GUMROAD_MONTHLY_ACCESS_URL=https://alfaiadiabood.gumroad.com/l/novaecv-monthly

# Gumroad Configuration (for webhook validation)
VITE_GUMROAD_SELLER_ID=your-seller-id-here

# Supabase Configuration
VITE_SUPABASE_URL=https://sqvaqiepymfoubwibuds.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdmFxaWVweW1mb3Vid2lidWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTQzNzYsImV4cCI6MjA2OTQ5MDM3Nn0._pZbc371YtVF2-zT6DjVQDpLs-2uiDLHT-eFngdewYo

# App Configuration
VITE_APP_URL=http://localhost:8080
VITE_SUCCESS_REDIRECT_URL=http://localhost:8080/success
```

## Backend (.env)

Create a `backend/.env` file with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=https://sqvaqiepymfoubwibuds.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key-here

# Gumroad Configuration
GUMROAD_SELLER_ID=your-seller-id-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## How to Get These Values

### Gumroad Seller ID
1. Go to https://app.gumroad.com/settings/advanced
2. Find your "Seller ID" in the Advanced section
3. Copy and paste into both frontend and backend .env files

### Supabase Service Key (Backend Only)
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "service_role" key (keep this secret!)
4. Paste into backend/.env file

### Success Redirect URL
- For development: `http://localhost:8080/success`
- For production: `https://yourdomain.com/success`

## Setting Up Gumroad Webhook

1. Go to https://app.gumroad.com/settings/advanced
2. Scroll to "Ping URL" section
3. Enter your webhook URL:
   - Development: Use ngrok or similar tunnel
   - Production: `https://yourdomain.com/api/v1/gumroad/webhook`
4. Click "Save"

### Testing Webhook Locally

Use ngrok to expose your local backend:

```bash
# Install ngrok if you haven't
npm install -g ngrok

# Start your backend server
cd backend && npm start

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Set webhook URL in Gumroad: https://abc123.ngrok.io/api/v1/gumroad/webhook
```

## Configuring Gumroad Product Redirect URLs

For each Gumroad product, set the redirect URL:

1. Edit each product on Gumroad
2. Scroll to "Redirect to this URL after purchase" section
3. Set to: `https://yourdomain.com/success`
4. The app will automatically append `?plan=<plan_id>` parameter

Alternatively, the app now automatically appends the redirect URL when users click "Buy", so you don't need to manually configure it in Gumroad.

## Important Notes

⚠️ **Never commit `.env` or `.env.local` files to version control**

✅ **Always use `.env.example` or `.env.template` as reference**

🔒 **Keep service keys and secrets secure**

📝 **Update production URLs before deploying**



