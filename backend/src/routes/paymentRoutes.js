/**
 * Payment Routes
 * Defines all payment-related API endpoints
 */

const express = require('express');
const router = express.Router();

// Controllers
const paymentController = require('../controllers/paymentController');

// Middleware
const { authenticate } = require('../middlewares/auth');
const { handleValidationErrors } = require('../middlewares/errorHandler');
const { validateCheckout, validateWebhook } = require('../middlewares/validation');
const { 
  authRateLimit,
  ipWhitelist,
  requestSizeLimiter 
} = require('../middlewares/security');

/**
 * @route   GET /api/v1/payments/plans
 * @desc    Get all available subscription plans
 * @access  Public
 */
router.get('/plans', paymentController.getPlans);

/**
 * @route   POST /api/v1/payments/checkout
 * @desc    Create checkout URL for a subscription plan
 * @access  Private
 */
router.post('/checkout',
  authRateLimit,
  authenticate,
  validateCheckout,
  handleValidationErrors,
  paymentController.createCheckout
);

/**
 * @route   GET /api/v1/payments/subscription
 * @desc    Get current user's subscription details
 * @access  Private
 */
router.get('/subscription',
  authenticate,
  paymentController.getSubscription
);

/**
 * @route   POST /api/v1/payments/subscription/cancel
 * @desc    Cancel user's subscription
 * @access  Private
 */
router.post('/subscription/cancel',
  authRateLimit,
  authenticate,
  paymentController.cancelSubscription
);

/**
 * @route   PUT /api/v1/payments/subscription/plan
 * @desc    Update subscription plan (upgrade/downgrade)
 * @access  Private
 */
router.put('/subscription/plan',
  authRateLimit,
  authenticate,
  paymentController.updateSubscriptionPlan
);

/**
 * @route   GET /api/v1/payments/history
 * @desc    Get user's payment history
 * @access  Private
 */
router.get('/history',
  authenticate,
  paymentController.getPaymentHistory
);

/**
 * @route   GET /api/v1/payments/features
 * @desc    Get user's feature access based on subscription
 * @access  Private
 */
router.get('/features',
  authenticate,
  paymentController.getFeatureAccess
);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify payment completion
 * @access  Private
 */
router.post('/verify',
  authenticate,
  paymentController.verifyPayment
);

/**
 * @route   POST /api/v1/payments/webhook/paddle
 * @desc    Handle Paddle webhook events
 * @access  Public (IP restricted)
 * @note    This endpoint should be IP-whitelisted to Paddle's webhook IPs
 */
router.post('/webhook/paddle',
  requestSizeLimiter('5mb'),
  // In production, you should whitelist Paddle's webhook IPs
  // ipWhitelist(['IP1', 'IP2']), // Add Paddle's webhook IPs here
  validateWebhook,
  handleValidationErrors,
  paymentController.handleWebhook
);

module.exports = router;
