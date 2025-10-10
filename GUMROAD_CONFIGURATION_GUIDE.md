# 🎯 Gumroad Configuration Guide

## Overview
This guide provides step-by-step instructions for configuring your Gumroad products to work seamlessly with the ResumeBuilder application.

---

## 📋 TASK 1: Configure Post-Purchase Redirects

### Why This Matters
After a customer purchases on Gumroad, they need to be redirected back to your website to activate their access. Gumroad doesn't automatically send custom parameters, so we'll use their standard redirect feature.

### Steps for Each Product

#### For All Three Products (Do This 3 Times):

1. **Log in to Gumroad**
   - Go to https://app.gumroad.com/products
   - You should see your three products:
     - `resume-single` (€1)
     - `10daypass` (€4)
     - `novaecv-monthly` (€9)

2. **Edit Each Product**
   - Click on the product name to edit it
   - Scroll down to the **"After purchase"** section

3. **Set the Redirect URL**
   - Find the field labeled **"Redirect to this URL after purchase"**
   - Enter your website's success page URL:
     
     **For Development:**
     ```
     http://localhost:8080/success
     ```
     
     **For Production:**
     ```
     https://yourdomain.com/success
     ```
     
   - ✅ Check the box: **"Send product information as URL parameters"**
     - This will make Gumroad append: `?product_id=...&product_permalink=...&email=...&sale_id=...`

4. **Save Changes**
   - Click **"Save"** at the bottom of the page
   - Verify the redirect URL is saved

5. **Repeat for All Products**
   - Do steps 2-4 for:
     - ✅ resume-single
     - ✅ 10daypass
     - ✅ novaecv-monthly

---

## 📝 TASK 2: Update Product Descriptions

### Current Issues
Your products may mention "premium tool access" or other features that don't exist. Let's clarify what customers actually get.

### Product 1: Single Resume (€1)
**Current Permalink:** `resume-single`

#### Updated Product Description (Copy & Paste This):

```
🎯 SINGLE RESUME - ONE-TIME PURCHASE

Get instant access to generate ONE professional, ATS-optimized resume.

✅ What You Get:
• 1 AI-generated professional resume
• ATS-optimized format (beats applicant tracking systems)
• Download as PDF & Word (.docx)
• One-time access for 1 day

💡 Perfect for:
• Quick job applications
• Testing the resume builder
• Single resume update

⚡ Instant access after purchase - no subscription required!

---

📌 NOTE: This is a one-time purchase. You'll have 1 day to generate your resume. Need more? Get the 10-Day Pass for unlimited resumes!
```

---

### Product 2: 10-Day Access Pass (€4)
**Current Permalink:** `10daypass`

#### Updated Product Description (Copy & Paste This):

```
🌟 MOST POPULAR - 10 DAY ACCESS PASS

Get UNLIMITED resume generation for 10 full days!

✅ What You Get:
• UNLIMITED resume generation for 10 days
• AI-powered content optimization
• ATS-optimized format
• Download as PDF & Word (.docx)
• Full access to all resume templates
• Professional formatting

💡 Perfect for:
• Job seekers applying to multiple positions
• Testing different resume formats
• Unlimited revisions and updates
• Career changers

⚡ Access activates immediately and lasts 10 days from purchase!

---

📌 BEST VALUE: Generate as many resumes as you need within 10 days - perfect for active job hunting!
```

---

### Product 3: 30-Day Pro Pass (€9)
**Current Permalink:** `novaecv-monthly`

#### Updated Product Description (Copy & Paste This):

```
👑 MAXIMUM VALUE - 30-DAY PRO PASS

Get UNLIMITED resume generation for 30 full days!

✅ What You Get:
• UNLIMITED resume generation for 30 days
• AI-powered content optimization
• ATS-optimized format
• Download as PDF & Word (.docx)
• Full access to all resume templates
• Professional formatting
• Priority AI processing

💡 Perfect for:
• Serious job seekers
• Career transitions
• Multiple job applications
• Long-term job search campaigns
• Building resume variations for different roles

⚡ Full access for 30 days - create unlimited resumes!

---

📌 EXTENDED ACCESS: Perfect for comprehensive job searches. Generate unlimited professional resumes for an entire month!
```

---

## 🔧 TASK 3: Configure Webhook (Optional but Recommended)

### Why Use Webhooks?
Webhooks provide server-side verification of purchases and handle refunds/disputes automatically.

### Steps:

1. **Go to Gumroad Settings**
   - Navigate to: https://app.gumroad.com/settings/advanced
   - Scroll to the **"Webhooks"** section

