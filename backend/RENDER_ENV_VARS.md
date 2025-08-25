# 🌐 Render Environment Variables Setup

## 📋 **Copy & Paste These Environment Variables in Render Dashboard**

Go to your Render service → Environment → Environment Variables and add these:

---

## 🔧 **Essential Variables (Required)**

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port for the server (Render will override this) |
| `API_VERSION` | `v1` | API version |
| `MONGODB_URI` | `mongodb+srv://testuser:testpass@cluster0.mongodb.net/novacv-test?retryWrites=true&w=majority` | Database connection (replace with your MongoDB Atlas URI) |
| `JWT_SECRET` | `test-jwt-secret-key-64-characters-long-for-development-only-change-in-production` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | JWT refresh token expiration |

---

## 💳 **Paddle Payment Variables (Test Values)**

| Key | Value | Description |
|-----|-------|-------------|
| `PADDLE_API_KEY` | `test_paddle_api_key_for_development` | Paddle API key (test value) |
| `PADDLE_ENVIRONMENT` | `sandbox` | Paddle environment |
| `PADDLE_BASIC_PLAN_ID` | `pri_test_basic_plan_12345` | Basic plan price ID (test value) |
| `PADDLE_PRO_PLAN_ID` | `pri_test_pro_plan_67890` | Pro plan price ID (test value) |
| `PADDLE_WEBHOOK_SECRET` | `test_webhook_secret_for_development` | Webhook verification secret (test value) |

---

## 🌐 **Frontend & URL Configuration**

| Key | Value | Description |
|-----|-------|-------------|
| `FRONTEND_URL` | `https://your-frontend-app.onrender.com` | Your frontend URL (update this) |
| `SMTP_HOST` | `smtp.gmail.com` | Email server host |
| `SMTP_PORT` | `587` | Email server port |
| `SMTP_USER` | `test@example.com` | Email username (test value) |
| `SMTP_PASS` | `test_email_password` | Email password (test value) |

---

## 🔒 **Security Configuration**

| Key | Value | Description |
|-----|-------|-------------|
| `BCRYPT_ROUNDS` | `12` | Password hashing rounds |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

---

## 📊 **Logging Configuration**

| Key | Value | Description |
|-----|-------|-------------|
| `LOG_LEVEL` | `info` | Logging level |
| `LOG_FILE` | `logs/app.log` | Log file path |

---

## 🚀 **Quick Setup Instructions**

### **Step 1: Add Environment Variables in Render**
1. Go to your Render service dashboard
2. Click on "Environment" tab
3. Scroll to "Environment Variables" section
4. Add each variable from the tables above

### **Step 2: Update Critical Values**
**Replace these with your actual values:**

```bash
# MongoDB Atlas (Required - Get free cluster at mongodb.com/atlas)
MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/novacv?retryWrites=true&w=majority

# Frontend URL (Update when you deploy frontend)
FRONTEND_URL=https://your-frontend-app.onrender.com

# JWT Secret (Generate a secure one for production)
JWT_SECRET=your-super-secure-jwt-secret-64-characters-minimum
```

### **Step 3: Test Values (Safe for Development)**
The Paddle test values above will allow the app to start but payment features won't work. This is perfect for testing the basic functionality.

---

## 🔍 **Testing Your Deployment**

After adding these variables and redeploying, test these endpoints:

```bash
# Health check
curl https://your-backend-app.onrender.com/api/v1/health

# API documentation
curl https://your-backend-app.onrender.com/api/v1/docs

# Available plans (will show test data)
curl https://your-backend-app.onrender.com/api/v1/payments/plans
```

---

## ⚠️ **Important Notes**

1. **MongoDB Atlas**: You need a real MongoDB Atlas cluster. Get a free one at [mongodb.com/atlas](https://mongodb.com/atlas)

2. **Paddle Test Values**: These allow the app to start but payments won't work. Perfect for testing other features.

3. **JWT Secret**: Generate a secure one for production using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Frontend URL**: Update this when you deploy your frontend.

---

## 🎯 **Production Checklist**

When ready for production, update these:
- [ ] Real MongoDB Atlas URI
- [ ] Real Paddle API keys and plan IDs
- [ ] Secure JWT secret
- [ ] Real frontend URL
- [ ] Real email configuration
- [ ] Set `PADDLE_ENVIRONMENT=production`
