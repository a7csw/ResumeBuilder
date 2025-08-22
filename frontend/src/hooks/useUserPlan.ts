import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserPlanService, type UserPlanInfo } from '@/lib/userPlan';
import { getPlanLimits } from '@/lib/pricing';
import { useToast } from '@/hooks/use-toast';

export interface PlanUsage {
  aiCallsUsed: number;
  aiCallsLimit: number | null;
  templatesUsed: number;
  templatesLimit: number | null;
  exportsUsed: number;
  exportsLimit: number | null;
  daysRemaining: number | null;
}

export interface PlanCapabilities {
  canUseAI: boolean;
  canAccessTemplates: boolean;
  canExport: boolean;
  hasWatermark: boolean;
  supportLevel: string;
}

export function useUserPlan() {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Query user's current plan
  const {
    data: userPlan,
    isLoading: planLoading,
    error: planError,
    refetch: refetchPlan
  } = useQuery({
    queryKey: ['userPlan', user?.id],
    queryFn: () => user?.id ? UserPlanService.getUserPlan(user.id) : null,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query plan usage statistics
  const {
    data: planUsage,
    isLoading: usageLoading,
    refetch: refetchUsage
  } = useQuery({
    queryKey: ['planUsage', user?.id],
    queryFn: () => user?.id ? UserPlanService.getPlanUsage(user.id) : null,
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Mutation for incrementing AI calls
  const incrementAIMutation = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return UserPlanService.incrementAICalls(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPlan', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['planUsage', user?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "AI Generation Limit Reached",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation for marking plan as non-refundable (after export)
  const markNonRefundableMutation = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return UserPlanService.markNonRefundable(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPlan', user?.id] });
    }
  });

  // Calculate plan capabilities
  const capabilities: PlanCapabilities = {
    canUseAI: userPlan?.isActive ? 
      (userPlan.aiCallsLimit === null || userPlan.aiCallsUsed < userPlan.aiCallsLimit) : false,
    canAccessTemplates: !!userPlan?.isActive,
    canExport: !!userPlan?.isActive,
    hasWatermark: userPlan?.planType === 'basic',
    supportLevel: userPlan?.planType === 'pro' ? 'priority' : 'email'
  };

  // Helper functions
  const checkCapability = async (capability: 'ai_generation' | 'template_access' | 'export' | 'no_watermark'): Promise<boolean> => {
    if (!user?.id || !userPlan) return false;
    
    // Simple capability check based on plan type
    switch (capability) {
      case 'ai_generation':
        return userPlan.isActive && (userPlan.planType === 'basic' || userPlan.planType === 'pro');
      case 'template_access':
        return true; // All users can access templates
      case 'export':
        return userPlan.isActive;
      case 'no_watermark':
        return userPlan.isActive && userPlan.planType === 'pro';
      default:
        return false;
    }
  };

  const incrementUsage = async (usageType: 'ai_calls' | 'templates' | 'exports'): Promise<boolean> => {
    if (!user?.id || !userPlan) return false;
    
    try {
      // Simple usage increment - just update the user_plans table
      const updates: any = {};
      
      switch (usageType) {
        case 'ai_calls':
          updates.ai_calls_used = (userPlan.aiCallsUsed || 0) + 1;
          break;
        case 'templates':
          // Template usage is not tracked in current schema
          return true;
        case 'exports':
          // Export usage is not tracked in current schema
          return true;
      }

      const { error } = await supabase
        .from('user_plans')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error incrementing usage:', error);
        return false;
      }

      // Refresh queries after usage increment
      queryClient.invalidateQueries({ queryKey: ['userPlan', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['planUsage', user?.id] });

      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  return {
    // User data
    user,
    
    // Plan data
    userPlan,
    planUsage,
    capabilities,
    
    // Loading states
    isLoading: planLoading || usageLoading,
    planLoading,
    usageLoading,
    error: planError,
    
    // Actions
    incrementAI: incrementAIMutation.mutate,
    markNonRefundable: markNonRefundableMutation.mutate,
    checkCapability,
    incrementUsage,
    
    // Mutation states
    isIncrementingAI: incrementAIMutation.isPending,
    
    // Refresh functions
    refetchPlan,
    refetchUsage,
    
    // Helper methods
    hasActivePlan: !!userPlan?.isActive,
    isPro: userPlan?.planType === 'pro',
    isBasic: userPlan?.planType === 'basic',
    daysRemaining: planUsage?.daysRemaining || 0,
    
    // Plan limits
    limits: userPlan ? getPlanLimits(userPlan.planType) : null
  };
}