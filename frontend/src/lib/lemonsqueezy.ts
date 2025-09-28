import { lemonSqueezySetup, createCheckout, getProduct, getStore, getVariant } from '@lemonsqueezy/lemonsqueezy.js';

// Environment variables
const STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID;
const TEST_MODE = import.meta.env.VITE_LEMONSQUEEZY_TEST_MODE === 'true';
const CHECKOUT_URL = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL;

// Product configuration
export interface LemonProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  interval?: 'month' | 'year' | null;
  variantId: string;
  features: string[];
  isPopular?: boolean;
}

// Pre-configured products (you'll get these IDs from LemonSqueezy dashboard)
export const PRODUCTS: Record<string, LemonProduct> = {
  single: {
    id: 'single_resume',
    name: 'Single Resume',
    description: 'One-time professional resume generation',
    price: 2,
    interval: null,
    variantId: '', // You'll fill this from LemonSqueezy dashboard
    features: [
      'AI-generated professional resume',
      'ATS-optimized format',
      'PDF & Word download',
      'One-time access'
    ]
  },
  basic: {
    id: 'basic_plan',
    name: 'Basic Plan',
    description: '10 days unlimited resume generation',
    price: 5,
    interval: null,
    variantId: '', // You'll fill this from LemonSqueezy dashboard
    features: [
      'Unlimited resume generation',
      'AI-powered content optimization',
      'PDF & Word downloads',
      '10 days access',
      'Professional ATS format'
    ],
    isPopular: true
  },
  professional: {
    id: 'professional_plan',
    name: 'Professional Plan',
    description: 'Monthly subscription with unlimited access',
    price: 11,
    interval: 'month',
    variantId: '', // You'll fill this from LemonSqueezy dashboard
    features: [
      'Everything in Basic Plan',
      'Monthly subscription',
      'Unlimited access',
      'Priority AI processing',
      'Email support'
    ]
  }
};

export interface CheckoutOptions {
  variantId: string;
  customPrice?: number;
  productOptions?: {
    name?: string;
    description?: string;
    mediaUrl?: string;
    redirectUrl?: string;
  };
  checkoutOptions?: {
    embed?: boolean;
    media?: boolean;
    logo?: boolean;
    desc?: boolean;
    discount?: boolean;
    dark?: boolean;
    subscriptionPreview?: boolean;
  };
  checkoutData?: {
    email?: string;
    name?: string;
    billingAddress?: {
      country?: string;
      zip?: string;
    };
  };
  expiresAt?: string;
  preview?: boolean;
}

class LemonSqueezyService {
  private initialized = false;

  constructor() {
    this.init();
  }

  private async init() {
    if (this.initialized) return;

    try {
      // Note: API key is not needed for client-side operations
      // Only public store operations are performed here
      this.initialized = true;
      console.log('LemonSqueezy client initialized');
    } catch (error) {
      console.error('Failed to initialize LemonSqueezy:', error);
    }
  }

  /**
   * Get store information
   */
  async getStoreInfo() {
    try {
      if (!STORE_ID) {
        throw new Error('Store ID not configured');
      }

      // For client-side, we'll use the Lemon.js script instead
      // This is just for demonstration - in practice, you'd fetch this from your backend
      return {
        id: STORE_ID,
        name: 'ResumeBuilder',
        currency: 'USD',
        testMode: TEST_MODE
      };
    } catch (error) {
      console.error('Failed to get store info:', error);
      return null;
    }
  }

  /**
   * Create checkout URL using Lemon.js
   */
  async createCheckout(variantId: string, options: CheckoutOptions = { variantId }) {
    try {
      if (!variantId) {
        throw new Error('Variant ID is required');
      }

      // Construct checkout URL for LemonSqueezy
      const baseUrl = CHECKOUT_URL || `https://store.lemonsqueezy.com/checkout`;
      const params = new URLSearchParams({
        cart: variantId,
        ...(options.checkoutData?.email && { email: options.checkoutData.email }),
        ...(options.checkoutData?.name && { name: options.checkoutData.name }),
        ...(options.productOptions?.redirectUrl && { redirect_url: options.productOptions.redirectUrl }),
        ...(TEST_MODE && { test_mode: 'true' }),
      });

      const checkoutUrl = `${baseUrl}?${params.toString()}`;
      
      return {
        data: {
          attributes: {
            url: checkoutUrl
          }
        }
      };
    } catch (error) {
      console.error('Failed to create checkout:', error);
      throw error;
    }
  }

  /**
   * Open checkout in popup using Lemon.js
   */
  openCheckout(variantId: string, options: CheckoutOptions = { variantId }) {
    try {
      // Use Lemon.js global function if available
      if (typeof window !== 'undefined' && (window as any).createLemonSqueezyCheckout) {
        (window as any).createLemonSqueezyCheckout(variantId, {
          ...options.checkoutOptions,
          ...options.checkoutData
        });
      } else {
        // Fallback to redirect
        this.createCheckout(variantId, options).then(result => {
          if (result?.data?.attributes?.url) {
            window.open(result.data.attributes.url, '_blank');
          }
        });
      }
    } catch (error) {
      console.error('Failed to open checkout:', error);
    }
  }

  /**
   * Validate checkout data
   */
  validateCheckoutData(product: LemonProduct, customData?: any) {
    const errors: string[] = [];

    if (!product.variantId) {
      errors.push('Product variant ID is not configured');
    }

    if (product.price <= 0) {
      errors.push('Product price must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get product by ID
   */
  getProduct(productId: string): LemonProduct | null {
    return PRODUCTS[productId] || null;
  }

  /**
   * Get all products
   */
  getProducts(): LemonProduct[] {
    return Object.values(PRODUCTS);
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Check if test mode is enabled
   */
  isTestMode(): boolean {
    return TEST_MODE;
  }

  /**
   * Get checkout embed script
   */
  getEmbedScript(): string {
    return `
      <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
    `;
  }
}

// Export singleton instance
export const lemonSqueezy = new LemonSqueezyService();
export default lemonSqueezy;
