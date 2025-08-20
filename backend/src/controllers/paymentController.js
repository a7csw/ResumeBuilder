/**
 * Payment Controller
 * Handles all payment-related operations including Paddle integration
 */

const paddleService = require('../services/paddleService');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { catchAsync, APIError } = require('../middlewares/errorHandler');
const config = require('../config/config');

/**
 * Generate checkout URL for a subscription plan
 * @route POST /api/v1/payments/checkout
 * @access Private
 */
const createCheckout = catchAsync(async (req, res) => {
  const { planId, successUrl, cancelUrl } = req.body;
  const userId = req.userId;

  // Validate plan
  if (!config.subscriptionPlans[planId]) {
    throw new APIError(`Invalid plan: ${planId}`, 400);
  }

  // Get user information
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  // Check if user already has an active subscription
  const existingSubscription = await Subscription.findOne({
    userId,
    status: 'active',
  });

  if (existingSubscription && existingSubscription.isActive()) {
    throw new APIError('User already has an active subscription', 409);
  }

  // Prepare user information for checkout
  const userInfo = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    country: 'US', // You can add country field to user model
  };

  // Generate checkout URL
  const checkoutUrl = await paddleService.generateCheckoutUrl(
    planId,
    userId,
    userInfo
  );

  res.status(200).json({
    success: true,
    message: 'Checkout URL generated successfully',
    data: {
      checkoutUrl,
      plan: config.subscriptionPlans[planId],
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
      },
    },
  });
});

/**
 * Get available subscription plans
 * @route GET /api/v1/payments/plans
 * @access Public
 */
const getPlans = catchAsync(async (req, res) => {
  const plans = Object.values(config.subscriptionPlans).map(plan => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    currency: plan.currency,
    duration: plan.duration,
    recurring: plan.recurring || false,
    features: plan.features,
  }));

  res.status(200).json({
    success: true,
    message: 'Plans retrieved successfully',
    data: { plans },
  });
});

/**
 * Get current user's subscription details
 * @route GET /api/v1/payments/subscription
 * @access Private
 */
const getSubscription = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Get user with subscription details
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  // Get detailed subscription from database
  const subscription = await Subscription.findOne({
    userId,
    status: { $in: ['active', 'trialing', 'past_due'] },
  }).sort({ createdAt: -1 });

  // Prepare response data
  const subscriptionData = {
    plan: user.subscription.plan,
    status: user.subscription.status,
    startDate: user.subscription.startDate,
    endDate: user.subscription.endDate,
    autoRenew: user.subscription.autoRenew,
    daysRemaining: user.subscriptionDaysRemaining,
    features: config.subscriptionPlans[user.subscription.plan]?.features || {},
    usage: {
      aiGenerations: {
        used: user.usage.aiGenerations.used,
        limit: user.usage.aiGenerations.limit,
        remaining: user.getRemainingAIGenerations(),
      },
      templatesUsed: user.usage.templatesUsed.length,
      exportsThisMonth: user.usage.exportsThisMonth,
    },
  };

  // Add Paddle-specific details if available
  if (subscription) {
    subscriptionData.paddle = {
      subscriptionId: subscription.paddleSubscriptionId,
      customerId: subscription.paddleCustomerId,
      nextBillDate: subscription.nextBillDate,
      nextBillAmount: subscription.nextBillAmount,
      currency: subscription.currency,
      billingType: subscription.billingType,
    };
  }

  res.status(200).json({
    success: true,
    message: 'Subscription details retrieved successfully',
    data: subscriptionData,
  });
});

/**
 * Cancel user's subscription
 * @route POST /api/v1/payments/subscription/cancel
 * @access Private
 */
const cancelSubscription = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Find active subscription
  const subscription = await Subscription.findOne({
    userId,
    status: 'active',
  });

  if (!subscription) {
    throw new APIError('No active subscription found', 404);
  }

  // For one-time subscriptions (Basic plan), they can't be cancelled
  if (subscription.billingType === 'one_time') {
    throw new APIError('One-time subscriptions cannot be cancelled', 400);
  }

  // Cancel subscription with Paddle
  const cancelSuccess = await paddleService.cancelSubscription(
    subscription.paddleSubscriptionId
  );

  if (!cancelSuccess) {
    throw new APIError('Failed to cancel subscription with payment provider', 500);
  }

  // Update local subscription status
  await subscription.cancel();

  // Update user subscription status
  const user = await User.findById(userId);
  user.subscription.status = 'cancelled';
  user.subscription.autoRenew = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Subscription cancelled successfully',
    data: {
      cancelledAt: subscription.cancelledAt,
      endDate: subscription.endDate || subscription.nextBillDate,
      remainingAccess: subscription.daysRemaining || subscription.daysUntilNextBill,
    },
  });
});

/**
 * Get subscription history and billing information
 * @route GET /api/v1/payments/history
 * @access Private
 */
