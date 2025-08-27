/**
 * User Controller - Simplified for Supabase
 * Since this app uses Supabase Edge Functions for user operations,
 * these endpoints provide basic responses and redirect to proper Supabase functions
 */

const { catchAsync, APIError } = require('../middlewares/errorHandler');
const { getSupabaseClient } = require('../config/supabase');

/**
 * Register a new user
 * @route POST /api/v1/users/register
 * @access Public
 */
const register = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User registration handled by Supabase Auth',
    note: 'Use Supabase client.auth.signUp() from frontend',
    documentation: 'https://supabase.com/docs/guides/auth/auth-signup'
  });
});

/**
 * Login user
 * @route POST /api/v1/users/login
 * @access Public
 */
const login = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User login handled by Supabase Auth',
    note: 'Use Supabase client.auth.signInWithPassword() from frontend',
    documentation: 'https://supabase.com/docs/guides/auth/auth-signin'
  });
});

/**
 * Refresh access token
 * @route POST /api/v1/users/refresh-token
 * @access Public
 */
const refreshToken = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token refresh handled by Supabase Auth automatically',
    note: 'Supabase handles token refresh automatically in the client'
  });
});

/**
 * Logout user
 * @route POST /api/v1/users/logout
 * @access Private
 */
const logout = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logout handled by Supabase Auth',
    note: 'Use Supabase client.auth.signOut() from frontend'
  });
});

/**
 * Get current user profile
 * @route GET /api/v1/users/profile
 * @access Private
 */
const getProfile = catchAsync(async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    // Handle case where Supabase is not configured in development
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Profile management handled by Supabase',
        note: 'Use Supabase client and Edge Functions from frontend',
        supabaseConnected: false,
        development: true
      });
    }
    
    // Basic example of fetching profile data
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      throw new APIError('Error fetching profile', 500);
    }

    res.status(200).json({
      success: true,
      message: 'Use Supabase Edge Functions for complete profile management',
      note: 'This endpoint shows basic Supabase connectivity',
      supabaseConnected: true,
      profileTableAccess: profiles ? true : false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profile management handled by Supabase',
      note: 'Use Supabase client and Edge Functions from frontend',
      error: error.message
    });
  }
});

/**
 * Update user profile
 * @route PUT /api/v1/users/profile
 * @access Private
 */
const updateProfile = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile updates handled by Supabase',
    note: 'Use Supabase client.from("profiles").update() from frontend or Edge Functions'
  });
});

/**
 * Change user password
 * @route PUT /api/v1/users/change-password
 * @access Private
 */
const changePassword = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password changes handled by Supabase Auth',
    note: 'Use Supabase client.auth.updateUser() from frontend'
  });
});

/**
 * Delete user account
 * @route DELETE /api/v1/users/account
 * @access Private
 */
const deleteAccount = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Account deletion handled by Supabase',
    note: 'Use Supabase admin API or Edge Functions for account deletion'
  });
});

/**
 * Get user dashboard data
 * @route GET /api/v1/users/dashboard
 * @access Private
 */
const getDashboard = catchAsync(async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    // Handle case where Supabase is not configured in development
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Dashboard data handled by Supabase Edge Functions',
        note: 'Use your existing Edge Functions for dashboard data',
        supabaseConnected: false,
        development: true
      });
    }
    
    // Example: fetch user plans data
    const { data: userPlans, error } = await supabase
      .from('user_plans')
      .select('plan_type, is_active, expires_at')
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard data available via Supabase',
      note: 'Use Supabase Edge Functions for complete dashboard',
      sample_data: {
        supabaseConnected: true,
        userPlansTableAccess: userPlans ? true : false,
        availableTables: ['profiles', 'user_plans', 'resumes', 'billing_events']
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Dashboard data handled by Supabase Edge Functions',
      note: 'Use your existing Edge Functions for dashboard data'
    });
  }
});

/**
 * Update user usage
 * @route POST /api/v1/users/usage
 * @access Private
 */
const updateUsage = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Usage tracking handled by Supabase Edge Functions',
    note: 'Use your existing Edge Functions for usage tracking'
  });
});

/**
 * Request password reset
 * @route POST /api/v1/users/forgot-password
 * @access Public
 */
const forgotPassword = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password reset handled by Supabase Auth',
    note: 'Use Supabase client.auth.resetPasswordForEmail() from frontend'
  });
});

/**
 * Reset password
 * @route POST /api/v1/users/reset-password
 * @access Public
 */
const resetPassword = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password reset handled by Supabase Auth',
    note: 'Use Supabase client.auth.updateUser() after reset link verification'
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