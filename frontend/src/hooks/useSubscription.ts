import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'single' | '10days' | 'monthly';
  status: 'active' | 'expired' | 'cancelled';
  expires_at: string | null;
  resumes_used: number;
  resumes_limit: number | null;
  purchased_at: string;
  gumroad_order_id: string | null;
}

export interface SubscriptionStatus {
  has_access: boolean;
  plan_type: string | null;
  resumes_remaining: number;
  expires_at: string | null;
  status: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!user) {
      setSubscriptionStatus({
        has_access: false,
        plan_type: null,
        resumes_remaining: 0,
        expires_at: null,
        status: 'none'
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the Supabase function to check subscription status
      const { data, error } = await supabase.rpc('check_subscription_status', {
        user_uuid: user.id
      });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setSubscriptionStatus(data[0]);
      } else {
        setSubscriptionStatus({
          has_access: false,
          plan_type: null,
          resumes_remaining: 0,
          expires_at: null,
          status: 'none'
        });
      }
    } catch (err) {
      console.error('Error checking subscription status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check subscription status');
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setSubscription(data || null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    }
  }, [user]);

  const createSubscription = async (
    planType: 'single' | '10days' | 'monthly',
    gumroadOrderId?: string
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate expiry date and limits based on plan type
      let expiresAt: string | null = null;
      let resumesLimit: number | null = null;

      const now = new Date();
      
      switch (planType) {
        case 'single':
          resumesLimit = 1;
          // Single plan doesn't expire, but has usage limit
          break;
        case '10days':
          expiresAt = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'monthly':
          expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_type: planType,
          status: 'active',
          expires_at: expiresAt,
          resumes_limit: resumesLimit,
          gumroad_order_id: gumroadOrderId,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSubscription(data);
      await checkSubscriptionStatus();

      toast({
        title: "Subscription activated!",
        description: `Your ${planType} plan is now active.`,
      });

      return data;
    } catch (err) {
      console.error('Error creating subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      toast({
        title: "Subscription failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const incrementResumeUsage = async () => {
    if (!user || !subscription) {
      throw new Error('No active subscription found');
    }

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          resumes_used: subscription.resumes_used + 1
        })
        .eq('id', subscription.id);

      if (error) {
        throw error;
      }

      // Refresh subscription data
      await fetchSubscription();
      await checkSubscriptionStatus();
    } catch (err) {
      console.error('Error incrementing resume usage:', err);
      throw err;
    }
  };

  const canCreateResume = (): boolean => {
    if (!subscriptionStatus) return false;
    return subscriptionStatus.has_access;
  };

  const canExportResume = (): boolean => {
    if (!subscriptionStatus) return false;
    return subscriptionStatus.has_access;
  };

  const getRemainingResumes = (): number => {
    if (!subscriptionStatus) return 0;
    return subscriptionStatus.resumes_remaining;
  };

  const isExpiringSoon = (): boolean => {
    if (!subscriptionStatus?.expires_at) return false;
    
    const expiryDate = new Date(subscriptionStatus.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  };

  const getDaysUntilExpiry = (): number => {
    if (!subscriptionStatus?.expires_at) return 0;
    
    const expiryDate = new Date(subscriptionStatus.expires_at);
    const now = new Date();
    return Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  // Load subscription data when user changes
  useEffect(() => {
    if (user) {
      Promise.all([
        fetchSubscription(),
        checkSubscriptionStatus()
      ]);
    } else {
      setSubscription(null);
      setSubscriptionStatus(null);
      setLoading(false);
    }
  }, [user, fetchSubscription, checkSubscriptionStatus]);

  return {
    subscription,
    subscriptionStatus,
    loading,
    error,
    createSubscription,
    incrementResumeUsage,
    checkSubscriptionStatus,
    canCreateResume,
    canExportResume,
    getRemainingResumes,
    isExpiringSoon,
    getDaysUntilExpiry,
    refetch: () => Promise.all([fetchSubscription(), checkSubscriptionStatus()])
  };
};
