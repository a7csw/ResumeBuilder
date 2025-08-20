# NovaCV Backend - Deployment Guide

## 🚀 Production Deployment with Paddle Integration

This guide covers deploying the NovaCV backend with complete Paddle payment integration to production.

---

## 📋 Pre-Deployment Checklist

### ✅ **Environment Setup**
- [ ] Node.js 16+ installed
- [ ] MongoDB database setup (MongoDB Atlas recommended)
- [ ] Paddle account configured with products
- [ ] Domain name and SSL certificate
- [ ] Server or cloud hosting (AWS, DigitalOcean, etc.)

### ✅ **Paddle Configuration**
- [ ] Paddle vendor account verified
- [ ] Products created for Basic ($5/10 days) and Pro ($11/month) plans
- [ ] Webhook endpoints configured
- [ ] API keys generated (Live environment)
- [ ] Public key downloaded

---

## 🔧 Environment Variables Setup

Create a `.env` file in the backend root directory:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novacv?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-64-characters-minimum-for-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Paddle Configuration (LIVE)
PADDLE_VENDOR_ID=your-live-paddle-vendor-id
PADDLE_API_KEY=your-live-paddle-api-key
PADDLE_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nYourPaddlePublicKey\n-----END PUBLIC KEY-----
PADDLE_ENVIRONMENT=production
PADDLE_WEBHOOK_SECRET=your-paddle-webhook-secret

# Paddle Product IDs (LIVE)
PADDLE_BASIC_PLAN_ID=your-live-basic-plan-product-id
PADDLE_PRO_PLAN_ID=your-live-pro-plan-product-id

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

---

## 📦 Deployment Steps

### **1. Server Setup (Ubuntu/Linux)**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy
sudo apt install nginx -y

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### **2. Application Deployment**

```bash
# Clone repository
git clone https://github.com/yourusername/novacv-backend.git
cd novacv-backend/backend

# Install dependencies
npm install --production

# Create logs directory
mkdir -p logs

# Copy environment file
cp env.example .env
# Edit .env with your production values
nano .env

# Test application
npm start

# Setup PM2 process
pm2 start src/server.js --name "novacv-backend"
pm2 save
pm2 startup
```

### **3. Nginx Configuration**

