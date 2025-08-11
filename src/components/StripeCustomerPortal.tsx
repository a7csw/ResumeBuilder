import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { env } from '@/lib/env';

interface StripeCustomerPortalProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

/**
 * Stripe Customer Portal Component
 * 
 * Allows users to manage their subscription, view billing history,
 * update payment methods, and cancel subscriptions.
 */
export const StripeCustomerPortal: React.FC<StripeCustomerPortalProps> = ({
  className,
  variant = 'outline',
  size = 'default',
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleOpenPortal = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to manage your subscription.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const paymentsProvider = env.PAYMENTS_PROVIDER || 'stripe';

      if (paymentsProvider === 'lemonsqueezy') {
        // For Lemon Squeezy, redirect to their customer portal
        // Note: Lemon Squeezy doesn't have a direct customer portal like Stripe
        // Users need to manage subscriptions through their account or contact support
        toast({
          title: 'Lemon Squeezy Subscription Management',
          description: 'Please contact support or check your email for subscription management links.',
          variant: 'default',
        });
        return;
      } else {
        // Call Supabase function to create Stripe customer portal session
        const { data, error } = await supabase.functions.invoke('customer-portal', {
          body: {
            return_url: window.location.origin + '/profile',
          },
        });

        if (error) {
          throw error;
        }

        if (data?.url) {
          // Open in same tab to maintain session
          window.location.href = data.url;
        } else {
          throw new Error('No portal URL received');
        }
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      
      toast({
        title: 'Error',
        description: error instanceof Error 
          ? error.message 
          : 'Failed to open customer portal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleOpenPortal}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Settings className="h-4 w-4 mr-2" />
      )}
      {loading ? 'Opening...' : 'Manage Subscription'}
      {!loading && <ExternalLink className="h-3 w-3 ml-1" />}
    </Button>
  );
};

export default StripeCustomerPortal;
