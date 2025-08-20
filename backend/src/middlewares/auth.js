/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

/**
 * Verify JWT token and authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7, authHeader.length) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Find user by ID from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Account is deactivated.',
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id.toString();
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.',
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7, authHeader.length) 
      : authHeader;

    if (!token) {
      req.user = null;
      req.userId = null;
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id);
    
    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id.toString();
    } else {
      req.user = null;
      req.userId = null;
    }
    
    next();
  } catch (error) {
    // On error, just continue without authentication
    req.user = null;
    req.userId = null;
    next();
  }
};

/**
 * Check if user has specific subscription plan
 * @param {string|Array} allowedPlans - Required plan(s)
 * @returns {Function} Middleware function
 */
const requirePlan = (allowedPlans) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      const userPlan = req.user.subscription.plan;
      const plans = Array.isArray(allowedPlans) ? allowedPlans : [allowedPlans];
      
      if (!plans.includes(userPlan)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. This feature requires ${plans.join(' or ')} plan.`,
          currentPlan: userPlan,
          requiredPlans: plans,
        });
      }

      // Check if subscription is active and not expired
      if (req.user.subscription.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Subscription is not active.',
          subscriptionStatus: req.user.subscription.status,
        });
      }

      // Check expiration for time-limited plans
      if (req.user.subscription.endDate && new Date() > req.user.subscription.endDate) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Subscription has expired.',
          expiredOn: req.user.subscription.endDate,
        });
      }

      next();
    } catch (error) {
      console.error('Plan verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during plan verification.',
      });
    }
  };
};

/**
 * Check if user has access to specific feature
 * @param {string} feature - Feature to check access for
 * @returns {Function} Middleware function
 */
const requireFeature = (feature) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      if (!req.user.hasFeatureAccess(feature)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Your plan does not include ${feature}.`,
          currentPlan: req.user.subscription.plan,
          feature: feature,
        });
      }

      next();
    } catch (error) {
      console.error('Feature access error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during feature verification.',
      });
    }
  };
};

/**
 * Check AI generation limits
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const checkAIGenerationLimit = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const remaining = req.user.getRemainingAIGenerations();
    
    if (remaining === 0) {
      return res.status(403).json({
        success: false,
        message: 'AI generation limit exceeded. Please upgrade your plan.',
        currentPlan: req.user.subscription.plan,
        limitReached: true,
      });
    }

    // Add remaining count to request for use in controller
    req.aiGenerationsRemaining = remaining;
    
    next();
  } catch (error) {
    console.error('AI generation limit check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during limit verification.',
    });
  }
};

/**
 * Verify user owns the resource
 * @param {string} resourceField - Field name to check ownership (default: 'userId')
 * @returns {Function} Middleware function
 */
const verifyOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      // Get resource owner ID from request params, body, or query
      const resourceOwnerId = req.params[resourceField] || 
                             req.body[resourceField] || 
                             req.query[resourceField];

      if (!resourceOwnerId) {
        return res.status(400).json({
          success: false,
          message: `${resourceField} is required.`,
        });
      }

      // Check if user owns the resource
      if (resourceOwnerId !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.',
        });
      }

      next();
    } catch (error) {
      console.error('Ownership verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during ownership verification.',
      });
    }
  };
};

/**
 * Admin-only access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Check if user has admin role (you can add this field to User model)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin verification.',
    });
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  requirePlan,
  requireFeature,
  checkAIGenerationLimit,
  verifyOwnership,
  requireAdmin,
};
