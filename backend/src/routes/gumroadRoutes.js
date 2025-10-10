const express = require('express');
const router = express.Router();

/**
 * Gumroad Webhook Handler
 * 
 * Receives notifications from Gumroad when:
 * - Sale is completed
 * - Refund is processed
 * - Subscription is cancelled (for recurring products)
 * 
 * Documentation: https://help.gumroad.com/article/106-webhooks
 */
router.post('/webhook', async (req, res) => {
  try {
    console.log('📥 Gumroad webhook received');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const {
      seller_id,
      product_id,
      product_name,
      permalink,
      email,
      price,
      currency,
      quantity,
      sale_id,
      sale_timestamp,
      purchaser_id,
      subscription_id,
      variants,
      offer_code,
      test,
      ip_country,
      recurrence,
      refunded,
      disputed,
      dispute_won,
      // Additional fields for subscriptions
      cancelled,
      ended
    } = req.body;

    // Verify webhook authenticity (optional but recommended)
    // Gumroad doesn't sign webhooks by default, so we rely on HTTPS and checking seller_id
    const expectedSellerId = process.env.GUMROAD_SELLER_ID;
    if (expectedSellerId && seller_id !== expectedSellerId) {
      console.warn('⚠️ Webhook seller_id mismatch');
      return res.status(403).json({ error: 'Invalid seller ID' });
    }

    // Skip test purchases in production
    if (test === 'true' && process.env.NODE_ENV === 'production') {
      console.log('🧪 Test purchase ignored in production');
      return res.status(200).json({ message: 'Test purchase ignored' });
    }

    // Handle refunds
    if (refunded === 'true') {
      console.log('💸 Refund detected for sale:', sale_id);
      // TODO: Deactivate user subscription in Supabase
      // const { createClient } = require('@supabase/supabase-js');
      // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
      // await supabase.from('user_subscriptions').update({ status: 'refunded' }).eq('gumroad_order_id', sale_id);
      
      return res.status(200).json({ message: 'Refund processed' });
    }

    // Handle disputes
    if (disputed === 'true') {
      console.log('⚖️ Dispute detected for sale:', sale_id);
      // TODO: Handle dispute (suspend access until resolved)
      return res.status(200).json({ message: 'Dispute noted' });
    }

    // Handle subscription cancellation
    if (cancelled === 'true' || ended === 'true') {
      console.log('❌ Subscription cancelled/ended:', subscription_id);
      // TODO: Update subscription status in Supabase
      return res.status(200).json({ message: 'Subscription cancelled' });
    }

    // Handle successful purchase
    if (!refunded && !disputed && !cancelled && !ended) {
      console.log('✅ Valid purchase detected');
      console.log('Email:', email);
      console.log('Product:', product_name);
      console.log('Sale ID:', sale_id);
      console.log('Price:', price, currency);

      // Map product permalink to plan type
      const productToPlan = {
        'resume-single': 'single',
        '10daypass': '10days',
        'novaecv-monthly': 'monthly'
      };

      const planType = productToPlan[permalink];
      if (!planType) {
        console.error('❌ Unknown product permalink:', permalink);
        return res.status(400).json({ error: 'Unknown product' });
      }

      // TODO: Create or update subscription in Supabase
      // This is a backend-only webhook, so we need to:
      // 1. Find user by email (or create if doesn't exist)
      // 2. Create subscription record
      // 3. Send confirmation email (optional)
      
      console.log('📝 Plan type determined:', planType);
      console.log('💡 In production, this would create/update Supabase subscription');

      /*
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL, 
        process.env.SUPABASE_SERVICE_KEY
      );

      // Calculate expiry based on plan
      let expiresAt = null;
      let resumesLimit = null;

      if (planType === 'single') {
        resumesLimit = 1;
      } else if (planType === '10days') {
        expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
      } else if (planType === 'monthly') {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      // Find or create user by email
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      let userId = userData?.users?.find(u => u.email === email)?.id;

      if (!userId) {
        // User doesn't exist - they'll need to sign up and we'll match by email
        // Store pending purchase for email matching
        await supabase.from('pending_purchases').insert({
          email,
          plan_type: planType,
          gumroad_order_id: sale_id,
          price_paid: Math.round(parseFloat(price) * 100),
          currency,
          expires_at: expiresAt,
          resumes_limit: resumesLimit
        });
      } else {
        // User exists - create subscription
        await supabase.from('user_subscriptions').insert({
          user_id: userId,
          plan_type: planType,
          status: 'active',
          gumroad_order_id: sale_id,
          purchased_at: new Date(sale_timestamp).toISOString(),
          expires_at: expiresAt,
          resumes_limit: resumesLimit
        });
      }
      */
    }

    // Always return 200 to Gumroad to prevent retries
    res.status(200).json({ 
      message: 'Webhook received successfully',
      sale_id,
      email,
      product_name
    });

  } catch (error) {
    console.error('❌ Error processing Gumroad webhook:', error);
    // Still return 200 to prevent Gumroad from retrying
    res.status(200).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
