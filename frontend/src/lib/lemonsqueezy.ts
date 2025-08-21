import { env } from './env';

export interface LemonSqueezyProduct {
  id: string;
  name: string;
  price: number;
  variantId: string;
  description: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

export const LEMON_SQUEEZY_PRODUCTS: Record<string, LemonSqueezyProduct> = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 5.00,
    variantId: env.LEMON_PRODUCT_BASIC,
    description: 'Perfect for quick projects',
    duration: '10 days',
    features: [
      '1 AI-generated resume',
      '3 professional templates',
      'PDF download',
      'Basic customization',
      'Email support',
      'NovaCV watermark'
    ],
    popular: false
  },
  pro: {
    id: 'pro',
    name: 'Professional Plan',
    price: 11.00,
    variantId: env.LEMON_PRODUCT_PRO,
    description: 'For serious professionals',
    duration: 'month',
    features: [
      'Unlimited AI-generated resumes',
      '20+ premium templates',
      'Advanced AI optimization',
      'Multiple format exports (PDF, DOCX)',
      'No watermarks',
      'Priority support',
      'ATS optimization',
      'Resume analytics',
      'Custom styling options',
      'Unlimited revisions'
    ],
    popular: true
  }
};

export interface CheckoutUrlOptions {
  variantId: string;
  customData?: Record<string, any>;
  checkoutData?: {
    email?: string;
    name?: string;
    billing_address?: Record<string, string>;
  };
}

export function generateLemonSqueezyCheckoutUrl(options: CheckoutUrlOptions): string {
  const baseUrl = 'https://novacv.lemonsqueezy.com/checkout/buy';
  const url = new URL(`${baseUrl}/${options.variantId}`);
  
  // Add custom data for tracking
  if (options.customData) {
    url.searchParams.set('custom', JSON.stringify(options.customData));
  }
  
  // Add checkout data
  if (options.checkoutData) {
    if (options.checkoutData.email) {
      url.searchParams.set('checkout[email]', options.checkoutData.email);
    }
    if (options.checkoutData.name) {
      url.searchParams.set('checkout[name]', options.checkoutData.name);
    }
  }
  
  // Add store configuration
  url.searchParams.set('media', '0'); // Disable media
  url.searchParams.set('logo', '0'); // Disable logo
  url.searchParams.set('desc', '0'); // Disable description
  url.searchParams.set('discount', '1'); // Enable discount codes
  url.searchParams.set('enabled', '67163'); // Enable specific payment methods
  
  return url.toString();
}

export function getLemonSqueezyProduct(planId: string): LemonSqueezyProduct | null {
  return LEMON_SQUEEZY_PRODUCTS[planId] || null;
}

export function validateLemonSqueezyConfig(): boolean {
  const requiredIds = Object.values(LEMON_SQUEEZY_PRODUCTS).map(p => p.variantId);
  const missingIds = requiredIds.filter(id => !id || id.includes('variant-id'));
  
  if (missingIds.length > 0) {
    console.warn('Missing Lemon Squeezy variant IDs:', missingIds);
    return false;
  }
  
  return true;
}

// Initialize checkout for a specific plan
export async function initiateLemonSqueezyCheckout(
  planId: string,
  userEmail?: string,
  userName?: string,
  userId?: string
): Promise<void> {
  const product = getLemonSqueezyProduct(planId);
  if (!product) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }
  
  const checkoutUrl = generateLemonSqueezyCheckoutUrl({
    variantId: product.variantId,
    customData: {
      plan_id: planId,
      user_id: userId,
      source: 'novacv_web'
    },
    checkoutData: {
      email: userEmail,
      name: userName
    }
  });
  
  // Open checkout in the same window
  window.location.href = checkoutUrl;
}

// Webhook event types
export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: Record<string, any>;
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      variant_id: number;
      variant_name: string;
      product_id: number;
      product_name: string;
      customer_id: number;
      order_id: number;
      identifier: string;
      order_number: number;
      user_name: string;
      user_email: string;
      status: string;
      status_formatted: string;
      refunded: boolean;
      refunded_at: string | null;
      subtotal: number;
      discount_total: number;
      tax: number;
      total: number;
      subtotal_usd: number;
      discount_total_usd: number;
      tax_usd: number;
      total_usd: number;
      tax_name: string | null;
      tax_rate: string;
      currency: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export const LEMON_SQUEEZY_EVENTS = {
  ORDER_CREATED: 'order_created',
  ORDER_REFUNDED: 'order_refunded',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_UPDATED: 'subscription_updated',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_RESUMED: 'subscription_resumed',
  SUBSCRIPTION_EXPIRED: 'subscription_expired',
  SUBSCRIPTION_PAUSED: 'subscription_paused',
  SUBSCRIPTION_UNPAUSED: 'subscription_unpaused'
} as const;