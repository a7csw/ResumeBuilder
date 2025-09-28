const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { handleWebhook, getUserAccess, getProducts } = require('../controllers/lemonSqueezyController');
const auth = require('../middlewares/auth');

/**
 * @route   POST /api/v1/lemonsqueezy/webhook
 * @desc    Handle LemonSqueezy webhook events
 * @access  Public (but signature verified)
 */
router.post('/webhook', handleWebhook);

/**
 * @route   GET /api/v1/lemonsqueezy/products
 * @desc    Get available products
 * @access  Public
 */
router.get('/products', getProducts);

/**
 * @route   GET /api/v1/lemonsqueezy/access/:userId
 * @desc    Get user's access status
 * @access  Private
 */
router.get('/access/:userId', auth, getUserAccess);

/**
 * @route   GET /api/v1/lemonsqueezy/health
 * @desc    Health check for LemonSqueezy integration
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LemonSqueezy integration is healthy',
    testMode: process.env.LEMONSQUEEZY_TEST_MODE === 'true',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
