import { Purchases, PurchasesConfiguration, CustomerInfo, PurchasesPackage } from '@revenuecat/purchases-js';

// RevenueCat Configuration
const REVENUECAT_PUBLIC_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;

interface PlanConfig {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year' | null;
  features: string[];
  isPopular?: boolean;
}

export const PRICING_PLANS: Record<string, PlanConfig> = {
  single: {
    id: 'single',
    name: 'Single Resume',
    price: 2,
    interval: null,
    features: [
      'AI-generated professional resume',
      'ATS-optimized format',
      'PDF & Word download',
      'One-time access'
    ]
  },
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 5,
    interval: null,
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
    id: 'professional',
    name: 'Professional Plan',
    price: 11,
    interval: 'month',
    features: [
      'Everything in Basic Plan',
      'Monthly subscription',
      'Unlimited access',
      'Priority AI processing',
      'Email support'
    ]
  }
};

class RevenueCatService {
  private initialized = false;

  async initialize() {
    if (this.initialized || !REVENUECAT_PUBLIC_KEY) {
      return;
    }

    try {
      const configuration: PurchasesConfiguration = {
        apiKey: REVENUECAT_PUBLIC_KEY,
      };

      await Purchases.configure(configuration);
      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.warn('RevenueCat not configured - running in free mode:', error);
      // Don't throw error, just run in free mode
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!REVENUECAT_PUBLIC_KEY) {
        return null; // Return null for free mode
      }
      await this.initialize();
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.warn('Failed to get customer info - running in free mode:', error);
      return null;
    }
  }

  async getOfferings(): Promise<PurchasesPackage[]> {
    try {
      if (!REVENUECAT_PUBLIC_KEY) {
        return []; // Return empty array for free mode
      }
      await this.initialize();
      const offerings = await Purchases.getOfferings();
      return offerings.current?.availablePackages || [];
    } catch (error) {
      console.warn('Failed to get offerings - running in free mode:', error);
      return [];
    }
  }

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    } catch (error) {
      console.error('Failed to purchase package:', error);
      return null;
    }
  }

  async restorePurchases(): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      return await Purchases.restorePurchases();
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return null;
    }
  }

  async logIn(userId: string): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      const { customerInfo } = await Purchases.logIn(userId);
      return customerInfo;
    } catch (error) {
      console.error('Failed to log in user:', error);
      return null;
    }
  }

  async logOut(): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      return await Purchases.logOut();
    } catch (error) {
      console.error('Failed to log out user:', error);
      return null;
    }
  }

  isUserPremium(customerInfo: CustomerInfo | null): boolean {
    // If RevenueCat is not configured, treat as free user
    if (!REVENUECAT_PUBLIC_KEY) {
      return false;
    }
    
    if (!customerInfo) return false;
    
    // Check for active premium entitlements
    return Object.keys(customerInfo.entitlements.active).length > 0;
  }

  getActivePlan(customerInfo: CustomerInfo | null): 'free' | 'premium' {
    return this.isUserPremium(customerInfo) ? 'premium' : 'free';
  }

  getPlanFeatures(plan: 'free' | 'premium'): string[] {
    return PRICING_PLANS[plan]?.features || [];
  }

  canAccessFeature(customerInfo: CustomerInfo | null, feature: string): boolean {
    // If RevenueCat is not configured, block access (payment required)
    if (!REVENUECAT_PUBLIC_KEY) {
      return false;
    }
    
    if (!customerInfo) return false;
    
    // Check for any active subscription
    const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;
    
    // All features require payment
    switch (feature) {
      case 'resume_generation':
      case 'pdf_export':
      case 'word_export':
      case 'ai_optimization':
        return hasActiveSubscription;
      default:
        return hasActiveSubscription;
    }
  }
}

export const revenueCat = new RevenueCatService();
export default revenueCat;
