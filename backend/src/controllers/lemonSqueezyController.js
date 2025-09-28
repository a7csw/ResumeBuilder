const crypto = require('crypto');
const { lemonSqueezySetup, getWebhookPayload } = require('@lemonsqueezy/lemonsqueezy.js');
const { supabase } = require('../config/database');
const logger = require('../utils/logger');

// Initialize LemonSqueezy with API key
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const LEMONSQUEEZY_TEST_MODE = process.env.LEMONSQUEEZY_TEST_MODE === 'true';

if (LEMONSQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: LEMONSQUEEZY_API_KEY,
    onError: (error) => logger.error('LemonSqueezy API Error:', error)
  });
}

/**
 * Verify LemonSqueezy webhook signature
 */
function verifyWebhookSignature(payload, signature, secret) {
  try {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    const expectedSignature = `sha256=${hash}`;
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Handle LemonSqueezy webhook events
 * @route POST /api/v1/lemonsqueezy/webhook
 * @access Public (but verified)
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-signature'];
    const payload = req.rawBody; // Ensure raw body is preserved

    // Verify webhook signature
    if (!LEMONSQUEEZY_WEBHOOK_SECRET || !signature) {
      logger.warn('LemonSqueezy webhook: Missing signature or secret');
      return res.status(400).json({ 
        error: 'Missing webhook signature or secret' 
      });
    }

    if (!verifyWebhookSignature(payload, signature, LEMONSQUEEZY_WEBHOOK_SECRET)) {
      logger.warn('LemonSqueezy webhook: Invalid signature');
      return res.status(401).json({ 
        error: 'Invalid webhook signature' 
      });
    }

    const event = JSON.parse(payload);
    const { meta, data } = event;

    logger.info(`LemonSqueezy webhook received: ${meta.event_name}`, {
      eventId: meta.event_id,
      testMode: meta.test_mode
    });

    // Store webhook event for tracking
    await storeWebhookEvent(event);

    // Handle different event types
    switch (meta.event_name) {
      case 'order_created':
        await handleOrderCreated(data);
        break;
      
      case 'order_refunded':
        await handleOrderRefunded(data);
        break;

      case 'subscription_created':
        await handleSubscriptionCreated(data);
        break;

      case 'subscription_updated':
        await handleSubscriptionUpdated(data);
        break;

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data);
        break;

      case 'subscription_resumed':
        await handleSubscriptionResumed(data);
        break;

      case 'subscription_expired':
        await handleSubscriptionExpired(data);
        break;

      case 'subscription_paused':
        await handleSubscriptionPaused(data);
        break;

      case 'subscription_unpaused':
        await handleSubscriptionUnpaused(data);
        break;

      case 'subscription_payment_failed':
        await handleSubscriptionPaymentFailed(data);
        break;

      case 'subscription_payment_success':
        await handleSubscriptionPaymentSuccess(data);
        break;

      case 'subscription_payment_recovered':
        await handleSubscriptionPaymentRecovered(data);
        break;

      default:
        logger.info(`Unhandled LemonSqueezy event: ${meta.event_name}`);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    logger.error('LemonSqueezy webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

/**
 * Store webhook event in database for tracking
 */
async function storeWebhookEvent(event) {
  try {
    const { error } = await supabase
      .from('lemonsqueezy_webhook_events')
      .insert({
        event_id: event.meta.event_id,
        event_name: event.meta.event_name,
        test_mode: event.meta.test_mode,
        data: event.data,
        meta: event.meta,
        processed_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Failed to store webhook event:', error);
    }
  } catch (error) {
    logger.error('Error storing webhook event:', error);
  }
}

/**
 * Handle order created event
 */
async function handleOrderCreated(data) {
  try {
    const { attributes } = data;
    const customerEmail = attributes.user_email;
    const orderId = attributes.identifier;
    const productId = attributes.first_order_item?.product_id;
    const variantId = attributes.first_order_item?.variant_id;
    const subtotal = attributes.subtotal;
    const total = attributes.total;

    logger.info('Processing order created:', {
      orderId,
      customerEmail,
      productId,
      total
    });

    // Find or create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    let userId = user?.id;

    if (!user) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: customerEmail,
          first_name: attributes.user_name?.split(' ')[0] || '',
          last_name: attributes.user_name?.split(' ').slice(1).join(' ') || '',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      userId = newUser.id;
    }

    // Create order record
    await supabase
      .from('orders')
      .insert({
        user_id: userId,
        lemonsqueezy_order_id: orderId,
        product_id: productId,
        variant_id: variantId,
        subtotal: subtotal,
        total: total,
        currency: attributes.currency,
        status: attributes.status,
        test_mode: attributes.test_mode,
        created_at: new Date().toISOString()
      });

    // Grant access based on product
    await grantProductAccess(userId, productId, variantId);

    logger.info('Order processed successfully:', { orderId, userId });
  } catch (error) {
    logger.error('Error handling order created:', error);
  }
}

/**
 * Handle order refunded event
 */
async function handleOrderRefunded(data) {
  try {
    const { attributes } = data;
    const orderId = attributes.identifier;

    // Update order status
    await supabase
      .from('orders')
      .update({ 
        status: 'refunded',
        refunded_at: new Date().toISOString()
      })
      .eq('lemonsqueezy_order_id', orderId);

    // Revoke access for this order
    await revokeOrderAccess(orderId);

    logger.info('Order refund processed:', { orderId });
  } catch (error) {
    logger.error('Error handling order refund:', error);
  }
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(data) {
  try {
    const { attributes } = data;
    const customerId = attributes.customer_id;
    const subscriptionId = attributes.id;
    const variantId = attributes.variant_id;
    const productId = attributes.product_id;

    // Find user by customer ID or email
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('lemonsqueezy_customer_id', customerId)
      .single();

    if (!user) {
      logger.warn('User not found for subscription:', { customerId, subscriptionId });
      return;
    }

    // Create subscription record
    await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        lemonsqueezy_subscription_id: subscriptionId,
        product_id: productId,
        variant_id: variantId,
        status: attributes.status,
        current_period_start: attributes.current_period_start,
        current_period_end: attributes.current_period_end,
        test_mode: attributes.test_mode,
        created_at: new Date().toISOString()
      });

    // Grant subscription access
    await grantSubscriptionAccess(user.id, productId, variantId);

    logger.info('Subscription created:', { subscriptionId, userId: user.id });
  } catch (error) {
    logger.error('Error handling subscription created:', error);
  }
}

/**
 * Grant product access to user
 */
async function grantProductAccess(userId, productId, variantId) {
  try {
    // Determine access type and duration based on product
    let accessType = 'lifetime';
    let expiresAt = null;

    // You can customize this based on your product configuration
    if (productId === 'basic_plan') {
      accessType = 'temporary';
      expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
    } else if (productId === 'professional_plan') {
      accessType = 'subscription';
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    await supabase
      .from('user_access')
      .upsert({
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        access_type: accessType,
        expires_at: expiresAt?.toISOString(),
        granted_at: new Date().toISOString()
      });

    logger.info('Product access granted:', { userId, productId, accessType });
  } catch (error) {
    logger.error('Error granting product access:', error);
  }
}

/**
 * Grant subscription access to user
 */
async function grantSubscriptionAccess(userId, productId, variantId) {
  try {
    await supabase
      .from('user_access')
      .upsert({
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        access_type: 'subscription',
        expires_at: null, // Subscription-based, managed by subscription events
        granted_at: new Date().toISOString()
      });

    logger.info('Subscription access granted:', { userId, productId });
  } catch (error) {
    logger.error('Error granting subscription access:', error);
  }
}

/**
 * Revoke access for an order
 */
async function revokeOrderAccess(orderId) {
  try {
    // Find order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('lemonsqueezy_order_id', orderId)
      .single();

    if (order) {
      await supabase
        .from('user_access')
        .delete()
        .eq('user_id', order.user_id)
        .eq('product_id', order.product_id);
    }

    logger.info('Order access revoked:', { orderId });
  } catch (error) {
    logger.error('Error revoking order access:', error);
  }
}

// Add handlers for subscription events
async function handleSubscriptionUpdated(data) {
  // Update subscription status
  logger.info('Subscription updated:', data.attributes.id);
}

async function handleSubscriptionCancelled(data) {
  // Revoke subscription access
  logger.info('Subscription cancelled:', data.attributes.id);
}

async function handleSubscriptionExpired(data) {
  // Handle subscription expiry
  logger.info('Subscription expired:', data.attributes.id);
}

async function handleSubscriptionResumed(data) {
  // Restore subscription access
  logger.info('Subscription resumed:', data.attributes.id);
}

async function handleSubscriptionPaused(data) {
  // Pause subscription access
  logger.info('Subscription paused:', data.attributes.id);
}

async function handleSubscriptionUnpaused(data) {
  // Resume subscription access
  logger.info('Subscription unpaused:', data.attributes.id);
}

async function handleSubscriptionPaymentFailed(data) {
  // Handle payment failure
  logger.info('Subscription payment failed:', data.attributes.id);
}

async function handleSubscriptionPaymentSuccess(data) {
  // Handle successful payment
  logger.info('Subscription payment successful:', data.attributes.id);
}

async function handleSubscriptionPaymentRecovered(data) {
  // Handle payment recovery
  logger.info('Subscription payment recovered:', data.attributes.id);
}

/**
 * Get user's access status
 * @route GET /api/v1/lemonsqueezy/access/:userId
 * @access Private
 */
const getUserAccess = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: access, error } = await supabase
      .from('user_access')
      .select('*')
      .eq('user_id', userId)
      .gte('expires_at', new Date().toISOString())
      .or('expires_at.is.null');

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: access,
      hasAccess: access && access.length > 0
    });
  } catch (error) {
    logger.error('Error getting user access:', error);
    res.status(500).json({ 
      error: 'Failed to get user access' 
    });
  }
};

