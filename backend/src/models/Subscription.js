/**
 * Subscription Model
 * Tracks Paddle subscription details and lifecycle events
 */

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Paddle Information
  paddleSubscriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  paddleCustomerId: {
    type: String,
    required: true,
    index: true,
  },
  paddleCheckoutId: {
    type: String,
    required: false,
  },
  paddlePlanId: {
    type: String,
    required: true,
  },

  // Subscription Details
  plan: {
    type: String,
    enum: ['basic', 'pro'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'trialing', 'past_due', 'cancelled', 'deleted'],
    required: true,
    default: 'active',
  },
  
  // Pricing Information
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  nextBillAmount: {
    type: Number,
    default: 0,
  },

  // Dates
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  nextBillDate: {
    type: Date,
    required: false,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  trialEndDate: {
    type: Date,
    default: null,
  },

  // Billing Information
  billingType: {
    type: String,
    enum: ['recurring', 'one_time'],
    default: 'recurring',
  },
  quantity: {
    type: Number,
    default: 1,
  },

  // Payment Information
  paymentInformation: {
    paymentMethod: String,
    cardType: String,
    lastFour: String,
    expiryMonth: Number,
    expiryYear: Number,
  },

  // Subscription Events Log
  events: [{
    eventType: {
      type: String,
      required: true,
    },
    eventData: {
      type: mongoose.Schema.Types.Mixed,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
    paddleEventId: String,
  }],

  // Paddle Raw Data (for debugging)
  paddleData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Metadata
  metadata: {
    source: String,
    campaign: String,
    userAgent: String,
    ipAddress: String,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ paddleSubscriptionId: 1 });
subscriptionSchema.index({ paddleCustomerId: 1 });
subscriptionSchema.index({ status: 1, nextBillDate: 1 });
subscriptionSchema.index({ createdAt: -1 });

// Virtual for subscription age in days
subscriptionSchema.virtual('subscriptionAge').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const diffTime = now - start;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days until next bill
subscriptionSchema.virtual('daysUntilNextBill').get(function() {
  if (!this.nextBillDate) return null;
  const now = new Date();
  const nextBill = new Date(this.nextBillDate);
  const diffTime = nextBill - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days remaining (for one-time subscriptions)
subscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});

// Instance method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  if (this.status !== 'active') return false;
  
  // For one-time subscriptions, check if not expired
  if (this.billingType === 'one_time' && this.endDate) {
    return new Date() < new Date(this.endDate);
  }
  
  // For recurring subscriptions, check if not past due
  return this.status === 'active';
};

// Instance method to add event to subscription
subscriptionSchema.methods.addEvent = function(eventType, eventData, paddleEventId = null) {
  this.events.push({
    eventType,
    eventData,
    paddleEventId,
    processedAt: new Date(),
  });
};

// Instance method to cancel subscription
subscriptionSchema.methods.cancel = async function() {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  await this.save();
};

// Static method to find active subscriptions
subscriptionSchema.statics.findActiveSubscriptions = function() {
  return this.find({
    status: 'active',
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gt: new Date() } },
    ],
  });
};

// Static method to find subscriptions expiring soon
subscriptionSchema.statics.findExpiringSubscriptions = function(days = 3) {
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + days);
  
  return this.find({
    status: 'active',
    billingType: 'one_time',
    endDate: {
      $gte: new Date(),
      $lte: expireDate,
    },
  }).populate('userId', 'firstName lastName email');
};

// Static method to find by Paddle subscription ID
subscriptionSchema.statics.findByPaddleId = function(paddleSubscriptionId) {
  return this.findOne({ paddleSubscriptionId });
};

// Static method to get subscription stats
subscriptionSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$unitPrice' },
      },
    },
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      revenue: stat.totalRevenue,
    };
    return acc;
  }, {});
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
