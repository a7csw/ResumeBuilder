/**
 * Authentication Middleware - Simplified for Supabase
 * Basic JWT verification since Supabase handles most auth operations
 */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { APIError } = require('./errorHandler');

/**
 * Middleware to authenticate user with JWT token
 * Basic implementation - Supabase handles full auth
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        note: 'Use Supabase client.auth for proper authentication'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // For simplified implementation, just pass decoded data
    req.user = {
      id: decoded.id,
      email: decoded.email,
      plan: decoded.plan
    };
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
        note: 'Use Supabase client.auth for proper authentication'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        note: 'Use Supabase client.auth for automatic token refresh'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      note: 'Use Supabase client.auth for proper authentication'
    });
  }
};

/**
 * Middleware to check if user has required subscription plan
 * Simplified implementation
 */
const requireSubscription = (requiredPlans = []) => {
  return async (req, res, next) => {
    try {
      const userPlan = req.user?.plan || 'free';
      
      if (requiredPlans.length > 0 && !requiredPlans.includes(userPlan)) {
        return res.status(403).json({
          success: false,
          message: 'Subscription required',
          note: 'Use Supabase Edge Functions for proper plan checking',
          requiredPlans,
          userPlan,
          edgeFunction: '/functions/v1/check-user-plan'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Subscription check error',
        note: 'Use Supabase Edge Functions for proper plan checking'
      });
    }
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        plan: decoded.plan
      };
      req.userId = decoded.id;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate: authenticateToken,
  authenticateToken,
  requireSubscription,
  optionalAuth,
};