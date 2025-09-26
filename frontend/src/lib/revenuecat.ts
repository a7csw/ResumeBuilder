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
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      'Basic resume templates',
      'Word document export',
      'Up to 3 resumes',
      'Basic AI suggestions'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 1,
    interval: 'month',
    features: [
      'All premium templates',
      'PDF & Word export',
      'Unlimited resumes',
      'Advanced AI enhancements',
      'Priority support',
      'No watermarks'
    ],
    isPopular: true
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
      console.error('Failed to initialize RevenueCat:', error);
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  async getOfferings(): Promise<PurchasesPackage[]> {
    try {
      await this.initialize();
      const offerings = await Purchases.getOfferings();
      return offerings.current?.availablePackages || [];
    } catch (error) {
      console.error('Failed to get offerings:', error);
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
    const plan = this.getActivePlan(customerInfo);
    const features = this.getPlanFeatures(plan);
    
    // Map features to access rules
    switch (feature) {
      case 'pdf_export':
        return plan === 'premium';
      case 'premium_templates':
        return plan === 'premium';
      case 'unlimited_resumes':
        return plan === 'premium';
      case 'advanced_ai':
        return plan === 'premium';
      default:
        return true; // Default allow for basic features
    }
  }
}

export const revenueCat = new RevenueCatService();
export default revenueCat;
