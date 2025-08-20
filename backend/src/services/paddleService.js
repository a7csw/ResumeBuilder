/**
 * Paddle Service
 * Handles all Paddle payment operations and webhook processing
 */

const PaddleSDK = require('paddle-sdk');
const crypto = require('crypto');
const config = require('../config/config');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

class PaddleService {
  constructor() {
    // Initialize Paddle SDK
    this.paddle = new PaddleSDK(config.paddle.vendorId, config.paddle.apiKey, {
      environment: config.paddle.environment, // 'sandbox' or 'production'
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

      const checkoutData = {
        product_id: paddlePlanId,
        quantity: 1,
        customer_email: userInfo.email,
        customer_country: userInfo.country || 'US',
        
        // Pass user information in passthrough
        passthrough: JSON.stringify({
          userId,
          planId,
          source: 'novacv_web',
          timestamp: Date.now(),
        }),

        // Success and cancel URLs
        success_url: `${config.frontend.successUrl}?plan=${planId}&userId=${userId}`,
        cancel_url: `${config.frontend.cancelUrl}?plan=${planId}`,

        // Additional settings
        display_mode: 'overlay',
        theme: 'light',
        locale: 'en',
        
        // Marketing consent
        marketing_consent: false,
      };

      // For one-time payments (Basic plan)
      if (planId === 'basic') {
        checkoutData.recurring = false;
      }

      const response = await this.paddle.generatePayLink(checkoutData);
      
      if (response.success) {
        return response.response.url;
      } else {
        throw new Error(`Paddle checkout generation failed: ${response.error.message}`);
      }

    } catch (error) {
      console.error('Error generating Paddle checkout URL:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   * @param {Object} body - Webhook body
   * @param {string} signature - Paddle signature
   * @returns {boolean} - Whether signature is valid
   */
  verifyWebhookSignature(body, signature) {
    try {
      const publicKey = config.paddle.publicKey;
      
      // Serialize the fields
      const sortedKeys = Object.keys(body).sort();
      const serializedFields = sortedKeys
        .filter(key => key !== 'p_signature')
        .map(key => `${key}=${body[key]}`)
        .join('&');

      // Verify signature
      const verifier = crypto.createVerify('RSA-SHA1');
      verifier.update(serializedFields);
      verifier.end();

      const isValid = verifier.verify(publicKey, signature, 'base64');
      
      if (!isValid) {
        console.error('Invalid Paddle webhook signature');
      }
      
      return isValid;
    } catch (error) {
      console.error('Error verifying Paddle webhook signature:', error);
      return false;
    }
  }

  /**
   * Process webhook event
   * @param {Object} webhookData - Webhook data from Paddle
   * @returns {Promise<Object>} - Processing result
   */
  async processWebhook(webhookData) {
    try {
      const alertName = webhookData.alert_name;
      
      console.log(`Processing Paddle webhook: ${alertName}`);

      switch (alertName) {
        case 'subscription_payment_succeeded':
          return await this.handleSubscriptionPaymentSucceeded(webhookData);
        
        case 'subscription_created':
          return await this.handleSubscriptionCreated(webhookData);
        
        case 'subscription_updated':
          return await this.handleSubscriptionUpdated(webhookData);
        
        case 'subscription_cancelled':
          return await this.handleSubscriptionCancelled(webhookData);
        
        case 'subscription_payment_failed':
          return await this.handleSubscriptionPaymentFailed(webhookData);
        
        case 'payment_succeeded':
          return await this.handlePaymentSucceeded(webhookData);
        
        case 'payment_refunded':
          return await this.handlePaymentRefunded(webhookData);
        
        default:
          console.log(`Unhandled webhook event: ${alertName}`);
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
   * Handle subscription created
   * @param {Object} data - Webhook data
   */
  async handleSubscriptionCreated(data) {
    try {
      const passthrough = JSON.parse(data.passthrough || '{}');
      const userId = passthrough.userId;
      const planId = passthrough.planId;

      if (!userId || !planId) {
        throw new Error('Missing userId or planId in passthrough data');
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      // Create subscription record
      const subscription = new Subscription({
        userId: user._id,
        paddleSubscriptionId: data.subscription_id,
        paddleCustomerId: data.user_id,
        paddleCheckoutId: data.checkout_id,
        paddlePlanId: data.subscription_plan_id,
        plan: planId,
        status: data.status,
        currency: data.currency,
        unitPrice: parseFloat(data.unit_price),
        nextBillAmount: parseFloat(data.next_bill_date ? data.unit_price : 0),
        startDate: new Date(),
        nextBillDate: data.next_bill_date ? new Date(data.next_bill_date) : null,
        billingType: data.next_bill_date ? 'recurring' : 'one_time',
        paddleData: data,
      });

      // For one-time payments (Basic plan), set end date
      if (planId === 'basic') {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + config.subscriptionPlans.basic.duration);
        subscription.endDate = endDate;
        subscription.billingType = 'one_time';
      }

      subscription.addEvent('subscription_created', data, data.alert_id);
      await subscription.save();

      // Update user subscription
      user.subscription = {
        plan: planId,
        status: 'active',
        startDate: new Date(),
        endDate: subscription.endDate || subscription.nextBillDate,
        autoRenew: planId === 'pro',
        paddleSubscriptionId: data.subscription_id,
        paddleCustomerId: data.user_id,
        paddleCheckoutId: data.checkout_id,
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
   * Handle one-time payment succeeded
   * @param {Object} data - Webhook data
   */
  async handlePaymentSucceeded(data) {
    try {
      const passthrough = JSON.parse(data.passthrough || '{}');
      const userId = passthrough.userId;
      const planId = passthrough.planId;

      // This is handled in subscription_created for recurring payments
      // For one-time payments, the subscription should already be created
      
      console.log(`💰 Payment succeeded for user ${userId}, plan ${planId}`);

      return { success: true, message: 'Payment processed successfully' };
    } catch (error) {
      console.error('Error handling payment succeeded:', error);
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
