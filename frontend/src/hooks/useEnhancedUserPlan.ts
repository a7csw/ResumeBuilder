import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserPlanData {
  plan: 'free';
  isActive: boolean;
  expiresAt: string | null;
  aiUsageCount: number;
  aiUsageLimit: number | null;
  exportCount: number;
  exportLimit: number | null;
}

export interface PlanCapabilities {
  canUseAI: boolean;
  canExport: boolean;
  canAccessTemplate: (templateId: string) => boolean;
  hasUnlimitedAI: boolean;
  hasUnlimitedExport: boolean;
}

export function useEnhancedUserPlan() {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Always provide free access to all features
  const [userPlan] = useState<UserPlanData>({
    plan: 'free',
    isActive: true,
    expiresAt: null,
    aiUsageCount: 0,
    aiUsageLimit: null,
    exportCount: 0,
    exportLimit: null,
  });

  const [loading, setLoading] = useState(false);
  const [error] = useState<string>('');

  // All features are now free and unlimited
  const capabilities: PlanCapabilities = {
    canUseAI: true,
    canExport: true,
    canAccessTemplate: () => true, // All templates are free
    hasUnlimitedAI: true,
    hasUnlimitedExport: true,
  };

  // Simplified functions that don't track usage since everything is free
  const incrementAIUsage = async (): Promise<boolean> => {
    // Always return true since AI is unlimited and free
    return true;
  };

  const incrementExportCount = async (): Promise<boolean> => {
    // Always return true since exports are unlimited and free
    return true;
  };

  const refreshPlan = async () => {
    // No-op since everything is free
  };

  // All features are available to everyone
  const canUseFeature = () => true;
  const canAccessTemplate = () => true;
  const getUpgradeMessage = () => ''; // No upgrade needed

  return {
    userPlan: {
      ...userPlan,
      canUseAI: capabilities.canUseAI,
      canExportPDF: capabilities.canExport,
      canUseAITemplates: capabilities.canUseAI,
      aiCallsUsed: userPlan.aiUsageCount || 0,
      aiCallsLimit: userPlan.aiUsageLimit || 0,
    },
    capabilities,
    loading,
    error: error || '',
    incrementAIUsage,
    incrementExportCount,
    refreshPlan,
    canUseFeature,
    canAccessTemplate,
    getUpgradeMessage,
  };
}