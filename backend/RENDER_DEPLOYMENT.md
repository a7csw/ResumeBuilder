# 🚀 Render Deployment Guide for NovaCV Backend

## Quick Deploy Instructions

### 1. **Point Render to the Backend Directory**
When setting up your Render service, make sure to:
- **Root Directory**: Set to `backend/` (NOT the project root)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2. **Required Environment Variables**
Add these in your Render Dashboard under Environment Variables:

#### **Essential Variables:**
```bash
# Server Configuration
NODE_ENV=production
PORT=10000
API_VERSION=v1

# Database (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novacv?retryWrites=true&w=majority

# JWT Security
JWT_SECRET=your-super-secure-jwt-secret-change-this-64-characters-minimum
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL (your frontend deployment URL)
FRONTEND_URL=https://your-frontend-app.onrender.com
```

#### **Paddle Payment Integration:**
```bash
# Paddle Configuration
PADDLE_API_KEY=your-paddle-api-key
PADDLE_ENVIRONMENT=sandbox
PADDLE_WEBHOOK_SECRET=your-paddle-webhook-secret

# Paddle Plan IDs (Price IDs from modern Paddle)
PADDLE_BASIC_PLAN_ID=pri_basic_plan_price_id  
PADDLE_PRO_PLAN_ID=pri_pro_plan_price_id
```

#### **Optional Email Configuration:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. **Health Check Configuration**
- **Health Check Path**: `/api/v1/health`

---

## Step-by-Step Render Deployment

### **Step 1: Create New Web Service**
1. Login to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### **Step 2: Configure Build Settings**
```
Name: novacv-backend
Environment: Node
Region: Oregon (or closest to your users)
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### **Step 3: Add Environment Variables**
Copy and paste all the required environment variables from above into the Render environment variables section.

### **Step 4: Deploy**
1. Click "Create Web Service"
2. Monitor the build logs
3. Once deployed, test the health endpoint: `https://your-app.onrender.com/api/v1/health`

---

## Troubleshooting Common Issues

### ❌ "Missing script: start"
**Solution**: Make sure you set **Root Directory** to `backend/` in Render settings.

### ❌ Build fails with module not found
**Solution**: Verify that `backend/package.json` exists and contains all dependencies.

### ❌ App starts but crashes immediately
**Solutions**:
1. Check environment variables are set correctly
2. Verify MongoDB connection string
3. Check build logs for specific error messages

### ❌ 502 Bad Gateway
**Solutions**:
1. Verify the app is listening on `process.env.PORT`
2. Check if the app crashed (view logs)
3. Ensure health check path is correct

---

## Testing Your Deployment

### **1. Health Check**
```bash
curl https://your-app.onrender.com/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "NovaCV API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": "0:01:23"
}
```

### **2. API Documentation**
```bash
curl https://your-app.onrender.com/api/v1/docs
```

### **3. CORS Test**
Make sure your frontend can connect by testing from browser console:
```javascript
fetch('https://your-app.onrender.com/api/v1/health')
  .then(r => r.json())
  .then(console.log)
```

---

## Environment-Specific Notes

### **Development vs Production**
- **Development**: Uses `NODE_ENV=development`, `PADDLE_ENVIRONMENT=sandbox`
- **Production**: Uses `NODE_ENV=production`, `PADDLE_ENVIRONMENT=production`

### **Paddle Integration**
1. **Sandbox**: Use test credentials and sandbox plan IDs
2. **Production**: Switch to live credentials and live plan IDs

### **Database**
- **Development**: Local MongoDB or MongoDB Atlas free tier
- **Production**: MongoDB Atlas with proper authentication and IP restrictions

---

## Performance Optimizations

### **1. Render Settings**
- Use **Starter** plan for testing
- Upgrade to **Standard** for production traffic
- Enable **Auto-Deploy** for continuous deployment

### **2. Database Optimization**
- Use connection pooling (already configured in `database.js`)
- Set proper MongoDB indexes
- Use MongoDB Atlas in same region as Render

### **3. Caching**
- The app includes compression middleware
- Consider adding Redis for session storage in high-traffic scenarios

---

## Security Checklist

- ✅ **Strong JWT Secret**: Use 64+ character random string
- ✅ **Environment Variables**: Never commit secrets to git
- ✅ **HTTPS Only**: Render provides automatic HTTPS
- ✅ **Rate Limiting**: Already configured in the app
- ✅ **CORS**: Configured to allow your frontend domain
- ✅ **Helmet**: Security headers already enabled

---

## Monitoring & Logs

### **View Logs**
```bash
# In Render Dashboard
1. Go to your service
2. Click "Logs" tab
3. Monitor real-time logs
```

### **Set Up Alerts**
1. Go to service settings
2. Configure email notifications for:
   - Deploy failures
   - Service crashes
   - High error rates

---

## Next Steps After Deployment

1. **Test Payment Flow**: Verify Paddle integration works end-to-end
2. **Update Frontend**: Point your frontend to the new backend URL
3. **Configure Custom Domain**: (Optional) Set up custom domain
4. **Set Up Monitoring**: Consider external monitoring services
5. **Backup Strategy**: Ensure MongoDB Atlas backups are enabled

---

## 🎉 Success!

Your NovaCV backend is now deployed on Render! 

**Backend URL**: `https://your-app.onrender.com`
**API Documentation**: `https://your-app.onrender.com/api/v1/docs`
**Health Check**: `https://your-app.onrender.com/api/v1/health`

Remember to update your frontend environment variables to point to the new backend URL.
