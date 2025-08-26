/**
 * NovaCV Backend Server
 * Express.js server with Paddle payment integration
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Import configuration and utilities
const config = require('./config/config');
const { initializeSupabase, testDatabaseOperations } = require('./config/supabase');
const logger = require('./utils/logger');

// Import middleware
const { globalErrorHandler, handleNotFound } = require('./middlewares/errorHandler');
const {
  corsOptions,
  generalRateLimit,
  helmetConfig,
  sanitizeRequest,
  securityHeaders,
  compressionConfig,
  apiVersioning,
} = require('./middlewares/security');

// Import routes
const apiRoutes = require('./routes');

// Initialize Express app
const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

/**
 * Global Middleware Setup
 */

// Security middleware
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(compressionConfig);

// Rate limiting
app.use(generalRateLimit);

// Note: Webhook handling is done by Supabase Edge Functions
// No special webhook middleware needed for this simplified backend

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request sanitization
app.use(sanitizeRequest);

// API versioning
app.use(apiVersioning);

// Logging middleware
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }));
}

// Custom request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });
  
  next();
});

/**
 * API Routes
 */

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to NovaCV API',
    version: '1.0.0',
    database: 'Supabase',
    note: 'Main functionality handled by Supabase Edge Functions',
    documentation: '/api/v1/info',
    health: '/api/v1/health',
  });
});

// Mount API routes
app.use(`/api/${config.server.apiVersion}`, apiRoutes);

// API documentation endpoint (placeholder)
app.get('/api/v1/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Documentation',
    endpoints: {
      'POST /api/v1/users/register': 'Register a new user',
      'POST /api/v1/users/login': 'Login user',
      'GET /api/v1/users/profile': 'Get user profile',
      'PUT /api/v1/users/profile': 'Update user profile',
      'GET /api/v1/payments/plans': 'Get subscription plans',
      'POST /api/v1/payments/checkout': 'Create checkout URL',
      'GET /api/v1/payments/subscription': 'Get subscription details',
      'POST /api/v1/payments/webhook/paddle': 'Paddle webhook endpoint',
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
    },
  });
});

/**
 * Error Handling
 */

// Handle 404 for undefined routes
app.use(handleNotFound);

// Global error handler
app.use(globalErrorHandler);

/**
 * Graceful Shutdown Handler
 */
const gracefulShutdown = (signal) => {
  logger.logSystem('shutdown_initiated', { signal });
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown', { error: err.message });
      process.exit(1);
    }
    
    logger.logSystem('server_closed');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Force closing server after timeout');
    process.exit(1);
  }, 30000);
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason?.message || reason,
    promise: promise.toString(),
  });
  process.exit(1);
});

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Initialize Supabase client
    await initializeSupabase();
    
    // Test database operations
    const dbTestPassed = await testDatabaseOperations();
    if (!dbTestPassed) {
      console.warn('⚠️ Database tests failed, but continuing to start server...');
    }
    
    // Start HTTP server
    const PORT = config.server.port;
    const server = app.listen(PORT, () => {
      logger.logSystem('server_started', {
        port: PORT,
        environment: config.server.nodeEnv,
        version: '1.0.0',
      });
      
      console.log(`
🚀 NovaCV Backend Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Server: http://localhost:${PORT}
🔧 Environment: ${config.server.nodeEnv}
📊 API Version: ${config.server.apiVersion}
📚 Documentation: http://localhost:${PORT}/api/v1/docs
❤️ Health Check: http://localhost:${PORT}/api/v1/health

💳 Payment Provider: ${config.payments.provider}
🗄️ Database: Supabase
🔐 Security: Enabled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
      
      // Log important configuration warnings
      if (config.server.nodeEnv === 'production') {
        if (!config.supabase.serviceRoleKey) {
          logger.warn('Production warning: Supabase service role key not configured');
        }
        if (config.jwt.secret === 'your-fallback-secret-key') {
          logger.warn('Production warning: Using default JWT secret');
        }
        if (!config.payments.stripe.secretKey && config.payments.provider === 'stripe') {
          logger.warn('Production warning: Stripe secret key not configured');
        }
      }
    });

    // Make server available for graceful shutdown
    global.server = server;

    return server;
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
