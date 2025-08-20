/**
 * Routes Index
 * Main router that combines all route modules
 */

const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const paymentRoutes = require('./paymentRoutes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NovaCV API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Info endpoint
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'NovaCV API',
      description: 'Resume builder backend with Paddle payment integration',
      version: '1.0.0',
      documentation: '/api/v1/docs',
      endpoints: {
        users: '/api/v1/users',
        payments: '/api/v1/payments',
        health: '/api/v1/health',
      },
    },
  });
});

// Mount route modules
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
