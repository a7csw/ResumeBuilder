import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlanCapabilities {
  canUseAI: boolean;
  canExportPDF: boolean;
  canAccessTemplate: (templateId: string) => boolean;
  supportLevel: string;
}

export function useUserPlan() {
  const [user, setUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Everything is free - provide unlimited access
  const userPlan = {
    planType: 'free',
    isActive: true,
    expiresAt: null,
  };

  const planUsage = {
    aiCallsUsed: 0,
    aiCallsLimit: null, // unlimited
    exportsUsed: 0,
    exportsLimit: null, // unlimited
    daysRemaining: null, // never expires
  };

  // All capabilities enabled since everything is free
  const capabilities: PlanCapabilities = {
    canUseAI: true,
    canExportPDF: true,
    canAccessTemplate: () => true, // All templates free
    supportLevel: 'standard'
  };

  // Check if user can use a specific capability (always true now)
  const checkCapability = (): boolean => true;

  const incrementUsage = async (): Promise<boolean> => {
    // Always return true since everything is free and unlimited
    return true;
  };

  return {
    // User data
    user,
    
    // Plan data
    userPlan,
    planUsage,
    capabilities,
    
    // Loading states (always false since no backend calls needed)
    isLoading: false,
    planLoading: false,
    usageLoading: false,
    error: null,
    
    // Actions (all no-ops since everything is free)
    incrementAI: () => {},
    markNonRefundable: () => {},
    checkCapability,
    incrementUsage,
    
    // Mutation states
    isIncrementingAI: false,
    
    // Refresh functions (no-ops)
    refetchPlan: () => Promise.resolve(),
    refetchUsage: () => Promise.resolve(),
    
    // Helper methods
    hasActivePlan: true, // Always true since everything is free
    isPro: false, // No pro plans in free version
    isBasic: false, // No basic plans in free version
    daysRemaining: null, // Never expires
    
    // Plan limits (null = unlimited)
    limits: {
      aiCalls: null,
      exports: null,
      templates: ['*'], // All templates
      durationDays: null
    }
  };
}