Create `/etc/nginx/sites-available/novacv-backend`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # Rate limiting
        limit_req zone=api burst=10 nodelay;
    }

    # Health check endpoint (bypass rate limiting)
    location /api/v1/health {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/novacv-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **4. SSL Certificate Setup**

```bash
# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🔐 Paddle Integration Setup

### **1. Paddle Account Configuration**

1. **Login to Paddle Dashboard**
   - Go to [paddle.com](https://paddle.com)
   - Switch to Live environment

2. **Create Products**
   ```
   Basic Plan:
   - Name: NovaCV Basic Plan
   - Price: $5.00 USD
   - Type: One-time payment
   - Description: 10-day access to basic features
   
   Pro Plan:
   - Name: NovaCV Professional Plan
   - Price: $11.00 USD
   - Type: Subscription (Monthly)
   - Description: Monthly access to all features
   ```

3. **Configure Webhooks**
   - URL: `https://api.yourdomain.com/api/v1/payments/webhook/paddle`
   - Events to subscribe:
     - `subscription_created`
     - `subscription_payment_succeeded`
     - `subscription_updated`
     - `subscription_cancelled`
     - `payment_succeeded`
     - `payment_refunded`

4. **Generate API Keys**
   - Copy Vendor ID
   - Generate API Key
   - Download Public Key

### **2. Test Paddle Integration**

```bash
# Test webhook endpoint
curl -X POST https://api.yourdomain.com/api/v1/payments/webhook/paddle \
  -H "Content-Type: application/json" \
  -d '{"alert_name":"subscription_created","alert_id":"test"}'

# Test checkout generation
curl -X POST https://api.yourdomain.com/api/v1/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"planId":"basic","userId":"USER_ID"}'
```

---

## 📊 Monitoring & Logging

### **1. PM2 Monitoring**

```bash
# View logs
pm2 logs novacv-backend

# Monitor performance
pm2 monit

# Restart application
pm2 restart novacv-backend

# View application info
pm2 info novacv-backend
```

### **2. Log Management**

```bash
# View application logs
tail -f logs/app.log

# Setup log rotation
sudo nano /etc/logrotate.d/novacv-backend
```

Add to logrotate config:
```
/path/to/novacv-backend/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

### **3. Health Monitoring**

Set up monitoring with tools like:
- **Uptime Robot** for uptime monitoring
- **New Relic** or **DataDog** for performance monitoring
- **Sentry** for error tracking

---

## 🔒 Security Best Practices

### **1. Server Security**

```bash
# Setup firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh

# Setup automatic updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### **2. Application Security**

- [ ] Use strong JWT secrets (64+ characters)
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Use HTTPS only
- [ ] Regular dependency updates
- [ ] Monitor for vulnerabilities

### **3. Database Security**

- [ ] Use MongoDB Atlas with IP whitelisting
- [ ] Enable authentication
- [ ] Use connection string with SSL
- [ ] Regular backups
- [ ] Monitor access logs

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: cd backend && npm ci
      
    - name: Run tests
      run: cd backend && npm test
      
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/novacv-backend
          git pull origin main
          cd backend
          npm install --production
          pm2 restart novacv-backend
```

---

## 🧪 Testing in Production

### **1. Health Checks**

```bash
# Test API health
curl https://api.yourdomain.com/api/v1/health

# Test authentication
curl -X POST https://api.yourdomain.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Test payment flow
curl https://api.yourdomain.com/api/v1/payments/plans
```

### **2. Load Testing**

```bash
# Install artillery for load testing
npm install -g artillery

# Create test script
echo "
config:
  target: 'https://api.yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Health check'
    requests:
      - get:
          url: '/api/v1/health'
" > load-test.yml

# Run load test
artillery run load-test.yml
```

---

## 🚨 Troubleshooting

### **Common Issues**

1. **502 Bad Gateway**
   ```bash
   # Check if app is running
   pm2 status
   
   # Check nginx config
   sudo nginx -t
   
   # Check logs
   pm2 logs novacv-backend
   ```

2. **Database Connection Issues**
   ```bash
   # Test MongoDB connection
   mongosh "your-connection-string"
   
   # Check network connectivity
   ping cluster.mongodb.net
   ```

3. **Paddle Webhook Issues**
   ```bash
   # Check webhook logs
   tail -f logs/app.log | grep "Paddle webhook"
   
   # Test webhook manually
   curl -X POST https://api.yourdomain.com/api/v1/payments/webhook/paddle
   ```

### **Performance Issues**

- Monitor memory usage: `pm2 monit`
- Check database query performance
- Optimize nginx configuration
- Enable gzip compression
- Use Redis for caching (optional)

---

## 📈 Scaling Considerations

### **1. Horizontal Scaling**

- Use load balancer (nginx, AWS ALB)
- Multiple server instances
- Shared session storage (Redis)
- Database read replicas

### **2. Caching Strategy**

- Redis for session storage
- CDN for static assets
- Database query caching
- API response caching

### **3. Database Optimization**

- Proper indexing
- Connection pooling
- Query optimization
- Regular maintenance

---

## 🎉 Go Live Checklist

- [ ] Domain configured and SSL enabled
- [ ] Paddle products created and tested
- [ ] Environment variables set correctly
- [ ] Database backup scheduled
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team notified

---

## 📞 Support & Maintenance

### **Regular Tasks**
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Update dependencies monthly
- [ ] Check security vulnerabilities
- [ ] Backup database weekly
- [ ] Review logs for issues

### **Emergency Contacts**
- Server Provider Support
- MongoDB Atlas Support
- Paddle Support
- Domain/SSL Provider

---

**🎊 Congratulations! Your NovaCV backend is now live and ready to process payments!**

For additional support, refer to:
- [Paddle Documentation](https://paddle.com/docs/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
