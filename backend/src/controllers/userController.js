/**
 * User Controller
 * Handles user-related operations including authentication and profile management
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync, APIError } = require('../middlewares/errorHandler');
const config = require('../config/config');

/**
 * Register a new user
 * @route POST /api/v1/users/register
 * @access Public
 */
const register = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new APIError('User already exists with this email', 409);
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    metadata: {
      registrationIP: req.ip,
      userAgent: req.get('User-Agent'),
      referralSource: req.query.ref,
    },
  });

  // Save user (password will be hashed by pre-save middleware)
  await user.save();

  // Generate tokens
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  
  // Save refresh token
  await user.save();

  // Remove password from response
  user.password = undefined;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        subscription: user.subscription,
        isEmailVerified: user.isEmailVerified,
      },
      tokens: {
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: config.jwt.expiresIn,
      },
    },
  });
});

/**
 * Login user
 * @route POST /api/v1/users/login
 * @access Public
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findByEmail(email).select('+password');
  
  if (!user) {
    throw new APIError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new APIError('Account is deactivated. Please contact support.', 401);
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new APIError('Invalid email or password', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  user.metadata.lastLoginIP = req.ip;
  
  // Generate tokens
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  
  await user.save();

  // Remove password from response
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        subscription: user.subscription,
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified,
      },
      tokens: {
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: config.jwt.expiresIn,
      },
    },
  });
});

/**
 * Refresh access token
 * @route POST /api/v1/users/refresh-token
 * @access Public
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new APIError('Refresh token is required', 400);
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, config.jwt.secret);
  
  if (decoded.type !== 'refresh') {
    throw new APIError('Invalid refresh token', 401);
  }

  // Find user and check if refresh token exists
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
  if (!tokenExists) {
    throw new APIError('Invalid refresh token', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new APIError('Account is deactivated', 401);
  }

  // Generate new tokens
  const newAccessToken = user.generateAuthToken();
  const newRefreshToken = user.generateRefreshToken();

  // Remove old refresh token
  user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
  
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: config.jwt.expiresIn,
      },
    },
  });
});

/**
 * Logout user
 * @route POST /api/v1/users/logout
 * @access Private
 */
const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const user = req.user;

  if (refreshToken) {
    // Remove specific refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
  } else {
    // Remove all refresh tokens (logout from all devices)
    user.refreshTokens = [];
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * Get current user profile
 * @route GET /api/v1/users/profile
 * @access Private
 */
const getProfile = catchAsync(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        subscription: user.subscription,
        usage: user.usage,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

/**
 * Update user profile
 * @route PUT /api/v1/users/profile
 * @access Private
 */
const updateProfile = catchAsync(async (req, res) => {
  const { firstName, lastName, phone, avatar } = req.body;
  const user = req.user;

  // Update allowed fields
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        updatedAt: user.updatedAt,
      },
    },
  });
});

/**
 * Change user password
 * @route PUT /api/v1/users/change-password
 * @access Private
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.userId).select('+password');

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new APIError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  
  // Clear all refresh tokens (logout from all devices)
  user.refreshTokens = [];
  
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please login again.',
  });
});

/**
 * Delete user account
 * @route DELETE /api/v1/users/account
 * @access Private
 */
const deleteAccount = catchAsync(async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.userId).select('+password');

  // Verify password before deletion
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new APIError('Password is incorrect', 400);
  }

  // Soft delete by deactivating account
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  user.refreshTokens = [];
  
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});

/**
 * Get user dashboard data
 * @route GET /api/v1/users/dashboard
 * @access Private
 */
const getDashboard = catchAsync(async (req, res) => {
  const user = req.user;

  // Calculate subscription days remaining
  const daysRemaining = user.subscriptionDaysRemaining;
  
  // Get AI generations remaining
  const aiGenerationsRemaining = user.getRemainingAIGenerations();

  // Prepare dashboard data
  const dashboardData = {
    user: {
      name: user.fullName,
      email: user.email,
      avatar: user.avatar,
      memberSince: user.createdAt,
    },
    subscription: {
      plan: user.subscription.plan,
      status: user.subscription.status,
      daysRemaining: daysRemaining,
      autoRenew: user.subscription.autoRenew,
      endDate: user.subscription.endDate,
    },
    usage: {
      aiGenerations: {
        used: user.usage.aiGenerations.used,
        limit: user.usage.aiGenerations.limit,
        remaining: aiGenerationsRemaining,
      },
      templatesUsed: user.usage.templatesUsed.length,
      exportsThisMonth: user.usage.exportsThisMonth,
    },
    features: {},
  };

  // Add feature access information
  const planConfig = config.subscriptionPlans[user.subscription.plan];
  if (planConfig) {
    for (const [feature, value] of Object.entries(planConfig.features)) {
      dashboardData.features[feature] = user.hasFeatureAccess(feature);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: dashboardData,
  });
});

/**
 * Update user usage (internal use)
 * @route POST /api/v1/users/usage
 * @access Private
 */
const updateUsage = catchAsync(async (req, res) => {
  const { type, amount = 1 } = req.body;
  const user = req.user;

  await user.incrementUsage(type, amount);

  res.status(200).json({
    success: true,
    message: 'Usage updated successfully',
    data: {
      usage: user.usage,
      remaining: {
        aiGenerations: user.getRemainingAIGenerations(),
      },
    },
  });
});

/**
 * Request password reset
 * @route POST /api/v1/users/forgot-password
 * @access Public
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  }

  // Generate reset token (implement this based on your needs)
  const resetToken = jwt.sign(
    { userId: user._id, type: 'password_reset' },
    config.jwt.secret,
    { expiresIn: '1h' }
  );

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  // Here you would send an email with the reset link
  // For now, we'll just return the token (remove in production)
  
  res.status(200).json({
    success: true,
    message: 'Password reset email sent successfully',
    // Remove this in production
    resetToken: resetToken,
  });
});

/**
 * Reset password
 * @route POST /api/v1/users/reset-password
 * @access Public
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  // Verify reset token
  const decoded = jwt.verify(token, config.jwt.secret);
  
  if (decoded.type !== 'password_reset') {
    throw new APIError('Invalid reset token', 400);
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.passwordResetToken !== token) {
    throw new APIError('Invalid or expired reset token', 400);
  }

  // Check if token has expired
  if (user.passwordResetExpires < new Date()) {
    throw new APIError('Reset token has expired', 400);
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.refreshTokens = []; // Logout from all devices
  
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please login with your new password.',
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getDashboard,
  updateUsage,
  forgotPassword,
  resetPassword,
};
