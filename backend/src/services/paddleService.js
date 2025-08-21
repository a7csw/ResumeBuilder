/**
 * Paddle Service
 * Handles all Paddle payment operations and webhook processing
 */

const { Paddle, Environment } = require('@paddle/paddle-node-sdk');
const crypto = require('crypto');
const config = require('../config/config');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

class PaddleService {
  constructor() {
    // Initialize modern Paddle SDK
    this.paddle = new Paddle(config.paddle.apiKey, {
      environment: config.paddle.environment === 'production' ? Environment.production : Environment.sandbox,
    });
  }

  /**
   * Generate checkout URL for a plan
   * @param {string} planId - The plan ID (basic or pro)
   * @param {string} userId - The user ID
   * @param {Object} userInfo - User information
   * @returns {Promise<string>} - Checkout URL
   */
  async generateCheckoutUrl(planId, userId, userInfo = {}) {
    try {
      const plan = config.subscriptionPlans[planId];
      if (!plan) {
        throw new Error(`Invalid plan ID: ${planId}`);
      }

      const paddlePlanId = config.paddle.plans[planId];
      if (!paddlePlanId) {
        throw new Error(`Paddle plan ID not configured for: ${planId}`);
      }

      // Prepare line items for the modern SDK
      const lineItems = [{
        priceId: paddlePlanId,
        quantity: 1,
      }];

      // Prepare customer information
      const customerData = userInfo.email ? {
        email: userInfo.email,
      } : undefined;

      // Custom data to pass through
      const customData = {
        userId,
        planId,
        source: 'novacv_web',
        timestamp: Date.now(),
      };

      // Create transaction with modern SDK
      const transactionRequest = {
        items: lineItems,
        customData,
        returnUrl: `${config.frontend.successUrl}?plan=${planId}&userId=${userId}`,
        discardUrl: `${config.frontend.cancelUrl}?plan=${planId}`,
      };

      // Add customer if provided
      if (customerData) {
        transactionRequest.customer = customerData;
      }

      const transaction = await this.paddle.transactions.create(transactionRequest);
      
      if (transaction && transaction.checkoutUrl) {
        return transaction.checkoutUrl;
      } else {
        throw new Error('Failed to generate checkout URL from Paddle');
      }

    } catch (error) {
      console.error('Error generating Paddle checkout URL:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature using modern Paddle SDK
   * @param {string} rawBody - Raw webhook body as string
   * @param {string} signature - Paddle-Signature header
   * @returns {boolean} - Whether signature is valid
   */
  verifyWebhookSignature(rawBody, signature) {
    try {
      // Use the modern SDK's webhook signature verification
      const eventData = this.paddle.webhooks.unmarshal(rawBody, config.paddle.webhookSecret, signature);
      return !!eventData;
    } catch (error) {
      console.error('Invalid Paddle webhook signature:', error);
      return false;
    }
  }

  /**
   * Unmarshal webhook data using modern SDK
   * @param {string} rawBody - Raw webhook body as string
   * @param {string} signature - Paddle-Signature header
   * @returns {Object|null} - Parsed webhook data or null if invalid
   */
  unmarshalWebhook(rawBody, signature) {
    try {
      return this.paddle.webhooks.unmarshal(rawBody, config.paddle.webhookSecret, signature);
    } catch (error) {
      console.error('Error unmarshaling Paddle webhook:', error);
      return null;
    }
  }

  /**
   * Process webhook event with modern SDK
   * @param {Object} eventData - Webhook data from Paddle (already unmarshaled)
   * @returns {Promise<Object>} - Processing result
   */
  async processWebhook(eventData) {
    try {
      const eventType = eventData.eventType;
      
      console.log(`Processing Paddle webhook: ${eventType}`);

      switch (eventType) {
        case 'subscription.created':
          return await this.handleSubscriptionCreated(eventData);
        
        case 'subscription.updated':
          return await this.handleSubscriptionUpdated(eventData);
        
        case 'subscription.canceled':
          return await this.handleSubscriptionCancelled(eventData);
        
        case 'transaction.completed':
          return await this.handleTransactionCompleted(eventData);
        
        case 'transaction.payment_failed':
          return await this.handleTransactionPaymentFailed(eventData);
        
        case 'adjustment.created':
          return await this.handleAdjustmentCreated(eventData);
        
        default:
          console.log(`Unhandled webhook event: ${eventType}`);
          return { success: true, message: 'Event logged but not processed' };
      }
    } catch (error) {
      console.error('Error processing Paddle webhook:', error);
      throw error;
    }
  }

  /**
   * Handle subscription payment succeeded
   * @param {Object} data - Webhook data
   */
  async handleSubscriptionPaymentSucceeded(data) {
    try {
      const subscriptionId = data.subscription_id;
      const passthrough = JSON.parse(data.passthrough || '{}');
      
      // Find and update subscription
      const subscription = await Subscription.findByPaddleId(subscriptionId);
      if (subscription) {
        subscription.status = 'active';
        subscription.nextBillDate = new Date(data.next_bill_date);
        subscription.addEvent('payment_succeeded', data, data.alert_id);
        await subscription.save();

        // Update user subscription status
        const user = await User.findById(subscription.userId);
        if (user) {
          user.subscription.status = 'active';
          user.subscription.endDate = subscription.nextBillDate;
          await user.save();
        }
      }

      return { success: true, message: 'Payment processed successfully' };
    } catch (error) {
      console.error('Error handling subscription payment succeeded:', error);
      throw error;
    }
  }

  /**
   * Handle subscription created (modern SDK)
   * @param {Object} eventData - Webhook event data
   */
  async handleSubscriptionCreated(eventData) {
    try {
      const subscription = eventData.data;
      const customData = subscription.customData || {};
      const userId = customData.userId;
      const planId = customData.planId;

      if (!userId || !planId) {
        throw new Error('Missing userId or planId in custom data');
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      // Create subscription record
      const newSubscription = new Subscription({
        userId: user._id,
        paddleSubscriptionId: subscription.id,
        paddleCustomerId: subscription.customerId,
        paddlePlanId: subscription.items[0]?.price?.id || null,
        plan: planId,
        status: subscription.status,
        currency: subscription.currencyCode,
        unitPrice: subscription.items[0]?.price?.unitPrice?.amount || 0,
        nextBillAmount: subscription.nextBilledAt ? subscription.items[0]?.price?.unitPrice?.amount || 0 : 0,
        startDate: new Date(subscription.createdAt),
        nextBillDate: subscription.nextBilledAt ? new Date(subscription.nextBilledAt) : null,
        billingType: subscription.nextBilledAt ? 'recurring' : 'one_time',
        paddleData: subscription,
      });

      // For one-time payments (Basic plan), set end date
      if (planId === 'basic') {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + config.subscriptionPlans.basic.duration);
        newSubscription.endDate = endDate;
        newSubscription.billingType = 'one_time';
      }

      newSubscription.addEvent('subscription_created', subscription, eventData.eventId);
      await newSubscription.save();

      // Update user subscription
      user.subscription = {
        plan: planId,
        status: 'active',
        startDate: new Date(subscription.createdAt),
        endDate: newSubscription.endDate || newSubscription.nextBillDate,
        autoRenew: planId === 'pro',
        paddleSubscriptionId: subscription.id,
        paddleCustomerId: subscription.customerId,
      };

      // Reset usage limits for new subscription
      const planConfig = config.subscriptionPlans[planId];
      user.usage.aiGenerations.limit = planConfig.features.aiGenerations;
      user.usage.aiGenerations.used = 0;
      user.usage.aiGenerations.resetDate = new Date();

      await user.save();

      console.log(`✅ Subscription created for user ${userId} with plan ${planId}`);

      return { success: true, message: 'Subscription created successfully' };
    } catch (error) {
      console.error('Error handling subscription created:', error);
      throw error;
    }
  }

  /**
   * Handle subscription updated
   * @param {Object} data - Webhook data
   */
  async handleSubscriptionUpdated(data) {
    try {
      const subscription = await Subscription.findByPaddleId(data.subscription_id);
      if (!subscription) {
        console.error(`Subscription not found: ${data.subscription_id}`);
        return { success: false, message: 'Subscription not found' };
      }

      // Update subscription details
      subscription.status = data.status;
      subscription.nextBillDate = data.next_bill_date ? new Date(data.next_bill_date) : null;
      subscription.nextBillAmount = parseFloat(data.next_bill_date ? data.unit_price : 0);
      subscription.addEvent('subscription_updated', data, data.alert_id);
      await subscription.save();

      // Update user
      const user = await User.findById(subscription.userId);
      if (user) {
        user.subscription.status = data.status === 'active' ? 'active' : 'cancelled';
        user.subscription.endDate = subscription.nextBillDate;
        await user.save();
      }

      return { success: true, message: 'Subscription updated successfully' };
    } catch (error) {
      console.error('Error handling subscription updated:', error);
      throw error;
    }
  }

  /**
   * Handle subscription cancelled
   * @param {Object} data - Webhook data
   */
  async handleSubscriptionCancelled(data) {
    try {
      const subscription = await Subscription.findByPaddleId(data.subscription_id);
      if (!subscription) {
        console.error(`Subscription not found: ${data.subscription_id}`);
        return { success: false, message: 'Subscription not found' };
      }

      // Cancel subscription
      await subscription.cancel();
      subscription.addEvent('subscription_cancelled', data, data.alert_id);
      await subscription.save();

      // Update user
      const user = await User.findById(subscription.userId);
      if (user) {
        user.subscription.status = 'cancelled';
        user.subscription.autoRenew = false;
        await user.save();
      }

      console.log(`❌ Subscription cancelled: ${data.subscription_id}`);

      return { success: true, message: 'Subscription cancelled successfully' };
    } catch (error) {
      console.error('Error handling subscription cancelled:', error);
      throw error;
    }
  }

  /**
   * Handle subscription payment failed
   * @param {Object} data - Webhook data
   */
  async handleSubscriptionPaymentFailed(data) {
    try {
      const subscription = await Subscription.findByPaddleId(data.subscription_id);
      if (subscription) {
        subscription.status = 'past_due';
        subscription.addEvent('payment_failed', data, data.alert_id);
        await subscription.save();

        // Update user
        const user = await User.findById(subscription.userId);
        if (user) {
          user.subscription.status = 'past_due';
          await user.save();
        }
      }

      return { success: true, message: 'Payment failure processed' };
    } catch (error) {
      console.error('Error handling subscription payment failed:', error);
      throw error;
    }
  }

  /**
   * Handle transaction completed (modern SDK)
   * @param {Object} eventData - Webhook event data
   */
  async handleTransactionCompleted(eventData) {
    try {
      const transaction = eventData.data;
      const customData = transaction.customData || {};
      const userId = customData.userId;
      const planId = customData.planId;

      console.log(`💰 Transaction completed for user ${userId}, plan ${planId}`);

      // For one-time purchases, update user plan directly
      if (planId === 'basic' && userId) {
        const user = await User.findById(userId);
        if (user) {
          // Create a one-time subscription record
          const subscription = new Subscription({
            userId: user._id,
            paddleSubscriptionId: null, // No subscription for one-time
            paddleCustomerId: transaction.customerId,
            paddleCheckoutId: transaction.id,
            plan: planId,
            status: 'active',
            currency: transaction.currencyCode,
            unitPrice: transaction.details.totals.total,
            billingType: 'one_time',
            startDate: new Date(transaction.createdAt),
            endDate: new Date(Date.now() + (config.subscriptionPlans.basic.duration * 24 * 60 * 60 * 1000)),
            paddleData: transaction,
          });

          subscription.addEvent('transaction_completed', transaction, eventData.eventId);
          await subscription.save();

          // Update user subscription
          user.subscription = {
            plan: planId,
            status: 'active',
            startDate: new Date(transaction.createdAt),
            endDate: subscription.endDate,
            autoRenew: false,
            paddleCustomerId: transaction.customerId,
          };

          const planConfig = config.subscriptionPlans[planId];
          user.usage.aiGenerations.limit = planConfig.features.aiGenerations;
          user.usage.aiGenerations.used = 0;
          user.usage.aiGenerations.resetDate = new Date();

          await user.save();
        }
      }

      return { success: true, message: 'Transaction completed successfully' };
    } catch (error) {
      console.error('Error handling transaction completed:', error);
      throw error;
    }
  }

  /**
   * Handle transaction payment failed (modern SDK)
   * @param {Object} eventData - Webhook event data
   */
  async handleTransactionPaymentFailed(eventData) {
    try {
      const transaction = eventData.data;
      const customData = transaction.customData || {};
      const userId = customData.userId;

      console.log(`❌ Transaction payment failed for user ${userId}`);

      return { success: true, message: 'Payment failure processed' };
    } catch (error) {
      console.error('Error handling transaction payment failed:', error);
      throw error;
    }
  }

  /**
   * Handle adjustment created (refunds, etc.)
   * @param {Object} eventData - Webhook event data
   */
  async handleAdjustmentCreated(eventData) {
    try {
      const adjustment = eventData.data;
      
      console.log(`🔄 Adjustment created: ${adjustment.action}`);

      // Handle refunds
      if (adjustment.action === 'refund') {
        // Find the related transaction or subscription
        // Implementation depends on your specific refund handling needs
      }

      return { success: true, message: 'Adjustment processed successfully' };
    } catch (error) {
      console.error('Error handling adjustment created:', error);
      throw error;
    }
  }

  /**
   * Handle payment refunded
   * @param {Object} data - Webhook data
   */
  async handlePaymentRefunded(data) {
    try {
      const passthrough = JSON.parse(data.passthrough || '{}');
      const userId = passthrough.userId;

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          // Downgrade user to free plan
          user.subscription = {
            plan: 'free',
            status: 'active',
            startDate: new Date(),
            endDate: null,
            autoRenew: false,
            paddleSubscriptionId: null,
            paddleCustomerId: null,
            paddleCheckoutId: null,
          };

          // Reset usage
          user.usage.aiGenerations.limit = 0;
          user.usage.aiGenerations.used = 0;

          await user.save();
        }

        // Update subscription if exists
        const subscription = await Subscription.findOne({ userId });
        if (subscription) {
          subscription.status = 'cancelled';
          subscription.addEvent('payment_refunded', data, data.alert_id);
          await subscription.save();
        }
      }

      console.log(`🔄 Payment refunded for user ${userId}`);

      return { success: true, message: 'Refund processed successfully' };
    } catch (error) {
      console.error('Error handling payment refunded:', error);
      throw error;
    }
  }

  /**
   * Get subscription details from Paddle
   * @param {string} subscriptionId - Paddle subscription ID
   * @returns {Promise<Object>} - Subscription details
   */
  async getSubscriptionDetails(subscriptionId) {
    try {
      const response = await this.paddle.getSubscriptionDetails(subscriptionId);
      return response.success ? response.response : null;
    } catch (error) {
      console.error('Error getting subscription details:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Paddle subscription ID
   * @returns {Promise<boolean>} - Success status
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await this.paddle.cancelSubscription(subscriptionId);
      return response.success;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
}

module.exports = new PaddleService();
