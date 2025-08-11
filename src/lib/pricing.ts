/**
 * Stripe Pricing Configuration
 * 
 * Centralized configuration for all Stripe products and prices.
 * Update these IDs after creating products in Stripe Dashboard.
 */

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'one_time' | 'month';
  intervalCount?: number;
  duration?: string;
  features: string[];
  stripeProductId: string;
  stripePriceId: string;
  popular?: boolean;
  buttonText: string;
  templateAccess: 'basic' | 'all';
  aiAssistance: boolean;
  aiUsageLimit?: number;
  exportLimit?: number;
}

/**
 * STRIPE CONFIGURATION
 * 
 * ⚠️ CRITICAL: Replace these placeholder IDs with your actual Stripe Product/Price IDs
 * 
 * SETUP STEPS:
 * 1. Go to https://dashboard.stripe.com/products
 * 2. Create 3 products:
 *    - Basic Plan: $3.00 USD (one-time payment)
 *    - AI Plan: $7.00 USD (one-time payment)  
 *    - Pro Plan: $15.00 USD (monthly recurring)
 * 3. Copy the IDs from each product/price
 * 
 * TEST vs LIVE:
 * - For development: Use test mode IDs (prod_test_xxx, price_test_xxx)
 * - For production: Use live mode IDs (prod_xxx, price_xxx)
 * - NEVER mix test and live IDs
 */

// 🔧 REPLACE THESE 6 VALUES WITH YOUR ACTUAL STRIPE IDs 🔧

// Stripe: Basic plan ($3 for 10 days)
const BASIC_PRODUCT_ID = 'prod_SpzvhO9ra0aRfs';
const BASIC_PRICE_ID = 'price_1RuJvtCsgURx7wiGLfW5eChL';

// Stripe: AI plan ($7 for 10 days + AI features)
const AI_PRODUCT_ID = 'prod_SpzvhO9ra0aRfs';
const AI_PRICE_ID = 'price_1RuJvtCsgURx7wiGLfW5eChL';

// Stripe: Pro plan ($15/month recurring)
const PRO_PRODUCT_ID = 'prod_Spzw7R2KeT5Pph';
const PRO_PRICE_ID = 'price_1RuJwYCsgURx7wiG7j2dnKK0';

// Runtime validation for Stripe IDs
function validateStripeConfig() {
  const ids = [
    { name: 'BASIC_PRODUCT_ID', value: BASIC_PRODUCT_ID },
    { name: 'BASIC_PRICE_ID', value: BASIC_PRICE_ID },
    { name: 'AI_PRODUCT_ID', value: AI_PRODUCT_ID },
    { name: 'AI_PRICE_ID', value: AI_PRICE_ID },
    { name: 'PRO_PRODUCT_ID', value: PRO_PRODUCT_ID },
    { name: 'PRO_PRICE_ID', value: PRO_PRICE_ID },
  ];

  const invalid = ids.filter(id => 
    !id.value || 
    id.value.includes('REPLACE_WITH_ACTUAL') ||
    (!id.value.startsWith('prod_') && !id.value.startsWith('price_'))
  );

  if (invalid.length > 0) {
    throw new Error(
      `Invalid Stripe configuration. Please update src/lib/pricing.ts with actual Stripe IDs:\n${
        invalid.map(id => `- ${id.name}: ${id.value}`).join('\n')
      }\n\nGet your IDs from: https://dashboard.stripe.com/products`
    );
  }
}

// Validate on import - re-enabled with real Stripe IDs
validateStripeConfig();

export const STRIPE_CONFIG = {
  BASIC_PRODUCT_ID,
  BASIC_PRICE_ID,
  AI_PRODUCT_ID,
  AI_PRICE_ID,
  PRO_PRODUCT_ID,
  PRO_PRICE_ID,
} as const;

export const PRICING_TIERS: PricingTier[] = [
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
    stripeProductId: STRIPE_CONFIG.BASIC_PRODUCT_ID,
    stripePriceId: STRIPE_CONFIG.BASIC_PRICE_ID,
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
    stripeProductId: STRIPE_CONFIG.AI_PRODUCT_ID,
    stripePriceId: STRIPE_CONFIG.AI_PRICE_ID,
    popular: true,
    buttonText: 'Get AI Access',
    templateAccess: 'all',
    aiAssistance: true,
    aiUsageLimit: 30,
    exportLimit: 10,
  },
  {
    id: 'pro',
    name: 'Pro Monthly',
    description: 'Unlimited access for professionals',
    price: 15,
    currency: 'USD',
    interval: 'month',
    duration: 'per month',
    features: [
      'Access to ALL templates',
      'Unlimited AI assistance',
      'Priority support',
      'Advanced export options',
      'Multiple resume versions',
      'Monthly billing'
    ],
    stripeProductId: STRIPE_CONFIG.PRO_PRODUCT_ID,
    stripePriceId: STRIPE_CONFIG.PRO_PRICE_ID,
    buttonText: 'Go Pro',
    templateAccess: 'all',
    aiAssistance: true,
    // No limits for pro plan
  },
];

// Helper functions
export function getPricingTier(tierId: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === tierId);
}

export function formatPrice(tier: PricingTier): string {
  const price = `$${tier.price}`;
  if (tier.interval === 'month') {
    return `${price}/month`;
  }
  return `${price} for ${tier.duration}`;
}

export function getBasicTemplateIds(): string[] {
  return ['classic', 'minimal', 'student'];
}

export function getAllTemplateIds(): string[] {
  return [
    'classic', 'minimal', 'student', // Basic templates
    'modern', 'creative', 'technical', 'graduate', 'internship', // Premium templates
    'executive', 'techLead', 'consultant', 'innovator' // New premium templates
  ];
}

export function canAccessTemplate(templateId: string, userPlan: string | null): boolean {
  if (!userPlan || userPlan === 'free') return false;
  
  const basicTemplates = getBasicTemplateIds();
  
  if (userPlan === 'basic') {
    return basicTemplates.includes(templateId);
  }
  
  // AI and Pro plans have access to all templates
  return true;
}
