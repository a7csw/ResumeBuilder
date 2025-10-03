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
      description: 'Resume builder backend with Supabase integration',
      version: '1.0.0',
      database: 'Supabase',
      documentation: '/api/v1/docs',
      note: 'Main functionality handled by Supabase Edge Functions',
      endpoints: {
        users: '/api/v1/users (simplified)',
        payments: '/api/v1/payments (simplified)',
        health: '/api/v1/health',
      },
      supabaseEdgeFunctions: {
        userPlan: '/functions/v1/check-user-plan',
        pdfGeneration: '/functions/v1/generate-resume-pdf',
        aiEnhancement: '/functions/v1/ai-enhance-resume'
      },
      paddleIntegration: {
        checkout: '/api/v1/payments/checkout',
        webhook: '/api/v1/payments/webhook/paddle',
        portal: '/api/v1/payments/portal'
      }
    },
  });
});

// Mount route modules
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
