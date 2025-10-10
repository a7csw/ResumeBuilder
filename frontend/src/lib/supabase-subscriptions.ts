import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GumroadSubscription {
  id: string;
  user_id: string;
  product_id: 'single_resume' | '10day_access' | 'monthly_subscription';
  product_name: string;
  gumroad_order_id?: string;
  price_paid: number;
  currency: string;
  status: 'active' | 'expired' | 'cancelled';
  starts_at: string;
  expires_at?: string;
  resumes_generated: number;
  resumes_limit?: number;
  purchased_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserAccessStatus {
  has_access: boolean;
  product_id?: string;
  product_name?: string;
  resumes_remaining: number;
  expires_at?: string;
  status: string;
  subscription_id?: string;
}

export interface UserResume {
  id: string;
  user_id: string;
  subscription_id?: string;
  title: string;
  content: any;
  template_type: string;
  is_exported: boolean;
  export_count: number;
  pdf_generated: boolean;
  docx_generated: boolean;
  created_at: string;
  updated_at: string;
}

class SupabaseSubscriptionService {
  private toast: ReturnType<typeof useToast>['toast'];

  constructor(toast: ReturnType<typeof useToast>['toast']) {
    this.toast = toast;
  }

  /**
   * Get current user's access status
   */
  async getUserAccessStatus(): Promise<UserAccessStatus | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First try the new RPC function, fallback to direct table query
      let data, error;
      try {
        const result = await supabase.rpc('get_user_access_status', {
          user_uuid: user.id
        });
        data = result.data;
        error = result.error;
      } catch (rpcError) {
        console.log('RPC function not available, using direct table query');
        // Fallback to direct table query
        const { data: subscriptions, error: tableError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (tableError) {
          error = tableError;
        } else {
          const subscription = subscriptions?.[0];
          if (!subscription) {
            data = [{
              has_access: false,
              product_id: null,
              product_name: 'No Plan',
              resumes_remaining: 0,
              expires_at: null,
              status: 'none',
              subscription_id: null
            }];
          } else {
            // Check if expired
            const now = new Date();
            const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null;
            const isExpired = expiresAt && expiresAt < now;
            
            if (isExpired) {
              // Update status to expired
              await supabase
                .from('user_subscriptions')
                .update({ status: 'expired' })
                .eq('id', subscription.id);
              
              data = [{
                has_access: false,
                product_id: subscription.plan_type,
                product_name: subscription.gumroad_product_name || subscription.plan_type,
                resumes_remaining: 0,
                expires_at: subscription.expires_at,
                status: 'expired',
                subscription_id: subscription.id
              }];
            } else {
              // Calculate remaining resumes
              let resumesRemaining = -1; // unlimited by default
              if (subscription.plan_type === 'single_resume') {
                resumesRemaining = Math.max(0, (subscription.resumes_limit || 1) - (subscription.resumes_used || 0));
              }
              
              data = [{
                has_access: subscription.plan_type === 'single_resume' ? resumesRemaining > 0 : true,
                product_id: subscription.plan_type,
                product_name: subscription.gumroad_product_name || subscription.plan_type,
                resumes_remaining: resumesRemaining,
                expires_at: subscription.expires_at,
                status: subscription.status,
                subscription_id: subscription.id
              }];
            }
          }
        }
      }

      if (error) {
        console.error('Error getting user access status:', error);
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getUserAccessStatus:', error);
      // Don't show toast error - let the calling component handle it
      // This prevents annoying errors when user is not logged in
      return null;
    }
  }

  /**
   * Create a new subscription after Gumroad purchase
   */
  async createSubscription(
    productId: string,
    gumroadOrderId: string,
    pricePaid: number
  ): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Map product IDs to plan types and set expiry
      let planType: string;
      let expiresAt: string | null = null;
      let resumesLimit: number | null = null;

      switch (productId) {
        case 'single_resume':
        case 'single':
          planType = 'single';
          resumesLimit = 1;
          break;
        case '10day_access':
        case '10days':
          planType = '10days';
          expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'monthly_subscription':
        case 'monthly':
          planType = 'monthly';
          expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        default:
          throw new Error(`Unknown product ID: ${productId}`);
      }

      // Try RPC function first, fallback to direct insert
      let data, error;
      try {
        const result = await supabase.rpc('create_gumroad_subscription', {
          user_uuid: user.id,
          product_id_param: productId,
          gumroad_order_id_param: gumroadOrderId,
          price_paid_param: pricePaid
        });
        data = result.data;
        error = result.error;
      } catch (rpcError) {
        console.log('RPC function not available, using direct insert');
        // Fallback to direct insert
        const insertData: any = {
          user_id: user.id,
          plan_type: planType,
          status: 'active',
          gumroad_order_id: gumroadOrderId,
          purchased_at: new Date().toISOString()
        };

        if (expiresAt) {
          insertData.expires_at = expiresAt;
        }
        if (resumesLimit) {
          insertData.resumes_limit = resumesLimit;
        }

        const result = await supabase
          .from('user_subscriptions')
          .insert(insertData)
          .select('id')
          .single();
        
        data = result.data?.id;
        error = result.error;
      }

      if (error) {
        console.error('Error creating subscription:', error);
        throw error;
      }

      this.toast({
        title: "Subscription activated! 🎉",
        description: "Your access has been successfully activated.",
      });

      return data;
    } catch (error) {
      console.error('Error in createSubscription:', error);
      this.toast({
        title: "Subscription activation failed",
        description: "Could not activate your subscription. Please contact support.",
        variant: "destructive",
      });
      return null;
    }
  }

  /**
   * Get user's subscription history
   */
  async getUserSubscriptions(): Promise<GumroadSubscription[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting user subscriptions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserSubscriptions:', error);
      return [];
    }
  }

  /**
   * Get user's resumes
   */
  async getUserResumes(): Promise<UserResume[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting user resumes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserResumes:', error);
      return [];
    }
  }

  /**
   * Create a new resume (with access control)
   */
  async createResume(
    title: string,
    content: any,
    templateType: string = 'professional'
  ): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check access first
      const accessStatus = await this.getUserAccessStatus();
      if (!accessStatus?.has_access) {
        this.toast({
          title: "Access required",
          description: "You need an active subscription to generate resumes.",
          variant: "destructive",
        });
        return null;
      }

      // For single resume plans, check if we can increment the count
      if (accessStatus.product_id === 'single_resume' && accessStatus.subscription_id) {
        const { data: canIncrement, error: incrementError } = await supabase.rpc(
          'increment_resume_count',
          { subscription_uuid: accessStatus.subscription_id }
        );

        if (incrementError || !canIncrement) {
          this.toast({
            title: "Resume limit reached",
            description: "You have reached your resume generation limit for this plan.",
            variant: "destructive",
          });
          return null;
        }
      }

      // Create the resume
      const { data, error } = await supabase
        .from('user_resumes')
        .insert({
          user_id: user.id,
          subscription_id: accessStatus.subscription_id,
          title,
          content,
          template_type: templateType
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating resume:', error);
        throw error;
      }

      this.toast({
        title: "Resume created! ✨",
        description: "Your resume has been generated successfully.",
      });

      return data.id;
    } catch (error) {
      console.error('Error in createResume:', error);
      this.toast({
        title: "Resume creation failed",
        description: "Could not create your resume. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }

  /**
   * Update resume export status
   */
  async updateResumeExport(
    resumeId: string,
    exportType: 'pdf' | 'docx'
  ): Promise<boolean> {
    try {
      const updateData: any = {
        is_exported: true,
        export_count: supabase.sql`export_count + 1`
      };

      if (exportType === 'pdf') {
        updateData.pdf_generated = true;
      } else if (exportType === 'docx') {
        updateData.docx_generated = true;
      }

      const { error } = await supabase
        .from('user_resumes')
        .update(updateData)
        .eq('id', resumeId);

      if (error) {
        console.error('Error updating resume export:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in updateResumeExport:', error);
      return false;
    }
  }

  /**
   * Check if user can generate more resumes
   */
  async canGenerateResume(): Promise<boolean> {
    const accessStatus = await this.getUserAccessStatus();
    return accessStatus?.has_access || false;
  }

  /**
   * Get formatted subscription status for UI display
   */
  async getSubscriptionStatusDisplay(): Promise<{
    status: string;
    message: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    showUpgrade: boolean;
  }> {
    const accessStatus = await this.getUserAccessStatus();

    if (!accessStatus || accessStatus.status === 'none') {
      return {
        status: 'No Plan',
        message: 'Choose a plan to start generating resumes',
        variant: 'outline',
        showUpgrade: true
      };
    }

    if (accessStatus.status === 'expired') {
      return {
        status: 'Expired',
        message: 'Your plan has expired. Renew to continue.',
        variant: 'destructive',
        showUpgrade: true
      };
    }

    if (accessStatus.has_access) {
      const remainingText = accessStatus.resumes_remaining === -1 
        ? 'Unlimited' 
        : `${accessStatus.resumes_remaining} remaining`;
      
      let expiryText = '';
      if (accessStatus.expires_at) {
        const expiryDate = new Date(accessStatus.expires_at);
        const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        expiryText = ` (${daysLeft} days left)`;
      }

      return {
        status: accessStatus.product_name || 'Active Plan',
        message: `${remainingText}${expiryText}`,
        variant: 'default',
        showUpgrade: false
      };
    }

    return {
      status: 'Limited Access',
      message: 'Upgrade your plan for more features',
      variant: 'secondary',
      showUpgrade: true
    };
  }
}

let subscriptionServiceInstance: SupabaseSubscriptionService | null = null;

export const getSubscriptionService = (toast: ReturnType<typeof useToast>['toast']) => {
  if (!subscriptionServiceInstance) {
    subscriptionServiceInstance = new SupabaseSubscriptionService(toast);
  }
  return subscriptionServiceInstance;
};

export const subscriptionService = {
  getInstance: (toast: ReturnType<typeof useToast>['toast']) => getSubscriptionService(toast)
};
