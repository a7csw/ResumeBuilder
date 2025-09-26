import { useState, useEffect, useCallback } from 'react';
import { CustomerInfo, PurchasesPackage } from '@revenuecat/purchases-js';
import { revenueCat } from '@/lib/revenuecat';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UseRevenueCatReturn {
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[];
  isLoading: boolean;
  isPremium: boolean;
  activePlan: 'free' | 'premium';
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshCustomerInfo: () => Promise<void>;
  canAccessFeature: (feature: string) => boolean;
}

export const useRevenueCat = (): UseRevenueCatReturn => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const refreshCustomerInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await revenueCat.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error('Failed to refresh customer info:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOfferings = useCallback(async () => {
    try {
      const availablePackages = await revenueCat.getOfferings();
      setPackages(availablePackages);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    }
  }, []);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      setIsLoading(true);
      const info = await revenueCat.purchasePackage(pkg);
      if (info) {
        setCustomerInfo(info);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to purchase package:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const info = await revenueCat.restorePurchases();
      if (info) {
        setCustomerInfo(info);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const canAccessFeature = useCallback((feature: string): boolean => {
    return revenueCat.canAccessFeature(customerInfo, feature);
  }, [customerInfo]);

  // Get current user from Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Initialize RevenueCat and sync user
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        await revenueCat.initialize();
        
        if (user) {
          // Log in the user to RevenueCat
          await revenueCat.logIn(user.id);
        }
        
        await refreshCustomerInfo();
        await loadOfferings();
      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
        setIsLoading(false);
      }
    };

    initializeRevenueCat();
  }, [user, refreshCustomerInfo, loadOfferings]);

  // Handle user login/logout
  useEffect(() => {
    const handleUserChange = async () => {
      if (user) {
        await revenueCat.logIn(user.id);
        await refreshCustomerInfo();
      } else {
        await revenueCat.logOut();
        setCustomerInfo(null);
      }
    };

    handleUserChange();
  }, [user, refreshCustomerInfo]);

  const isPremium = revenueCat.isUserPremium(customerInfo);
  const activePlan = revenueCat.getActivePlan(customerInfo);

  return {
    customerInfo,
    packages,
    isLoading,
    isPremium,
    activePlan,
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
    canAccessFeature,
  };
};
