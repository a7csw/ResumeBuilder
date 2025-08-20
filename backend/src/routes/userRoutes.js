/**
 * User Routes
 * Defines all user-related API endpoints
 */

const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController');

// Middleware
const { authenticate } = require('../middlewares/auth');
const { handleValidationErrors } = require('../middlewares/errorHandler');
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validateEmail,
} = require('../middlewares/validation');
const {
  authRateLimit,
  passwordResetRateLimit,
} = require('../middlewares/security');

/**
 * @route   POST /api/v1/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register',
  authRateLimit,
  validateUserRegistration,
  handleValidationErrors,
  userController.register
);

/**
 * @route   POST /api/v1/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  authRateLimit,
  validateUserLogin,
  handleValidationErrors,
  userController.login
);

/**
 * @route   POST /api/v1/users/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token',
  authRateLimit,
  userController.refreshToken
);

/**
 * @route   POST /api/v1/users/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  authenticate,
  userController.logout
);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile',
  authenticate,
  userController.getProfile
);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  authenticate,
  validateUserUpdate,
  handleValidationErrors,
  userController.updateProfile
);

/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password',
  authRateLimit,
  authenticate,
  validatePasswordChange,
  handleValidationErrors,
  userController.changePassword
);

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account',
  authRateLimit,
  authenticate,
  userController.deleteAccount
);

/**
 * @route   GET /api/v1/users/dashboard
 * @desc    Get user dashboard data
 * @access  Private
 */
router.get('/dashboard',
  authenticate,
  userController.getDashboard
);

/**
 * @route   POST /api/v1/users/usage
 * @desc    Update user usage statistics
 * @access  Private
 */
router.post('/usage',
  authenticate,
  userController.updateUsage
);

/**
 * @route   POST /api/v1/users/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password',
  passwordResetRateLimit,
  validateEmail,
  handleValidationErrors,
  userController.forgotPassword
);

/**
 * @route   POST /api/v1/users/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password',
  passwordResetRateLimit,
  userController.resetPassword
);

module.exports = router;