2. **Set Ping URL**
   
   **For Production:**
   ```
   https://yourdomain.com/api/v1/gumroad/webhook
   ```
   
   **For Local Testing (use ngrok):**
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start your backend
   cd backend && npm start
   
   # In another terminal
   ngrok http 3000
   
   # Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
   # Set webhook to: https://abc123.ngrok.io/api/v1/gumroad/webhook
   ```

3. **Save Webhook URL**
   - Click **"Save"**
   - Gumroad will send a test ping to verify

4. **What the Webhook Handles:**
   - ✅ Purchase confirmation
   - ✅ Refund processing (auto-deactivates access)
   - ✅ Dispute handling
   - ✅ Subscription cancellations

---

## ✅ Verification Checklist

After completing the above configurations, verify everything works:

### 1. Product Redirects (Test Each)
- [ ] **Single Resume**: After purchase, redirects to `/success` with parameters
- [ ] **10-Day Pass**: After purchase, redirects to `/success` with parameters
- [ ] **30-Day Pass**: After purchase, redirects to `/success` with parameters

### 2. Success Page Functionality
- [ ] Shows loading state while processing
- [ ] If not logged in, prompts to sign in
- [ ] After login, activates subscription in Supabase
- [ ] Shows success message with plan details
- [ ] Redirects to dashboard or resume builder

### 3. Webhook (If Configured)
- [ ] Receives purchase notifications
- [ ] Creates/updates subscriptions
- [ ] Handles refunds correctly
- [ ] Logs all events

### 4. Product Descriptions
- [ ] All three products have accurate descriptions
- [ ] No mention of non-existent features
- [ ] Clear differentiation between plans
- [ ] Accurate duration information

---

## 🧪 How to Test

### Test Purchase Flow (Gumroad Offers Free Test Mode)

1. **Enable Test Mode**
   - Go to each product on Gumroad
   - Find **"Test mode"** or create a test offer code
   - Gumroad creators can make test purchases for free

2. **Test the Flow**
   ```
   1. Click "Get [Plan]" on your pricing page
   2. Complete purchase on Gumroad (use test mode)
   3. Verify redirect to /success page
   4. Check URL parameters: ?product_permalink=...&sale_id=...&email=...
   5. Sign in if needed
   6. Verify subscription created in Supabase
   7. Check access duration is correct
   8. Try generating a resume
   ```

3. **Check Supabase**
   - Go to Supabase dashboard
   - Open `user_subscriptions` table
   - Verify new entry with:
     - ✅ Correct `plan_type` (single, 10days, monthly)
     - ✅ Correct `expires_at` (1, 10, or 30 days)
     - ✅ Status = 'active'
     - ✅ `gumroad_order_id` populated

---

## 🚨 Troubleshooting

### Issue: Redirect doesn't work
**Solution:**
- Verify redirect URL is set in Gumroad product settings
- Check "Send product information as URL parameters" is enabled
- Clear browser cache and try again

### Issue: No parameters in redirect URL
**Solution:**
- Enable "Send product information as URL parameters" in Gumroad
- Gumroad sends: `product_permalink`, `sale_id`, `email`, `product_id`

### Issue: Subscription not created
**Solution:**
- Check browser console for errors
- Verify user is authenticated
- Check Supabase connection
- Verify `user_subscriptions` table exists

### Issue: Wrong access duration
**Solution:**
- Check product permalink matches:
  - `resume-single` → 1 day
  - `10daypass` → 10 days
  - `novaecv-monthly` → 30 days
- Verify mapping in Success.tsx

---

## 📊 Expected URL Parameters from Gumroad

When Gumroad redirects after purchase, the URL will look like:

```
https://yourdomain.com/success?product_id=123456&product_permalink=resume-single&email=customer@email.com&sale_id=ABC123&sale_timestamp=2025-01-01
```

### Parameters Sent by Gumroad:
- `product_id` - Gumroad's internal product ID
- `product_permalink` - Your product's permalink (e.g., "resume-single")
- `email` - Customer's email address
- `sale_id` - Unique sale identifier
- `sale_timestamp` - When the sale occurred

### Our App Maps:
- `resume-single` → `single` plan → 1 day access
- `10daypass` → `10days` plan → 10 days access
- `novaecv-monthly` → `monthly` plan → 30 days access

---

## 📝 Summary

### Manual Steps Required on Gumroad:

1. ✅ Set redirect URL for all 3 products → `/success`
2. ✅ Enable "Send product information as URL parameters"
3. ✅ Update product descriptions (copy from above)
4. ✅ Configure webhook URL (optional)
5. ✅ Test with Gumroad test purchases

### Automatic (Already Done in Code):

- ✅ Success page handles Gumroad redirects
- ✅ Maps product permalinks to access durations
- ✅ Creates subscriptions in Supabase
- ✅ Handles authentication flow
- ✅ Shows success/error messages
- ✅ Webhook endpoint ready for Gumroad notifications

---

**Next Step:** Follow the checklists above to configure your Gumroad products! 🚀