const getPaymentHistory = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { page = 1, limit = 10 } = req.query;

  // Get all subscriptions for the user
  const subscriptions = await Subscription.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Subscription.countDocuments({ userId });

  // Format subscription history
  const history = subscriptions.map(sub => ({
    id: sub._id,
    plan: sub.plan,
    status: sub.status,
    startDate: sub.startDate,
    endDate: sub.endDate,
    amount: sub.unitPrice,
    currency: sub.currency,
    billingType: sub.billingType,
    paddleSubscriptionId: sub.paddleSubscriptionId,
    events: sub.events.map(event => ({
      type: event.eventType,
      date: event.processedAt,
      data: event.eventData,
    })),
  }));

  res.status(200).json({
    success: true,
    message: 'Payment history retrieved successfully',
    data: {
      history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    },
  });
});

/**
 * Process Paddle webhook
 * @route POST /api/v1/payments/webhook/paddle
 * @access Public (but IP restricted)
 */
const handlePaddleWebhook = catchAsync(async (req, res) => {
  const webhookData = req.body;
  const signature = req.headers['x-paddle-signature'] || req.body.p_signature;

  // Verify webhook signature
  if (!paddleService.verifyWebhookSignature(webhookData, signature)) {
    throw new APIError('Invalid webhook signature', 401);
  }

  // Process webhook
  const result = await paddleService.processWebhook(webhookData);

  // Log webhook processing
  console.log(`Paddle webhook processed: ${webhookData.alert_name}`, {
    alertId: webhookData.alert_id,
    result: result.success,
    message: result.message,
  });

  res.status(200).json({
    success: true,
    message: 'Webhook processed successfully',
    alertId: webhookData.alert_id,
  });
});

/**
 * Get user's feature access
 * @route GET /api/v1/payments/features
 * @access Private
 */
const getFeatureAccess = catchAsync(async (req, res) => {
  const user = req.user;

  const planConfig = config.subscriptionPlans[user.subscription.plan];
  const features = planConfig ? planConfig.features : {};

  // Check subscription status and expiration
  const isSubscriptionActive = user.subscription.status === 'active' &&
    (!user.subscription.endDate || new Date() < new Date(user.subscription.endDate));

  const featureAccess = {};
  
  if (isSubscriptionActive) {
    // User has active subscription, check each feature
    for (const [feature, value] of Object.entries(features)) {
      featureAccess[feature] = user.hasFeatureAccess(feature);
    }
  } else {
    // No active subscription, deny all paid features
    for (const feature of Object.keys(features)) {
      featureAccess[feature] = false;
    }
  }

  res.status(200).json({
    success: true,
    message: 'Feature access retrieved successfully',
    data: {
      plan: user.subscription.plan,
      subscriptionActive: isSubscriptionActive,
      features: featureAccess,
      usage: {
        aiGenerations: {
          used: user.usage.aiGenerations.used,
          limit: user.usage.aiGenerations.limit,
          remaining: user.getRemainingAIGenerations(),
        },
      },
    },
  });
});

/**
 * Update subscription plan (upgrade/downgrade)
 * @route PUT /api/v1/payments/subscription/plan
 * @access Private
 */
const updateSubscriptionPlan = catchAsync(async (req, res) => {
  const { newPlanId } = req.body;
  const userId = req.userId;

  // Validate new plan
  if (!config.subscriptionPlans[newPlanId]) {
    throw new APIError(`Invalid plan: ${newPlanId}`, 400);
  }

  // Get current subscription
  const currentSubscription = await Subscription.findOne({
    userId,
    status: 'active',
  });

  if (!currentSubscription) {
    throw new APIError('No active subscription found', 404);
  }

  // For now, we'll require users to cancel and create new subscription
  // In a more complex setup, you'd handle plan changes through Paddle API
  throw new APIError(
    'Plan changes are currently not supported. Please cancel your current subscription and subscribe to the new plan.',
    400
  );
});

/**
 * Verify payment completion
 * @route POST /api/v1/payments/verify
 * @access Private
 */
const verifyPayment = catchAsync(async (req, res) => {
  const { checkoutId, subscriptionId } = req.body;
  const userId = req.userId;

  // Find subscription by checkout ID or subscription ID
  const subscription = await Subscription.findOne({
    userId,
    $or: [
      { paddleCheckoutId: checkoutId },
      { paddleSubscriptionId: subscriptionId },
    ],
  });

  if (!subscription) {
    throw new APIError('Payment verification failed: subscription not found', 404);
  }

  // Check if subscription is active
  const isActive = subscription.isActive();

  res.status(200).json({
    success: true,
    message: 'Payment verification completed',
    data: {
      verified: isActive,
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        nextBillDate: subscription.nextBillDate,
      },
    },
  });
});

module.exports = {
  createCheckout,
  getPlans,
  getSubscription,
  cancelSubscription,
  getPaymentHistory,
  handlePaddleWebhook,
  getFeatureAccess,
  updateSubscriptionPlan,
  verifyPayment,
};
