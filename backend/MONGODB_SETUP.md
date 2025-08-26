# 🗄️ MongoDB Atlas Setup Guide

## ⚠️ **CRITICAL: You Need a Real MongoDB Database**

The test MongoDB URI in the environment variables doesn't exist. You need to create a real MongoDB Atlas cluster.

---

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Create Free MongoDB Atlas Account**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click "Start Free"
3. Sign up with email or Google
4. Verify your email

### **Step 2: Create Free Cluster**
1. Click "Create" when prompted
2. Choose **FREE tier** (M0 Sandbox - Free forever)
3. Select region closest to your Render deployment (Oregon/US-East)
4. Name your cluster (e.g., "ResumeBuilder")
5. Click "Create Cluster" (takes 1-3 minutes)

### **Step 3: Create Database User**
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `resumebuilder`
5. Password: Click "Autogenerate Secure Password" and COPY it
6. Database User Privileges: "Atlas Admin"
7. Click "Add User"

### **Step 4: Whitelist IP Addresses**
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Render deployment)
4. Click "Confirm"

### **Step 5: Get Connection String**
1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "5.5 or later"
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://resumebuilder:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```

### **Step 6: Update Connection String**
Replace `<password>` with the actual password you copied in Step 3:
```
mongodb+srv://resumebuilder:your-actual-password@cluster0.abc123.mongodb.net/novacv?retryWrites=true&w=majority
```

**Note**: Add `/novacv` before the `?` to specify the database name.

---

## 📋 **Update Render Environment Variables**

Go to your Render service → Environment → Environment Variables and update:

```bash
MONGODB_URI=mongodb+srv://resumebuilder:your-actual-password@cluster0.abc123.mongodb.net/novacv?retryWrites=true&w=majority
```

**Replace with your actual:**
- Username (e.g., `resumebuilder`)
- Password (from Step 3)
- Cluster URL (from Step 5)

---

## ✅ **Test Your Connection**

After updating the MONGODB_URI in Render, redeploy and check the logs. You should see:
```
✅ MongoDB Connected: cluster0-shard-00-02.abc123.mongodb.net
```

Instead of:
```
❌ MongoDB connection failed: querySrv ENOTFOUND
```

---

## 🔒 **Security Best Practices**

1. **Use Strong Password**: Auto-generated passwords are recommended
2. **Whitelist Specific IPs**: For production, whitelist only Render's IPs
3. **Regular Backups**: MongoDB Atlas provides automatic backups
4. **Monitor Usage**: Keep an eye on your free tier limits

---

## 💡 **Free Tier Limits**

MongoDB Atlas Free Tier includes:
- ✅ 512 MB storage
- ✅ 100 connections
- ✅ No time limit
- ✅ Perfect for development and small apps

---

## 🆘 **Troubleshooting**

### **Connection String Format:**
```
mongodb+srv://[username]:[password]@[cluster-url]/[database-name]?retryWrites=true&w=majority
```

### **Common Issues:**
1. **Wrong Password**: Make sure to use the database user password, not your Atlas account password
2. **IP Not Whitelisted**: Add "0.0.0.0/0" for Render (all IPs)
3. **Special Characters**: If password has special characters, URL encode them
4. **Database Name**: Don't forget `/novacv` in the connection string

### **Test Locally:**
```bash
mongosh "mongodb+srv://resumebuilder:password@cluster0.abc123.mongodb.net/novacv"
```

---

## 🎯 **Expected Result**

After setup, your Render deployment should show:
```
✅ MongoDB Connected: cluster0-shard-00-02.abc123.mongodb.net
🚀 NovaCV Backend Server Started!
```

Your backend will be fully functional and ready to handle user registrations, authentication, and data storage!
