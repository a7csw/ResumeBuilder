/**
 * User Model
 * Defines the user schema and related methods
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't include password in queries by default
  },

  // Profile Information
  avatar: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    trim: true,
  },
  
  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },

  // Subscription Information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'past_due'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    // Paddle specific fields
    paddleSubscriptionId: {
      type: String,
      default: null,
    },
    paddleCustomerId: {
      type: String,
      default: null,
    },
    paddleCheckoutId: {
      type: String,
      default: null,
    },
  },

  // Usage Tracking
  usage: {
    aiGenerations: {
      used: { type: Number, default: 0 },
      limit: { type: Number, default: 0 },
      resetDate: { type: Date, default: null },
    },
    templatesUsed: [{
      templateId: String,
      usedAt: { type: Date, default: Date.now },
    }],
    exportsThisMonth: {
      pdf: { type: Number, default: 0 },
      docx: { type: Number, default: 0 },
    },
  },

  // Security
  emailVerificationToken: {
    type: String,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
  }],

  // Metadata
  metadata: {
    registrationIP: String,
    lastLoginIP: String,
    userAgent: String,
    referralSource: String,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance (email is already unique, others need manual indexing)
userSchema.index({ createdAt: -1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ lastLogin: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for subscription remaining days
userSchema.virtual('subscriptionDaysRemaining').get(function() {
  if (!this.subscription.endDate) return 0;
  const now = new Date();
  const endDate = new Date(this.subscription.endDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(config.security.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    email: this.email,
    plan: this.subscription.plan,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function() {
  const payload = {
    id: this._id,
    type: 'refresh',
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  // Add to user's refresh tokens
  this.refreshTokens.push({
    token,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return token;
};

// Instance method to check if user has access to feature
userSchema.methods.hasFeatureAccess = function(feature) {
  const plan = config.subscriptionPlans[this.subscription.plan];
  if (!plan) return false;

  // Check if subscription is active and not expired
  if (this.subscription.status !== 'active' || 
      (this.subscription.endDate && new Date() > this.subscription.endDate)) {
    return false;
  }

  return plan.features[feature] !== undefined ? plan.features[feature] : false;
};

// Instance method to check remaining AI generations
userSchema.methods.getRemainingAIGenerations = function() {
  const plan = config.subscriptionPlans[this.subscription.plan];
  if (!plan) return 0;

  const limit = plan.features.aiGenerations;
  if (limit === -1) return -1; // unlimited

  return Math.max(0, limit - this.usage.aiGenerations.used);
};

// Instance method to update usage
userSchema.methods.incrementUsage = async function(type, amount = 1) {
  switch (type) {
    case 'aiGeneration':
      this.usage.aiGenerations.used += amount;
      break;
    case 'pdfExport':
      this.usage.exportsThisMonth.pdf += amount;
      break;
    case 'docxExport':
      this.usage.exportsThisMonth.docx += amount;
      break;
  }
  
  await this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find users with expiring subscriptions
userSchema.statics.findExpiringSubscriptions = function(days = 3) {
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + days);
  
  return this.find({
    'subscription.status': 'active',
    'subscription.endDate': { $lte: expireDate, $gte: new Date() },
  });
};

module.exports = mongoose.model('User', userSchema);
