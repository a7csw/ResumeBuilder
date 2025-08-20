# 🚀 Deploy NovaCV to Vercel - Complete Guide

## 🎯 Quick Deploy to Vercel

Deploy your NovaCV resume builder to Vercel in under 5 minutes!

---

## 📋 Prerequisites

- ✅ GitHub repository with your NovaCV code
- ✅ Vercel account (free)
- ✅ Backend deployed (optional for frontend-only deployment)

---

## 🚀 Step-by-Step Deployment

### **1. Prepare Your Repository**

Make sure your repository is up to date:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### **2. Deploy to Vercel**

#### **Option A: Deploy via Vercel Dashboard (Recommended)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in/Sign up** with GitHub
3. **Click "New Project"**
4. **Import your repository**: `a7csw/ResumeBuilder`
5. **Configure project settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### **Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts
```

### **3. Environment Variables Setup**

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```bash
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api/v1
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_STORAGE_KEY=novacv_token
VITE_REFRESH_TOKEN_KEY=novacv_refresh_token

# Frontend URLs
VITE_APP_URL=https://your-vercel-domain.vercel.app
VITE_SUCCESS_URL=https://your-vercel-domain.vercel.app/payment-success
VITE_CANCEL_URL=https://your-vercel-domain.vercel.app/pricing

# Environment
VITE_ENVIRONMENT=production
```

### **4. Build Configuration**

Vercel will automatically detect your Vite configuration, but you can customize:

**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

---

## 🔧 Vercel Configuration File

Your `vercel.json` is already configured for optimal deployment:

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
  ]
}
```

---

## 🌐 Custom Domain Setup

### **1. Add Custom Domain**

1. Go to **Settings → Domains**
2. Click **Add Domain**
3. Enter your domain: `novacv.com` or `yourdomain.com`
4. Follow DNS configuration instructions

### **2. DNS Configuration**

Add these records to your domain provider:

```bash
# For Vercel
Type: CNAME
Name: @
Value: cname.vercel-dns.com

# For www subdomain
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

---

## 🔄 Automatic Deployments

### **Enable Auto-Deploy**

1. **Settings → Git**
2. **Enable "Auto Deploy"**
3. **Select branch**: `main`
4. **Deploy on push**: ✅ Enabled

Now every `git push` to main will automatically deploy!

---

## 📱 Frontend-Only vs Full-Stack

### **Frontend-Only Deployment (Current)**

✅ **What's Deployed:**
- React frontend with Vite
- Static assets and components
- Client-side routing
- UI/UX components

❌ **What's NOT Deployed:**
- Backend API (Node.js/Express)
- Database connections
- Payment processing
- User authentication

### **Full-Stack Deployment (Recommended)**

For complete functionality, you need:

1. **Frontend**: Deployed on Vercel ✅
2. **Backend**: Deployed on separate hosting (Railway, Render, etc.)
3. **Database**: MongoDB Atlas or similar
4. **Payment**: Paddle integration configured

---

## 🚨 Common Issues & Solutions

### **Build Failures**

```bash
# Error: Build command failed
Solution: Check package.json scripts
- Ensure "build": "vite build" exists
- Verify all dependencies are in package.json

# Error: Output directory not found
Solution: Verify dist/ folder is generated
- Run npm run build locally first
- Check .gitignore doesn't exclude dist/
```

### **Environment Variables**

```bash
# Error: VITE_API_URL not defined
Solution: Add environment variables in Vercel dashboard
- Go to Settings → Environment Variables
- Add VITE_API_URL=https://your-backend.com
- Redeploy after adding variables
```

### **Routing Issues**

```bash
# Error: 404 on page refresh
Solution: Vercel.json routes are already configured
- Ensure vercel.json is in root directory
- Routes should handle SPA routing correctly
```

---

## 📊 Performance Optimization

### **Vercel Edge Network**

Your app automatically gets:
- ✅ **Global CDN** (200+ locations)
- ✅ **Edge caching** for static assets
- ✅ **Automatic optimization** for images
- ✅ **HTTP/2** and **HTTP/3** support

### **Build Optimization**

```bash
# Optimize bundle size
npm run build -- --mode production

# Analyze bundle
npm run build -- --analyze
```

---

## 🔒 Security & HTTPS

### **Automatic HTTPS**

✅ **Vercel provides:**
- Free SSL certificates
- Automatic HTTPS redirects
- HSTS headers
- Security best practices

### **Environment Security**

```bash
# Never commit sensitive data
# Use Vercel environment variables for:
- API keys
- Database URLs
- Payment credentials
- JWT secrets
```

---

## 📈 Monitoring & Analytics

### **Vercel Analytics**

1. **Go to Analytics tab**
2. **Enable Web Analytics**
3. **Track performance metrics**

### **Custom Monitoring**

```bash
# Add monitoring to your app
- Error tracking (Sentry)
- Performance monitoring
- User analytics
```

---

## 🚀 Production Checklist

### **Before Deploying**

- [ ] All environment variables set
- [ ] Backend API deployed and accessible
- [ ] Payment integration configured
- [ ] Database connection tested
- [ ] Build runs successfully locally

### **After Deploying**

- [ ] Test all major user flows
- [ ] Verify payment processing
- [ ] Check mobile responsiveness
- [ ] Test authentication flow
- [ ] Monitor error logs

---

## 🔄 Updating Your Deployment

### **Automatic Updates**

```bash
# Push to main branch
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys! 🎉
```

### **Manual Redeploy**

1. **Vercel Dashboard → Deployments**
2. **Click "Redeploy"** on latest deployment
3. **Or trigger via CLI**: `vercel --prod`

---

## 💰 Vercel Pricing

### **Free Tier (Hobby)**
- ✅ **Unlimited deployments**
- ✅ **Custom domains**
- ✅ **HTTPS included**
- ✅ **100GB bandwidth/month**
- ✅ **Perfect for NovaCV!**

### **Pro Tier ($20/month)**
- ✅ **Team collaboration**
- ✅ **Advanced analytics**
- ✅ **Password protection**
- ✅ **More bandwidth**

---

## 🎯 Next Steps After Deployment

1. **✅ Frontend deployed on Vercel**
2. **🔧 Deploy backend** (Railway, Render, etc.)
3. **🗄️ Setup MongoDB Atlas**
4. **💳 Configure Paddle payments**
5. **🔗 Connect frontend to backend**
6. **🧪 Test complete user flow**
7. **🚀 Launch to users!**

---

## 🆘 Need Help?

### **Vercel Support**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

### **Common Resources**
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

## 🎉 Congratulations!

Your NovaCV resume builder is now deployed on Vercel with:
- ✅ **Professional hosting**
- ✅ **Global CDN**
- ✅ **Automatic HTTPS**
- ✅ **Continuous deployment**
- ✅ **Performance optimization**

**Ready to launch your resume builder platform! 🚀**

---

**Happy Deploying! 🎊**