/**
 * Get store products
 * @route GET /api/v1/lemonsqueezy/products
 * @access Public
 */
const getProducts = async (req, res) => {
  try {
    // Return configured products
    const products = [
      {
        id: 'single',
        name: 'Single Resume',
        description: 'One-time professional resume generation',
        price: 2,
        currency: 'USD',
        interval: null,
        features: [
          'AI-generated professional resume',
          'ATS-optimized format',
          'PDF & Word download',
          'One-time access'
        ]
      },
      {
        id: 'basic',
        name: 'Basic Plan',
        description: '10 days unlimited resume generation',
        price: 5,
        currency: 'USD',
        interval: null,
        features: [
          'Unlimited resume generation',
          'AI-powered content optimization',
          'PDF & Word downloads',
          '10 days access',
          'Professional ATS format'
        ],
        isPopular: true
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        description: 'Monthly subscription with unlimited access',
        price: 11,
        currency: 'USD',
        interval: 'month',
        features: [
          'Everything in Basic Plan',
          'Monthly subscription',
          'Unlimited access',
          'Priority AI processing',
          'Email support'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: products,
      testMode: LEMONSQUEEZY_TEST_MODE
    });
  } catch (error) {
    logger.error('Error getting products:', error);
    res.status(500).json({ 
      error: 'Failed to get products' 
    });
  }
};

module.exports = {
  handleWebhook,
  getUserAccess,
  getProducts
};
