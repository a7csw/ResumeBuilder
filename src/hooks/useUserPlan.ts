import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { paymentsDisabled } from '@/lib/flags';

export type UserPlan = 'free' | 'basic' | 'ai' | 'pro' | 'TEST';

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
    // In test mode, treat all users as subscribed
    if (paymentsDisabled()) {
      setUserPlan({ 
        plan: 'TEST', 
        isActive: true, 
        expiresAt: null 
      });
      setLoading(false);
      return;
    }

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
    // In test mode, allow all AI features
    if (paymentsDisabled()) return true;
    return userPlan.isActive && (userPlan.plan === 'ai' || userPlan.plan === 'pro');
  };

  const canExportPDF = () => {
    // In test mode, allow all exports
    if (paymentsDisabled()) return true;
    // PDF export is available for any active paid plan (basic, ai, pro)
    return userPlan.isActive && (userPlan.plan === 'basic' || userPlan.plan === 'ai' || userPlan.plan === 'pro');
  };

  const canUseAITemplates = () => {
    // In test mode, allow all templates
    if (paymentsDisabled()) return true;
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