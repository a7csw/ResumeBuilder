/**
 * Validation Middleware
 * Contains validation rules for different routes
 */

const { body, param, query } = require('express-validator');

/**
 * User registration validation
 */
const validateUserRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * User login validation
 */
const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * User profile update validation
 */
const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
];

/**
 * Password change validation
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match');
      }
      return true;
    }),
];

/**
 * Subscription checkout validation
 */
const validateCheckout = [
  body('planId')
    .notEmpty()
    .withMessage('Plan ID is required')
    .isIn(['basic', 'pro'])
    .withMessage('Plan ID must be either "basic" or "pro"'),

  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('User ID must be a valid MongoDB ObjectId'),

  body('successUrl')
    .optional()
    .isURL()
    .withMessage('Success URL must be a valid URL'),

  body('cancelUrl')
    .optional()
    .isURL()
    .withMessage('Cancel URL must be a valid URL'),
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (field = 'id') => [
  param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId`),
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'name', '-name'])
    .withMessage('Sort must be one of: createdAt, -createdAt, updatedAt, -updatedAt, name, -name'),
];

/**
 * Email validation
 */
const validateEmail = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

/**
 * Resume data validation
 */
const validateResumeData = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Resume title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Resume title must be between 1 and 100 characters'),

  body('templateId')
    .notEmpty()
    .withMessage('Template ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Template ID must be valid'),

  body('data')
    .notEmpty()
    .withMessage('Resume data is required')
    .isObject()
    .withMessage('Resume data must be an object'),

  body('data.personalInfo')
    .optional()
    .isObject()
    .withMessage('Personal info must be an object'),

  body('data.personalInfo.firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),

  body('data.personalInfo.lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),

  body('data.personalInfo.email')
    .optional()
    .isEmail()
    .withMessage('Email must be valid'),
];

/**
 * Search validation
 */
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  query('category')
    .optional()
    .isIn(['resume', 'template', 'user'])
    .withMessage('Category must be one of: resume, template, user'),
];

/**
 * File upload validation
 */
const validateFileUpload = [
  body('fileType')
    .optional()
    .isIn(['image', 'pdf', 'docx'])
    .withMessage('File type must be one of: image, pdf, docx'),

  body('fileName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('File name must be between 1 and 255 characters'),
];

/**
 * Webhook validation
 */
const validateWebhook = [
  body('alert_name')
    .notEmpty()
    .withMessage('Alert name is required'),

  body('alert_id')
    .notEmpty()
    .withMessage('Alert ID is required'),
];

/**
 * Contact form validation
 */
const validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validateCheckout,
  validateObjectId,
  validatePagination,
  validateEmail,
  validateResumeData,
  validateSearch,
  validateFileUpload,
  validateWebhook,
  validateContactForm,
};
