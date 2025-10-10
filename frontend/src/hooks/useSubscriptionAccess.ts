import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscriptionService, UserAccessStatus } from '@/lib/supabase-subscriptions';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionAccessHook {
  accessStatus: UserAccessStatus | null;
  isLoading: boolean;
  error: string | null;
  canGenerateResume: boolean;
  refreshAccess: () => Promise<void>;
  subscriptionDisplay: {
    status: string;
    message: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    showUpgrade: boolean;
  };
}

export const useSubscriptionAccess = (): SubscriptionAccessHook => {
  const [accessStatus, setAccessStatus] = useState<UserAccessStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDisplay, setSubscriptionDisplay] = useState({
    status: 'Loading...',
    message: 'Checking subscription status',
    variant: 'outline' as const,
    showUpgrade: false
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const refreshAccess = async () => {
    if (!user) {
      setAccessStatus(null);
      setIsLoading(false);
      setSubscriptionDisplay({
        status: 'Sign In Required',
        message: 'Please sign in to access premium features',
        variant: 'outline',
        showUpgrade: false
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const subscriptionService = getSubscriptionService(toast);
      
      // Get access status and display info in parallel
      const [status, display] = await Promise.all([
        subscriptionService.getUserAccessStatus(),
        subscriptionService.getSubscriptionStatusDisplay()
      ]);

      setAccessStatus(status);
      setSubscriptionDisplay(display);

    } catch (err) {
      console.error('Error refreshing access:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      // Don't show error toast - just set the state silently
      setSubscriptionDisplay({
        status: 'No Plan',
        message: 'Choose a plan to start generating resumes',
        variant: 'outline',
        showUpgrade: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAccess();
  }, [user]);

  const canGenerateResume = accessStatus?.has_access || false;

  return {
    accessStatus,
    isLoading,
    error,
    canGenerateResume,
    refreshAccess,
    subscriptionDisplay
  };
};

export default useSubscriptionAccess;

