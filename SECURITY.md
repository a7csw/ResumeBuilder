# Security Guide

## Environment Variables Security

### ✅ Current Status
- `.env.local` files are properly ignored by Git
- Only template files are committed to repository
- No secrets found in Git history

### 🔒 Security Best Practices

#### 1. **Never Commit Secrets**
```bash
# These files are automatically ignored:
.env
.env.*
.env.local
.env.production
.env.development
.env.test
.env.staging
```

#### 2. **Setting Up Environment Variables**

**Frontend (Vercel):**
1. Copy `frontend/.env.example` to `frontend/.env.local`
2. Fill in your actual values
3. Add the same variables to Vercel dashboard

**Backend (Render):**
1. Copy `backend/.env.example` to `backend/.env.local`
2. Fill in your actual values
3. Add the same variables to Render dashboard

#### 3. **API Key Rotation**

If you suspect your keys were exposed:

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Delete the old key
3. Create a new key
4. Update in Vercel/Render environment variables

**Supabase:**
1. Go to https://supabase.com/dashboard > Settings > API
2. Regenerate the service role key
3. Update in Vercel/Render environment variables

**Paddle:**
1. Go to https://vendors.paddle.com/authentication
2. Regenerate API keys
3. Update in Vercel/Render environment variables

### 🚨 Emergency Response

If secrets are accidentally committed:

1. **Immediate Actions:**
   ```bash
   # Remove from Git history (use BFG or git filter-branch)
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env.local' \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push to remove from remote
   git push origin --force --all
   ```

2. **Rotate All Exposed Keys** (see section above)

3. **Audit Access Logs** in your service dashboards

### 📋 Environment Variables Checklist

- [ ] `.env.local` files exist locally but are not committed
- [ ] `.env.example` files contain placeholder values only
- [ ] Production secrets are set in deployment platform (Vercel/Render)
- [ ] No hardcoded secrets in source code
- [ ] Regular key rotation schedule established
