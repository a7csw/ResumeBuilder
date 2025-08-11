/**
 * Lemon Squeezy Configuration
 * 
 * Centralized configuration for all Lemon Squeezy products and store.
 * Update these IDs after creating products in Lemon Squeezy Dashboard.
 */

export interface LemonSqueezyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'one_time' | 'month';
  intervalCount?: number;
  duration?: string;
  features: string[];
  lemonProductId: string;
  popular?: boolean;
  buttonText: string;
  templateAccess: 'basic' | 'all';
  aiAssistance: boolean;
  aiUsageLimit?: number;
  exportLimit?: number;
}

/**
 * LEMON SQUEEZY CONFIGURATION
 * 
 * ⚠️ CRITICAL: Replace these placeholder IDs with your actual Lemon Squeezy Product IDs
 * 
 * SETUP STEPS:
 * 1. Go to https://app.lemonsqueezy.com/dashboard
 * 2. Create 3 products:
 *    - Basic Plan: $3.00 USD (one-time payment)
 *    - AI Plan: $7.00 USD (one-time payment)  
 *    - Monthly Plan: $15.00 USD (monthly recurring)
 * 3. Copy the IDs from each product
 * 
 * TEST vs LIVE:
 * - For development: Use test mode IDs
 * - For production: Use live mode IDs
 * - NEVER mix test and live IDs
 */

// 🔧 REPLACE THESE 4 VALUES WITH YOUR ACTUAL LEMON SQUEEZY IDs 🔧

// Lemon Squeezy Store and Product ID Constants
const LEMON_STORE_ID = import.meta.env.VITE_LEMON_STORE_ID || 'your-store-id-here';

// Lemon Squeezy: Basic plan ($3 for 10 days)
const LEMON_PRODUCT_BASIC = import.meta.env.VITE_LEMON_PRODUCT_BASIC || 'your-basic-product-id-here';

// Lemon Squeezy: AI plan ($7 for 10 days + AI features)
const LEMON_PRODUCT_AI = import.meta.env.VITE_LEMON_PRODUCT_AI || 'your-ai-product-id-here';

// Lemon Squeezy: Monthly plan ($15/month recurring)
const LEMON_PRODUCT_MONTHLY = import.meta.env.VITE_LEMON_PRODUCT_MONTHLY || 'your-monthly-product-id-here';

// Runtime validation for Lemon Squeezy IDs
function validateLemonSqueezyConfig() {
  const ids = [
    { name: 'LEMON_STORE_ID', value: LEMON_STORE_ID },
    { name: 'LEMON_PRODUCT_BASIC', value: LEMON_PRODUCT_BASIC },
    { name: 'LEMON_PRODUCT_AI', value: LEMON_PRODUCT_AI },
    { name: 'LEMON_PRODUCT_MONTHLY', value: LEMON_PRODUCT_MONTHLY },
  ];

  const invalid = ids.filter(id => 
    !id.value || 
    id.value.includes('your-') ||
    id.value.includes('here')
  );

  if (invalid.length > 0) {
    throw new Error(
      `Invalid Lemon Squeezy configuration. Please update .env.local with actual Lemon Squeezy IDs:\n${
        invalid.map(id => `- ${id.name}: ${id.value}`).join('\n')
      }\n\nGet your IDs from: https://app.lemonsqueezy.com/dashboard`
    );
  }
}

// Validate on import if Lemon Squeezy is the payment provider
// Temporarily disabled for development - re-enable after setting real IDs
// if (import.meta.env.VITE_PAYMENTS_PROVIDER === 'lemonsqueezy') {
//   validateLemonSqueezyConfig();
// }

export const LEMON_SQUEEZY_CONFIG = {
  STORE_ID: LEMON_STORE_ID,
  PRODUCT_BASIC: LEMON_PRODUCT_BASIC,
  PRODUCT_AI: LEMON_PRODUCT_AI,
  PRODUCT_MONTHLY: LEMON_PRODUCT_MONTHLY,
} as const;

export const LEMON_SQUEEZY_PRODUCTS: LemonSqueezyProduct[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for simple resumes',
    price: 3,
    currency: 'USD',
    interval: 'one_time',
    duration: '10 days',
    features: [
      'Access to 3 basic templates',
      'Manual content entry',
      'PDF export',
      'ATS-optimized layouts',
      '10-day access'
    ],
    lemonProductId: LEMON_SQUEEZY_CONFIG.PRODUCT_BASIC,
    buttonText: 'Get Basic Access',
    templateAccess: 'basic',
    aiAssistance: false,
    exportLimit: 5,
  },
  {
    id: 'ai',
    name: 'AI Enhanced',
    description: 'AI-powered resume building',
    price: 7,
    currency: 'USD',
    interval: 'one_time',
    duration: '10 days',
    features: [
      'Access to ALL templates',
      'AI content suggestions',
      'Smart formatting',
      'Industry-specific optimization',
      '30 AI enhancements',
      '10-day access'
    ],
    lemonProductId: LEMON_SQUEEZY_CONFIG.PRODUCT_AI,
    popular: true,
    buttonText: 'Get AI Access',
    templateAccess: 'all',
    aiAssistance: true,
    aiUsageLimit: 30,
    exportLimit: 10,
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    description: 'Unlimited access with premium support',
    price: 15,
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in AI plan',
      'Unlimited AI usage',
      'Unlimited exports',
      'Priority support',
      'Multiple resume versions',
      'Monthly billing'
    ],
    lemonProductId: LEMON_SQUEEZY_CONFIG.PRODUCT_MONTHLY,
    buttonText: 'Go Pro',
    templateAccess: 'all',
    aiAssistance: true,
    // No limits for monthly plan
  },
];

// Helper functions
export function getLemonSqueezyProduct(productId: string): LemonSqueezyProduct | undefined {
  return LEMON_SQUEEZY_PRODUCTS.find(product => product.id === productId);
}

export function getLemonSqueezyProductByLemonId(lemonProductId: string): LemonSqueezyProduct | undefined {
  return LEMON_SQUEEZY_PRODUCTS.find(product => product.lemonProductId === lemonProductId);
}

// Generate checkout URLs
export function generateLemonSqueezyCheckoutUrl(
  productId: string, 
  userEmail?: string,
  successUrl?: string,
  cancelUrl?: string
): string {
  const product = getLemonSqueezyProduct(productId);
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  const baseUrl = `https://${LEMON_SQUEEZY_CONFIG.STORE_ID}.lemonsqueezy.com/checkout/buy/${product.lemonProductId}`;
  const params = new URLSearchParams();

  if (userEmail) {
    params.append('checkout[email]', userEmail);
  }

  if (successUrl) {
    params.append('checkout[success_url]', successUrl);
  }

  if (cancelUrl) {
    params.append('checkout[cancel_url]', cancelUrl);
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export default LEMON_SQUEEZY_CONFIG;
