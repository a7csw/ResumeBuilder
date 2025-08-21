# 🚀 Deployment Guide - Monorepo Structure

## 📁 Project Structure Overview

Your Resume Builder is now organized as a monorepo with separate frontend and backend:

```
ResumeBuilder/
├── frontend/                 # React + Vite frontend (deploy to Vercel)
├── backend/                  # Node.js + Express backend (deploy separately)
├── package.json              # Root monorepo configuration
└── README.md                 # Project documentation
```

## 🎯 Deployment Strategy

### **Frontend → Vercel** 
- Static site hosting
- Automatic builds from Git
- Global CDN distribution
- Environment variables support

### **Backend → Separate Hosting**
- Vercel Functions (recommended)
- Railway, Render, or Heroku
- MongoDB Atlas for database
- Paddle webhook endpoints

---

## 🌐 Frontend Deployment (Vercel)

### **1. Connect Repository to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Select the `frontend` folder** as the root directory
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Install Command**: `npm install`

### **2. Environment Variables**

Set these in your Vercel dashboard:

```bash
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api/v1
VITE_APP_NAME=NovaCV Resume Builder

# Optional Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **3. Build Settings**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### **4. Deploy**

- **Automatic**: Every push to main branch
- **Manual**: Trigger from Vercel dashboard
- **Preview**: Automatic for pull requests

---

## 🔧 Backend Deployment Options

### **Option A: Vercel Functions (Recommended)**

#### **1. Create API Routes**
Move your backend API routes to `frontend/api/` folder:

```bash
frontend/
├── api/
│   ├── users/
│   │   ├── register.js
│   │   ├── login.js
│   │   └── profile.js
│   ├── payments/
│   │   ├── checkout.js
│   │   ├── webhook.js
│   │   └── subscription.js
│   └── index.js
```

#### **2. Update vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

#### **3. Environment Variables**
```bash
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Paddle
PADDLE_API_KEY=your_paddle_api_key
PADDLE_ENVIRONMENT=production
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_BASIC_PLAN_ID=pri_basic_price_id
PADDLE_PRO_PLAN_ID=pri_pro_price_id
```

### **Option B: Railway/Render/Heroku**

#### **1. Railway Deployment**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### **2. Render Deployment**
1. **Connect GitHub repository**
2. **Select Node.js environment**
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Set all backend variables

#### **3. Heroku Deployment**
```bash
# Install Heroku CLI
npm install -g heroku

# Create and deploy
heroku create your-app-name
git push heroku main
```

---

## 🗄️ Database Setup

### **MongoDB Atlas (Recommended)**

1. **Create MongoDB Atlas account**
2. **Create a new cluster**
3. **Set up database access**
4. **Configure network access**
5. **Get connection string**

```bash
# Connection string format
mongodb+srv://username:password@cluster.mongodb.net/novacv?retryWrites=true&w=majority
```

### **Environment Variables**
```bash
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_TEST_URI=your_test_database_connection_string
```

---

## 🔐 Paddle Configuration

### **1. Production Dashboard**
1. **Switch to Production** in Paddle dashboard
2. **Get Production API Key**
3. **Configure Production Webhooks**
4. **Set Production Price IDs**

### **2. Webhook Configuration**
```bash
# Production webhook URL
https://your-domain.vercel.app/api/payments/webhook/paddle

# Events to subscribe:
- transaction.completed
- subscription.created
- subscription.updated
- subscription.canceled
- transaction.payment_failed
- adjustment.created
```

### **3. Environment Variables**
```bash
PADDLE_API_KEY=your_production_api_key
PADDLE_ENVIRONMENT=production
PADDLE_WEBHOOK_SECRET=your_production_webhook_secret
PADDLE_BASIC_PLAN_ID=pri_production_basic_id
PADDLE_PRO_PLAN_ID=pri_production_pro_id
```

---

## 🚀 Deployment Commands

### **Local Development**
```bash
# Start both frontend and backend
npm run dev

# Start individually
npm run dev:frontend    # Frontend on http://localhost:8080
npm run dev:backend     # Backend on http://localhost:5000
```

### **Production Build**
```bash
# Build frontend for production
npm run build

# Build frontend only
npm run build:frontend

# Clean build artifacts
npm run clean
```

### **Install Dependencies**
```bash
# Install all dependencies
npm run install:all

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd backend && npm install
```

---

## 🔍 Troubleshooting

### **Common Issues**

#### **Frontend Build Fails**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **Backend Connection Issues**
- Check MongoDB connection string
- Verify environment variables
- Check network access settings
- Test database connectivity

#### **Paddle Webhook Failures**
- Verify webhook secret
- Check webhook URL accessibility
- Test with Paddle webhook testing tool
- Monitor webhook logs

### **Environment Variable Issues**
```bash
# Check if variables are loaded
console.log('API URL:', process.env.VITE_API_URL);
console.log('MongoDB URI:', process.env.MONGODB_URI);

# Verify .env file location
# Frontend: frontend/.env.local
# Backend: backend/.env
```

---

## 📋 Deployment Checklist

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Paddle webhooks configured
- [ ] Frontend builds successfully
- [ ] API endpoints tested

### **Frontend (Vercel)**
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### **Backend (Vercel Functions)**
- [ ] API routes moved to frontend/api/
- [ ] vercel.json updated
- [ ] Environment variables set
- [ ] Webhook endpoints accessible
- [ ] Database connection working

### **Post-Deployment**
- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] Payment flow tested
- [ ] Webhooks processing
- [ ] Error monitoring active

---

## 🌟 Production Optimization

### **Performance**
- ✅ **Code Splitting** implemented
- ✅ **Lazy Loading** for routes
- ✅ **Image Optimization** with Vite
- ✅ **CDN Distribution** via Vercel

### **Security**
- ✅ **HTTPS** enforced
- ✅ **CORS** configured
- ✅ **Rate Limiting** active
- ✅ **Input Validation** implemented
- ✅ **Webhook Verification** enabled

### **Monitoring**
- ✅ **Error Tracking** (Vercel Analytics)
- ✅ **Performance Monitoring**
- ✅ **Webhook Logs**
- ✅ **Database Monitoring**

---

## 🎉 Ready for Production!

Your Resume Builder is now properly structured for:

✅ **Independent Frontend/Backend Deployment**  
✅ **Scalable Architecture**  
✅ **Easy Maintenance**  
✅ **Professional Hosting**  
✅ **Secure Payment Processing**  

**Deploy with confidence! 🚀**
