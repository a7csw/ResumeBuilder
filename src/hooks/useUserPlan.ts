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
    return userPlan.plan === 'ai' || userPlan.plan === 'pro';
  };

  const canExportPDF = () => {
    return userPlan.plan === 'pro';
  };

  const canUseAITemplates = () => {
    return userPlan.plan === 'pro';
  };

  const canAccessTemplates = () => {
    return userPlan.plan !== 'free' || !userPlan.isActive;
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