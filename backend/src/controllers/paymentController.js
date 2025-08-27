/**
 * Payment Controller - Simplified for Supabase
 * Since this app uses Supabase Edge Functions for payment operations,
 * these endpoints provide basic responses and redirect to proper Edge Functions
 */

const { catchAsync, APIError } = require('../middlewares/errorHandler');
const { getSupabaseClient } = require('../config/supabase');
const config = require('../config/config');

/**
 * Get available subscription plans
 * @route GET /api/v1/payments/plans
 * @access Public
 */
const getPlans = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Subscription plans configuration',
    data: {
      plans: config.subscriptionPlans,
      paymentProvider: config.payments.provider,
      paddlePlans: config.payments.paddle.plans,
      note: 'Paddle payment processing integrated with Supabase'
    }
  });
});

/**
 * Create checkout session
 * @route POST /api/v1/payments/checkout
 * @access Private
 */
const createCheckout = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Paddle checkout integration',
    note: 'Paddle payment processing with Supabase integration',
    paddlePlans: config.payments.paddle.plans,
    environment: config.payments.paddle.environment
  });
});

/**
 * Get subscription details
 * @route GET /api/v1/payments/subscription
 * @access Private
 */
const getSubscription = catchAsync(async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    // Handle case where Supabase is not configured in development
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Subscription management handled by Supabase Edge Functions',
        note: 'Use your existing check-user-plan Edge Function',
        supabaseConnected: false,
        development: true
      });
    }
    
    // Example: fetch user plans
    const { data: userPlans, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('is_active', true)
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Subscription data available via Supabase',
      note: 'Use Supabase Edge Functions for complete subscription management',
      sample_data: {
        userPlansTableAccess: userPlans ? true : false,
        availableFields: ['plan_type', 'is_active', 'expires_at', 'stripe_customer_id']
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Subscription management handled by Supabase Edge Functions',
      note: 'Use your existing check-user-plan Edge Function'
    });
  }
});

/**
 * Cancel subscription
 * @route DELETE /api/v1/payments/subscription
 * @access Private
 */
const cancelSubscription = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Subscription cancellation handled by payment provider Edge Functions',
    note: 'Use Stripe portal or Lemon Squeezy customer portal Edge Functions'
  });
});

/**
 * Get subscription history
 * @route GET /api/v1/payments/history
 * @access Private
 */
const getPaymentHistory = catchAsync(async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    // Handle case where Supabase is not configured in development
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Payment history handled by Supabase Edge Functions',
        note: 'Query billing_events table for payment history',
        supabaseConnected: false,
        development: true
      });
    }
    
    // Example: fetch billing events
    const { data: billingEvents, error } = await supabase
      .from('billing_events')
      .select('event_type, amount, currency, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    res.status(200).json({
      success: true,
      message: 'Payment history available via Supabase',
      note: 'Use billing_events table for payment history',
      sample_data: {
        billingEventsAccess: billingEvents ? true : false,
        recentEventsCount: billingEvents ? billingEvents.length : 0
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Payment history handled by Supabase Edge Functions',
      note: 'Query billing_events table for payment history'
    });
  }
});

/**
 * Handle webhook from payment provider
 * @route POST /api/v1/payments/webhook/:provider
 * @access Public
 */
const handleWebhook = catchAsync(async (req, res) => {
  const { provider } = req.params;
  
  if (provider === 'paddle') {
    res.status(200).json({
      success: true,
      message: 'Paddle webhook endpoint',
      note: 'Paddle webhook processing with Supabase integration',
      environment: config.payments.paddle.environment
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Unsupported payment provider',
      supportedProviders: ['paddle']
    });
  }
});

/**
 * Get customer portal URL
 * @route GET /api/v1/payments/portal
 * @access Private
 */
const getCustomerPortal = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Paddle customer portal',
    note: 'Paddle customer portal integration with Supabase',
    environment: config.payments.paddle.environment
  });
});

/**
 * Update subscription plan
 * @route PUT /api/v1/payments/subscription/plan
 * @access Private
 */
const updateSubscriptionPlan = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Subscription plan updates handled by Paddle',
    note: 'Use Paddle API for plan changes',
    environment: config.payments.paddle.environment
  });
});

/**
 * Get feature access
 * @route GET /api/v1/payments/features
 * @access Private
 */
const getFeatureAccess = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Feature access determined by subscription plan',
    note: 'Use Supabase Edge Functions for feature access',
    availableFeatures: config.subscriptionPlans
  });
});

/**
 * Verify payment
 * @route POST /api/v1/payments/verify
 * @access Private
 */
const verifyPayment = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payment verification handled by Paddle',
    note: 'Use Paddle webhooks for payment verification',
    environment: config.payments.paddle.environment
  });
});

module.exports = {
  getPlans,
  createCheckout,
  getSubscription,
  cancelSubscription,
  getPaymentHistory,
  handleWebhook,
  getCustomerPortal,
  updateSubscriptionPlan,
  getFeatureAccess,
  verifyPayment,
};