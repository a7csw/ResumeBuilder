// Gumroad Payment Integration
// Simple overlay checkout system for ResumeBuilder

export interface GumroadProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'EUR';
  interval?: 'month' | null;
  gumroadUrl: string;
  features: string[];
  isPopular?: boolean;
  accessValidityDays?: number;
}

// Product configuration with Euro pricing
export const GUMROAD_PRODUCTS: Record<string, GumroadProduct> = {
  single: {
    id: 'single_resume',
    name: 'Single Resume',
    description: 'One-time professional resume generation',
    price: 1,
    currency: 'EUR',
    interval: null,
    gumroadUrl: import.meta.env.VITE_GUMROAD_SINGLE_RESUME_URL || 'https://alfaiadiabood.gumroad.com/l/resume-single',
    features: [
      'AI-generated professional resume',
      'ATS-optimized format',
      'PDF & Word download',
      'One-time access'
    ]
  },
  tenday: {
    id: '10day_access',
    name: '10 Days Access',
    description: '10 days unlimited resume generation',
    price: 4,
    currency: 'EUR',
    interval: null,
    accessValidityDays: 10,
    gumroadUrl: import.meta.env.VITE_GUMROAD_10DAY_ACCESS_URL || 'https://alfaiadiabood.gumroad.com/l/10daypass',
    features: [
      'Unlimited resume generation',
      'AI-powered content optimization',
      'PDF & Word downloads',
      '10 days access',
      'Professional ATS format'
    ],
    isPopular: true
  },
  monthly: {
    id: 'monthly_subscription',
    name: '30-Day Pro Pass',
    description: 'Unlimited resume creation for 30 days',
    price: 9,
    currency: 'EUR',
    interval: null,
    accessValidityDays: 30,
    gumroadUrl: import.meta.env.VITE_GUMROAD_MONTHLY_ACCESS_URL || 'https://alfaiadiabood.gumroad.com/l/novaecv-monthly',
    features: [
      'Everything in 10 Days Access',
      '30 days full access',
      'Unlimited resume creation',
      'Priority AI processing',
      'Premium tools access',
      'Email support'
    ]
  }
};

declare global {
  interface Window {
    GumroadOverlay?: {
      open: (url: string) => void;
    };
  }
}

class GumroadService {
  private overlayLoaded = false;

  constructor() {
    this.loadGumroadOverlay();
  }

  /**
   * Load Gumroad overlay script
   */
  private loadGumroadOverlay() {
    if (this.overlayLoaded || typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://gumroad.com/js/gumroad.js';
    script.async = true;
    script.onload = () => {
      this.overlayLoaded = true;
      console.log('Gumroad overlay loaded');
    };
    script.onerror = () => {
      console.error('Failed to load Gumroad overlay');
    };
    document.head.appendChild(script);
  }

  /**
   * Open Gumroad checkout overlay
   */
  openCheckout(productId: string, options?: { 
    email?: string; 
    name?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }) {
    const product = this.getProduct(productId);
    if (!product) {
      console.error(`Product ${productId} not found`);
      options?.onError?.(`Product ${productId} not found`);
      return;
    }

    try {
      // Construct Gumroad URL with parameters
      const url = new URL(product.gumroadUrl);
      
      // Add customer information if provided
      if (options?.email) {
        url.searchParams.set('email', options.email);
      }
      if (options?.name) {
        url.searchParams.set('name', options.name);
      }

      // Add success redirect URL
      const currentUrl = window.location.origin;
      const successUrl = `${currentUrl}/gumroad/success?product=${productId}`;
      url.searchParams.set('success_url', successUrl);
      
      // Store callback for later use
      if (options?.onSuccess) {
        window.sessionStorage.setItem('gumroad_success_callback', 'true');
        window.sessionStorage.setItem('gumroad_product_id', productId);
      }

      // Use Gumroad overlay if available, otherwise open in new tab
      if (window.GumroadOverlay && this.overlayLoaded) {
        window.GumroadOverlay.open(url.toString());
      } else {
        // Fallback to opening in new tab
        window.open(url.toString(), '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      }

      console.log(`Opening Gumroad checkout for ${product.name}`);
    } catch (error) {
      console.error('Error opening Gumroad checkout:', error);
      options?.onError?.('Failed to open checkout');
    }
  }

  /**
   * Open checkout in redirect mode (full page)
   */
  redirectToCheckout(productId: string, options?: { 
    email?: string; 
    name?: string;
    returnUrl?: string;
  }) {
    const product = this.getProduct(productId);
    if (!product) {
      console.error(`Product ${productId} not found`);
      return;
    }

    try {
      const url = new URL(product.gumroadUrl);
      
      if (options?.email) {
        url.searchParams.set('email', options.email);
      }
      if (options?.name) {
        url.searchParams.set('name', options.name);
      }
      if (options?.returnUrl) {
        url.searchParams.set('return_url', options.returnUrl);
      }

      // Store product info for success page
      window.sessionStorage.setItem('gumroad_product_id', productId);
      window.sessionStorage.setItem('gumroad_checkout_time', Date.now().toString());

      // Redirect to Gumroad
      window.location.href = url.toString();
    } catch (error) {
      console.error('Error redirecting to Gumroad:', error);
    }
  }

  /**
   * Get product by ID (supports both key and product ID)
   */
  getProduct(productId: string): GumroadProduct | null {
    // First try to find by key
    if (GUMROAD_PRODUCTS[productId]) {
      return GUMROAD_PRODUCTS[productId];
    }
    
    // Then try to find by product ID
    const product = Object.values(GUMROAD_PRODUCTS).find(p => p.id === productId);
    return product || null;
  }

  /**
   * Get all products
   */
  getProducts(): GumroadProduct[] {
    return Object.values(GUMROAD_PRODUCTS);
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Check if user has completed purchase (basic client-side check)
   */
  checkPurchaseStatus(): {
    hasPurchased: boolean;
    productId?: string;
    purchaseTime?: number;
  } {
    try {
      const productId = window.sessionStorage.getItem('gumroad_product_id');
      const purchaseTime = window.sessionStorage.getItem('gumroad_checkout_time');
      const successCallback = window.sessionStorage.getItem('gumroad_success_callback');

      if (productId && purchaseTime && successCallback) {
        return {
          hasPurchased: true,
          productId,
          purchaseTime: parseInt(purchaseTime)
        };
      }

      return { hasPurchased: false };
    } catch (error) {
      console.error('Error checking purchase status:', error);
      return { hasPurchased: false };
    }
  }

  /**
   * Clear purchase status (for testing or logout)
   */
  clearPurchaseStatus() {
    try {
      window.sessionStorage.removeItem('gumroad_product_id');
      window.sessionStorage.removeItem('gumroad_checkout_time');
      window.sessionStorage.removeItem('gumroad_success_callback');
    } catch (error) {
      console.error('Error clearing purchase status:', error);
    }
  }

  /**
   * Validate product configuration
   */
  validateProduct(product: GumroadProduct): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!product.gumroadUrl || (!product.gumroadUrl.startsWith('https://gum.co/') && !product.gumroadUrl.startsWith('https://alfaiadiabood.gumroad.com/'))) {
      errors.push('Invalid Gumroad URL');
    }

    if (product.price <= 0) {
      errors.push('Product price must be greater than 0');
    }

    if (!product.name || product.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get Gumroad embed script HTML
   */
  getEmbedScript(): string {
    return '<script src="https://gumroad.com/js/gumroad.js" async></script>';
  }
}

// Export singleton instance
export const gumroad = new GumroadService();
export default gumroad;
