import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserPlan = 'free' | 'basic' | 'ai' | 'pro';

interface UserPlanData {
  plan: UserPlan;
  isActive: boolean;
  expiresAt: string | null;
}

export const useUserPlan = () => {
  const [userPlan, setUserPlan] = useState<UserPlanData>({
    plan: 'free',
    isActive: false,
    expiresAt: null
  });
  const [loading, setLoading] = useState(true);

  const checkUserPlan = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-user-plan');
      
      if (error) {
        console.error('Plan check error:', error);
        setUserPlan({ plan: 'free', isActive: false, expiresAt: null });
      } else {
        setUserPlan(data);
      }
    } catch (error) {
      console.error('Plan check failed:', error);
      setUserPlan({ plan: 'free', isActive: false, expiresAt: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserPlan();
  }, []);

  const canUseAI = () => {
    return userPlan.isActive && (userPlan.plan === 'ai' || userPlan.plan === 'pro');
  };

  const canExportPDF = () => {
    // PDF export is available for any active paid plan (basic, ai, pro)
    return userPlan.isActive && (userPlan.plan === 'basic' || userPlan.plan === 'ai' || userPlan.plan === 'pro');
  };

  const canUseAITemplates = () => {
    // AI templates/features only for AI or Monthly plans when active
    return userPlan.isActive && (userPlan.plan === 'ai' || userPlan.plan === 'pro');
  };

  const canAccessTemplates = () => {
    // Allow browsing/using templates; restrictions are enforced at export/unlock time
    return true;
  };

  return {
    userPlan,
    loading,
    checkUserPlan,
    canUseAI,
    canExportPDF,
    canUseAITemplates,
    canAccessTemplates
  };
};