import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserPlan = 'free' | 'basic' | 'ai' | 'pro';

interface EnhancedUserPlanData {
  plan: UserPlan;
  isActive: boolean;
  expiresAt: string | null;
  canUseAI: boolean;
  canExportPDF: boolean;
  canUseAITemplates: boolean;
  canAccessTemplates: boolean;
  aiCallsUsed: number;
  aiCallsLimit: number;
  canRefund: boolean;
  startedFillingAt?: string | null;
  firstExportAt?: string | null;
}

export const useEnhancedUserPlan = () => {
  const [userPlan, setUserPlan] = useState<EnhancedUserPlanData>({
    plan: 'free',
    isActive: false,
    expiresAt: null,
    canUseAI: false,
    canExportPDF: false,
    canUseAITemplates: false,
    canAccessTemplates: true,
    aiCallsUsed: 0,
    aiCallsLimit: 0,
    canRefund: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUserPlan = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.functions.invoke('enhanced-check-user-plan');
      
      if (error) {
        console.error('Plan check error:', error);
        throw error;
      }

      if (data.error) {
        console.error('Plan check function error:', data.error);
        setError(data.error);
        // Still set the plan data even if there's an error
        setUserPlan(prev => ({ ...prev, ...data }));
      } else {
        setUserPlan(data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check plan';
      console.error('Plan check failed:', error);
      setError(message);
      // Fallback to free plan
      setUserPlan({
        plan: 'free',
        isActive: false,
        expiresAt: null,
        canUseAI: false,
        canExportPDF: false,
        canUseAITemplates: false,
        canAccessTemplates: true,
        aiCallsUsed: 0,
        aiCallsLimit: 0,
        canRefund: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserPlan();
  }, []);

  const canAccessTemplate = (templateId: string, isPremium: boolean) => {
    if (!isPremium) return true; // Basic templates are always accessible
    return userPlan.canUseAITemplates; // Premium templates require AI or Pro plan
  };

  const canUseFeature = (feature: 'ai' | 'export' | 'templates') => {
    switch (feature) {
      case 'ai':
        return userPlan.canUseAI && userPlan.aiCallsUsed < userPlan.aiCallsLimit;
      case 'export':
        return userPlan.canExportPDF;
      case 'templates':
        return userPlan.canAccessTemplates;
      default:
        return false;
    }
  };

  const getRemainingAICalls = () => {
    return Math.max(0, userPlan.aiCallsLimit - userPlan.aiCallsUsed);
  };

  const getUpgradeMessage = (feature: 'ai' | 'export' | 'templates' | 'premium-template') => {
    switch (feature) {
      case 'ai':
        if (!userPlan.canUseAI) {
          return "AI features require AI or Pro plan";
        }
        if (userPlan.aiCallsUsed >= userPlan.aiCallsLimit) {
          return "AI usage limit reached. Upgrade to Pro for unlimited usage.";
        }
        return "";
      case 'export':
        return "PDF export requires a paid plan (Basic, AI, or Pro)";
      case 'premium-template':
        return "Premium templates require AI or Pro plan";
      case 'templates':
        return "Template access requires an active plan";
      default:
        return "This feature requires a paid plan";
    }
  };

  const markStartedFilling = async () => {
    if (userPlan.isActive && !userPlan.startedFillingAt) {
      try {
        // This will be handled by the plan update when user starts filling
        await checkUserPlan(); // Refresh plan status
      } catch (error) {
        console.error('Failed to mark started filling:', error);
      }
    }
  };

  return {
    userPlan,
    loading,
    error,
    checkUserPlan,
    canAccessTemplate,
    canUseFeature,
    getRemainingAICalls,
    getUpgradeMessage,
    markStartedFilling,
    refreshPlan: checkUserPlan
  };
};