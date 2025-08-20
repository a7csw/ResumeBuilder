/**
 * Helper Utilities
 * Common utility functions used across the application
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate random string
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate secure random token
 * @param {number} bytes - Number of bytes (default 32)
 * @returns {string} Secure random token
 */
const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('base64url');
};

/**
 * Hash sensitive data
 * @param {string} data - Data to hash
 * @param {string} algorithm - Hash algorithm (default sha256)
 * @returns {string} Hashed data
 */
const hashData = (data, algorithm = 'sha256') => {
  return crypto.createHash(algorithm).update(data).digest('hex');
};

/**
 * Create HMAC signature
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @param {string} algorithm - HMAC algorithm (default sha256)
 * @returns {string} HMAC signature
 */
const createHMAC = (data, secret, algorithm = 'sha256') => {
  return crypto.createHmac(algorithm, secret).update(data).digest('hex');
};

/**
 * Verify HMAC signature
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key
 * @param {string} algorithm - HMAC algorithm (default sha256)
 * @returns {boolean} Is signature valid
 */
const verifyHMAC = (data, signature, secret, algorithm = 'sha256') => {
  const expectedSignature = createHMAC(data, secret, algorithm);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};

/**
 * Sanitize string for safe usage
 * @param {string} str - String to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized string
 */
const sanitizeString = (str, options = {}) => {
  if (typeof str !== 'string') return '';
  
  const {
    maxLength = 1000,
    allowHTML = false,
    allowSpecialChars = true,
  } = options;

  let sanitized = str.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Remove HTML if not allowed
  if (!allowHTML) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Remove special characters if not allowed
  if (!allowSpecialChars) {
    sanitized = sanitized.replace(/[<>{}[\]\\\/]/g, '');
  }
  
  return sanitized;
};

/**
 * Format currency amount
 * @param {number} amount - Amount in cents or smallest currency unit
 * @param {string} currency - Currency code (default USD)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD') => {
  const value = amount / 100; // Convert cents to dollars
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Parse currency amount to cents
 * @param {number|string} amount - Amount in dollars
 * @returns {number} Amount in cents
 */
const parseCurrencyToCents = (amount) => {
  const value = parseFloat(amount);
  return Math.round(value * 100);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is email valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is phone valid
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Generate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Pagination metadata
 */
const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null,
  };
};

/**
 * Delay execution for specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate API response format
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {Object} data - Response data
 * @param {Object} meta - Additional metadata
 * @returns {Object} Formatted API response
 */
const apiResponse = (success, message, data = null, meta = {}) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

/**
 * Extract JWT payload without verification
 * @param {string} token - JWT token
 * @returns {Object|null} JWT payload or null if invalid
 */
const extractJWTPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = Buffer.from(parts[1], 'base64').toString();
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

/**
 * Mask sensitive data for logging
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of chars to show (default 4)
 * @param {string} maskChar - Character to use for masking (default *)
 * @returns {string} Masked data
 */
const maskSensitiveData = (data, visibleChars = 4, maskChar = '*') => {
  if (!data || typeof data !== 'string') return '';
  
  if (data.length <= visibleChars) {
    return maskChar.repeat(data.length);
  }
  
  const visible = data.slice(-visibleChars);
  const masked = maskChar.repeat(data.length - visibleChars);
  return masked + visible;
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} Is object empty
 */
const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

/**
 * Convert string to slug
 * @param {string} str - String to convert
 * @returns {string} Slug
 */
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places
 * @returns {number} Percentage
 */
const calculatePercentage = (value, total, decimals = 2) => {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

module.exports = {
  generateRandomString,
  generateSecureToken,
  hashData,
  createHMAC,
  verifyHMAC,
  sanitizeString,
  formatCurrency,
  parseCurrencyToCents,
  isValidEmail,
  isValidPhone,
  generatePagination,
  delay,
  apiResponse,
  extractJWTPayload,
  maskSensitiveData,
  isEmpty,
  deepClone,
  slugify,
  calculatePercentage,
};
