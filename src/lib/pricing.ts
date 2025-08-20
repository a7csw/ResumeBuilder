// Pricing configuration for NovaCV
import { env } from './env';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  duration: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 5.00,
    priceId: env.LEMON_PRODUCT_BASIC,
    description: 'Perfect for quick projects',
    duration: '10 days',
    features: [
      '1 AI-generated resume',
      '3 professional templates', 
      'PDF download',
      'Basic customization',
      'Email support'
    ],
    limitations: [
      'NovaCV watermark',
      'Limited to 10 days',
      'Single resume generation'
    ],
    popular: false
  },
  pro: {
    id: 'pro',
    name: 'Professional Plan',
    price: 11.00,
    priceId: env.LEMON_PRODUCT_PRO,
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

// Plan capabilities and limits
export const PLAN_LIMITS = {
  basic: {
    aiGenerations: 1,
    templates: 3,
    exports: 1,
    durationDays: 10,
    hasWatermark: true,
    supportLevel: 'email'
  },
  pro: {
    aiGenerations: -1, // unlimited
    templates: -1, // unlimited
    exports: -1, // unlimited
    durationDays: 30, // monthly recurring
    hasWatermark: false,
    supportLevel: 'priority'
  }
};

// Helper functions
export function getPlanByPriceId(priceId: string): PricingPlan | null {
  return Object.values(PRICING_PLANS).find(plan => plan.priceId === priceId) || null;
}

export function getPlanById(planId: string): PricingPlan | null {
  return PRICING_PLANS[planId] || null;
}

export function calculatePlanExpiry(planId: string, startDate: Date = new Date()): Date {
  const plan = getPlanById(planId);
  if (!plan) throw new Error(`Invalid plan ID: ${planId}`);
  
  const expiryDate = new Date(startDate);
  
  if (planId === 'basic') {
    expiryDate.setDate(expiryDate.getDate() + 10);
  } else if (planId === 'pro') {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  }
  
  return expiryDate;
}

export function isPlanActive(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) > new Date();
}

export function getPlanLimits(planId: string) {
  return PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS] || null;
}

// Validate pricing configuration
export function validatePricingConfig(): boolean {
  const missingIds = Object.values(PRICING_PLANS)
    .filter(plan => plan.priceId.includes('default'))
    .map(plan => plan.id);
    
  if (missingIds.length > 0) {
    console.warn(`Missing price IDs for plans: ${missingIds.join(', ')}`);
    return false;
  }
  
  return true;
}
