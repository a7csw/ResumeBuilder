/**
 * Application Configuration
 * Centralizes all environment variables and configuration settings
 */

require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/novacv',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/novacv_test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Paddle Configuration (Modern SDK)
  paddle: {
    apiKey: process.env.PADDLE_API_KEY,
    environment: process.env.PADDLE_ENVIRONMENT || 'sandbox',
    webhookSecret: process.env.PADDLE_WEBHOOK_SECRET,
    // Price IDs for different plans (modern Paddle uses Price IDs)
    plans: {
      basic: process.env.PADDLE_BASIC_PLAN_ID,
      pro: process.env.PADDLE_PRO_PLAN_ID,
    },
    // Legacy fields (deprecated in modern SDK)
    // vendorId: process.env.PADDLE_VENDOR_ID, // No longer used
    // publicKey: process.env.PADDLE_PUBLIC_KEY, // Replaced by webhookSecret
  },

  // Plans Configuration
  subscriptionPlans: {
    basic: {
      id: 'basic',
      name: 'Basic Plan',
      price: 5.00,
      currency: 'USD',
      duration: 10, // days
      features: {
        aiGenerations: 1,
        templates: 3,
        exports: ['pdf'],
        customization: 'basic',
        support: 'email',
        watermark: true,
        analytics: false,
        atsOptimization: false,
      },
    },
    pro: {
      id: 'pro',
      name: 'Professional Plan',
      price: 11.00,
      currency: 'USD',
      duration: 30, // days (monthly)
      recurring: true,
      features: {
        aiGenerations: -1, // unlimited
        templates: 20,
        exports: ['pdf', 'docx'],
        customization: 'advanced',
        support: 'priority',
        watermark: false,
        analytics: true,
        atsOptimization: true,
        customStyling: true,
        unlimitedRevisions: true,
      },
    },
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },

  // Frontend Configuration
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    successUrl: process.env.FRONTEND_URL + '/payment-success' || 'http://localhost:3000/payment-success',
    cancelUrl: process.env.FRONTEND_URL + '/payment-cancel' || 'http://localhost:3000/payment-cancel',
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
};

// Validation for required environment variables
const requiredEnvVars = [
  'PADDLE_API_KEY',
  'PADDLE_BASIC_PLAN_ID',
  'PADDLE_PRO_PLAN_ID',
  'JWT_SECRET',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && config.server.nodeEnv === 'production') {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Log configuration in development
if (config.server.nodeEnv === 'development') {
  console.log('🔧 Configuration loaded:', {
    nodeEnv: config.server.nodeEnv,
    port: config.server.port,
    paddleEnv: config.paddle.environment,
    databaseUri: config.database.uri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
  });
}

module.exports = config;
