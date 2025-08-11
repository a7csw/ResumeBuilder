import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { getPricingTier, canAccessTemplate } from '@/lib/pricing';
import { paymentsDisabled } from '@/lib/flags';

export interface UserPlanData {
  plan: 'free' | 'basic' | 'ai' | 'pro' | 'TEST';
  isActive: boolean;
  expiresAt?: string;
  aiUsageCount?: number;
  aiUsageLimit?: number;
  exportCount?: number;
  exportLimit?: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface PlanCapabilities {
  canAccessTemplate: (templateId: string) => boolean;
  canUseAI: boolean;
  canExport: boolean;
  remainingAIUsage: number;
  remainingExports: number;
  shouldShowUpgrade: boolean;
  upgradeReason?: string;
}

/**
 * Enhanced user plan hook with comprehensive plan gating
 */
export function useEnhancedUserPlan() {
  const user = useUser();
  const [userPlan, setUserPlan] = useState<UserPlanData>({
    plan: 'free',
    isActive: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user plan data
  useEffect(() => {
    async function fetchUserPlan() {
      if (!user) {
        setUserPlan({ plan: 'free', isActive: false });
        setLoading(false);
        return;
      }

      // In test mode, treat all users as subscribed
      if (paymentsDisabled()) {
        setUserPlan({ 
          plan: 'TEST', 
          isActive: true,
          aiUsageCount: 0,
          aiUsageLimit: Infinity,
          exportCount: 0,
          exportLimit: Infinity,
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: planError } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (planError && planError.code !== 'PGRST116') {
          throw planError;
        }

        if (data) {
          const now = new Date();
          const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
          const isActive = !expiresAt || expiresAt > now;

          setUserPlan({
            plan: data.plan_type as UserPlanData['plan'],
            isActive,
            expiresAt: data.expires_at,
            aiUsageCount: data.ai_usage_count || 0,
            aiUsageLimit: data.ai_usage_limit,
            exportCount: data.export_count || 0,
            exportLimit: data.export_limit,
            stripeCustomerId: data.stripe_customer_id,
            stripeSubscriptionId: data.stripe_subscription_id,
          });
        } else {
          // No plan found, user is on free plan
          setUserPlan({ plan: 'free', isActive: false });
        }
      } catch (err) {
        console.error('Error fetching user plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user plan');
        setUserPlan({ plan: 'free', isActive: false });
      } finally {
        setLoading(false);
      }
    }

    fetchUserPlan();
  }, [user]);

  // Calculate plan capabilities
  const capabilities: PlanCapabilities = {
    canAccessTemplate: (templateId: string) => 
      // In test mode, allow access to all templates
      paymentsDisabled() ? true : canAccessTemplate(templateId, userPlan.isActive ? userPlan.plan : null),
    
    canUseAI: paymentsDisabled() ? true : (userPlan.isActive && 
      (userPlan.plan === 'ai' || userPlan.plan === 'pro') &&
      (userPlan.plan === 'pro' || (userPlan.aiUsageCount || 0) < (userPlan.aiUsageLimit || 0))),
    
    canExport: paymentsDisabled() ? true : (userPlan.isActive &&
      (userPlan.plan === 'pro' || (userPlan.exportCount || 0) < (userPlan.exportLimit || Infinity))),
    
    remainingAIUsage: paymentsDisabled() ? Infinity : (userPlan.plan === 'pro' ? Infinity : 
      Math.max(0, (userPlan.aiUsageLimit || 0) - (userPlan.aiUsageCount || 0))),
    
    remainingExports: paymentsDisabled() ? Infinity : (userPlan.plan === 'pro' ? Infinity :
      Math.max(0, (userPlan.exportLimit || 0) - (userPlan.exportCount || 0))),
    
    shouldShowUpgrade: paymentsDisabled() ? false : (!userPlan.isActive || userPlan.plan === 'free'),
    
    upgradeReason: paymentsDisabled() ? undefined : (!userPlan.isActive ? 'No active subscription' :
      userPlan.plan === 'free' ? 'Upgrade to access templates' : undefined),
  };

  // Utility functions
  const incrementAIUsage = async (): Promise<boolean> => {
    if (!user || !capabilities.canUseAI) return false;

    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ 
          ai_usage_count: (userPlan.aiUsageCount || 0) + 1 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setUserPlan(prev => ({
        ...prev,
        aiUsageCount: (prev.aiUsageCount || 0) + 1,
      }));

      return true;
    } catch (err) {
      console.error('Error incrementing AI usage:', err);
      return false;
    }
  };

  const incrementExportCount = async (): Promise<boolean> => {
    if (!user || !capabilities.canExport) return false;

    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ 
          export_count: (userPlan.exportCount || 0) + 1 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setUserPlan(prev => ({
        ...prev,
        exportCount: (prev.exportCount || 0) + 1,
      }));

      return true;
    } catch (err) {
      console.error('Error incrementing export count:', err);
      return false;
    }
  };

  const refreshPlan = async () => {
    if (user) {
      setLoading(true);
      // Force refetch
      const { data } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        const now = new Date();
        const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
        const isActive = !expiresAt || expiresAt > now;

        setUserPlan({
          plan: data.plan_type as UserPlanData['plan'],
          isActive,
          expiresAt: data.expires_at,
          aiUsageCount: data.ai_usage_count || 0,
          aiUsageLimit: data.ai_usage_limit,
          exportCount: data.export_count || 0,
          exportLimit: data.export_limit,
          stripeCustomerId: data.stripe_customer_id,
          stripeSubscriptionId: data.stripe_subscription_id,
        });
      }
      setLoading(false);
    }
  };

  return {
    userPlan,
    capabilities,
    loading,
    error,
    incrementAIUsage,
    incrementExportCount,
    refreshPlan,
  };
}