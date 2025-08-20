/**
 * Security Middleware
 * Handles security-related middleware including rate limiting, CORS, etc.
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const config = require('../config/config');

/**
 * CORS configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.frontend.url,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://novacv.com',
      'https://www.novacv.com',
    ];

    if (config.server.nodeEnv === 'development') {
      allowedOrigins.push('http://localhost:8080', 'http://127.0.0.1:3000');
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Forwarded-For',
    'X-Real-IP',
  ],
};

/**
 * General rate limiting
 */
const generalRateLimit = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip;
  },
});

/**
 * Strict rate limiting for authentication routes
 */
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Rate limiting for password reset requests
 */
const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting for AI generation requests
 */
const aiGenerationRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 AI generation requests per 5 minutes
  message: {
    success: false,
    message: 'Too many AI generation requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting for file uploads
 */
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 upload requests per 15 minutes
  message: {
    success: false,
    message: 'Too many upload requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Helmet security configuration
 */
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.paddle.com'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
};

/**
 * Request sanitization middleware
 */
const sanitizeRequest = (req, res, next) => {
  // Remove potentially dangerous properties
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key of dangerousKeys) {
        delete obj[key];
      }
      
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          sanitizeObject(obj[prop]);
        }
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  
  next();
};

/**
 * IP whitelist middleware (for webhook endpoints)
 */
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // In development, allow all IPs
    if (config.server.nodeEnv === 'development') {
      return next();
    }

    if (allowedIPs.length === 0 || allowedIPs.includes(clientIP)) {
      next();
    } else {
      console.warn(`Blocked request from unauthorized IP: ${clientIP}`);
      res.status(403).json({
        success: false,
        message: 'Access denied from this IP address.',
      });
    }
  };
};

/**
 * Request size limiter
 */
const requestSizeLimiter = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength) {
      const sizeMB = parseInt(contentLength) / (1024 * 1024);
      const maxSizeMB = parseInt(maxSize);
      
      if (sizeMB > maxSizeMB) {
        return res.status(413).json({
          success: false,
          message: `Request too large. Maximum size is ${maxSize}.`,
        });
      }
    }
    
    next();
  };
};

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  next();
};

/**
 * Compression middleware configuration
 */
const compressionConfig = compression({
  level: 6, // Compression level 1-9
  threshold: 1024, // Minimum size to compress (1KB)
  filter: (req, res) => {
    // Don't compress responses if this request doesn't accept compression
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Fallback to standard filter function
    return compression.filter(req, res);
  },
});

/**
 * API versioning middleware
 */
const apiVersioning = (req, res, next) => {
  // Set API version in response headers
  res.setHeader('X-API-Version', config.server.apiVersion);
  
  // Check if client specifies API version
  const clientVersion = req.headers['x-api-version'];
  
  if (clientVersion && clientVersion !== config.server.apiVersion) {
    console.warn(`Client using API version ${clientVersion}, server version is ${config.server.apiVersion}`);
  }
  
  next();
};

module.exports = {
  corsOptions,
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  aiGenerationRateLimit,
  uploadRateLimit,
  helmetConfig,
  sanitizeRequest,
  ipWhitelist,
  requestSizeLimiter,
  securityHeaders,
  compressionConfig,
  apiVersioning,
};
