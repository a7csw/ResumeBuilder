import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserPlanData {
  plan: 'free' | 'basic' | 'ai' | 'pro' | 'TEST';
  isActive: boolean;
  expiresAt: string | null;
  aiUsageCount: number;
  aiUsageLimit: number | null;
  exportCount: number;
  exportLimit: number | null;
  canRefund?: boolean;
  startedFillingAt?: string | null;
  firstExportAt?: string | null;
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

  const [userPlan, setUserPlan] = useState<UserPlanData>({
    plan: 'free',
    isActive: false,
    expiresAt: null,
    aiUsageCount: 0,
    aiUsageLimit: null,
    exportCount: 0,
    exportLimit: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const capabilities: PlanCapabilities = {
    canUseAI: userPlan.plan === 'ai' || userPlan.plan === 'pro',
    canExport: userPlan.plan !== 'free',
    canAccessTemplate: (templateId: string) => {
      const premiumTemplates = ['modern', 'creative', 'technical', 'graduate', 'internship'];
      if (!premiumTemplates.includes(templateId)) return true;
      return userPlan.plan === 'ai' || userPlan.plan === 'pro';
    },
    hasUnlimitedAI: userPlan.plan === 'pro',
    hasUnlimitedExport: userPlan.plan === 'pro',
  };

  const fetchUserPlan = async () => {
    if (!user) {
      setUserPlan({
        plan: 'free',
        isActive: false,
        expiresAt: null,
        aiUsageCount: 0,
        aiUsageLimit: null,
        exportCount: 0,
        exportLimit: null,
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('enhanced-check-user-plan');
      
      if (error) {
        throw error;
      }

      if (data) {
        setUserPlan({
          plan: data.plan,
          isActive: data.isActive,
          expiresAt: data.expiresAt,
          aiUsageCount: data.ai_calls_used || 0,
          aiUsageLimit: data.ai_calls_limit,
          exportCount: 0,
          exportLimit: 0,
          canRefund: data.canRefund,
          startedFillingAt: data.startedFillingAt,
          firstExportAt: data.firstExportAt,
        });
      }
    } catch (err) {
      console.error('Error fetching user plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPlan();
  }, [user]);

  const incrementAIUsage = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ 
          ai_calls_used: (userPlan.aiUsageCount || 0) + 1 
        })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      setUserPlan(prev => ({
        ...prev,
        aiUsageCount: (prev.aiUsageCount || 0) + 1
      }));

      return true;
    } catch (err) {
      console.error('Error incrementing AI usage:', err);
      return false;
    }
  };

  const incrementExportCount = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ 
          ai_calls_used: (userPlan.exportCount || 0) + 1 
        })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      setUserPlan(prev => ({
        ...prev,
        exportCount: (prev.exportCount || 0) + 1
      }));

      return true;
    } catch (err) {
      console.error('Error incrementing export count:', err);
      return false;
    }
  };

  const refreshPlan = async () => {
    setLoading(true);
    setError('');
    await fetchUserPlan();
  };

  // Add missing methods for backward compatibility
  const canUseFeature = (feature: 'ai' | 'export' | 'templates') => {
    switch (feature) {
      case 'ai': return capabilities.canUseAI;
      case 'export': return capabilities.canExport;
      case 'templates': return capabilities.canAccessTemplate('');
      default: return false;
    }
  };

  const canAccessTemplate = (templateId: string) => capabilities.canAccessTemplate(templateId);
  
  const getUpgradeMessage = (feature: string) => {
    if (feature === 'ai') return 'AI features require an AI or Pro plan';
    if (feature === 'export') return 'PDF export requires a paid plan';
    return 'This feature requires an upgrade';
  };

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