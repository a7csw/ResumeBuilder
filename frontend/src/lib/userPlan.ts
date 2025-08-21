import { supabase } from '@/integrations/supabase/client';
import { getPlanById, calculatePlanExpiry, isPlanActive, getPlanLimits } from './pricing';
import type { Database } from '@/integrations/supabase/types';

type UserPlan = Database['public']['Tables']['user_plans']['Row'];
type UserPlanInsert = Database['public']['Tables']['user_plans']['Insert'];
type UserPlanUpdate = Database['public']['Tables']['user_plans']['Update'];

export interface UserPlanInfo {
  id: string;
  planType: string;
  isActive: boolean;
  expiresAt: string | null;
  aiCallsUsed: number;
  aiCallsLimit: number | null;
  canRefund: boolean;
  priceId: string | null;
  pricePaid: number | null;
}

export class UserPlanService {
  
  // Get user's current plan
  static async getUserPlan(userId: string): Promise<UserPlanInfo | null> {
    const { data, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      planType: data.plan_type,
      isActive: isPlanActive(data.expires_at),
      expiresAt: data.expires_at,
      aiCallsUsed: data.ai_calls_used || 0,
      aiCallsLimit: data.ai_calls_limit,
      canRefund: data.can_refund || false,
      priceId: data.price_id,
      pricePaid: data.price_paid
    };
  }

  // Create a new user plan
  static async createUserPlan(
    userId: string, 
    planId: string, 
    priceId: string,
    pricePaid: number,
    lemonCustomerId?: string,
    lemonOrderId?: string
  ): Promise<UserPlanInfo> {
    
    const plan = getPlanById(planId);
    if (!plan) {
      throw new Error(`Invalid plan ID: ${planId}`);
    }

    const limits = getPlanLimits(planId);
    const expiresAt = calculatePlanExpiry(planId);

    // Deactivate any existing plans
    await this.deactivateUserPlans(userId);

    const planData: UserPlanInsert = {
      user_id: userId,
      plan_type: planId,
      price_id: priceId,
      price_paid: pricePaid,
      is_active: true,
      starts_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      ai_calls_limit: limits?.aiGenerations === -1 ? null : limits?.aiGenerations || 0,
      ai_calls_used: 0,
      can_refund: true,
      security_alerts_enabled: true
    };

    const { data, error } = await supabase
      .from('user_plans')
      .insert(planData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user plan: ${error.message}`);
    }

    return {
      id: data.id,
      planType: data.plan_type,
      isActive: true,
      expiresAt: data.expires_at,
      aiCallsUsed: 0,
      aiCallsLimit: data.ai_calls_limit,
      canRefund: true,
      priceId: data.price_id,
      pricePaid: data.price_paid
    };
  }

  // Update user plan (e.g., increment AI calls)
  static async updateUserPlan(planId: string, updates: UserPlanUpdate): Promise<boolean> {
    const { error } = await supabase
      .from('user_plans')
      .update(updates)
      .eq('id', planId);

    return !error;
  }

  // Increment AI calls used
  static async incrementAICalls(userId: string): Promise<boolean> {
    const userPlan = await this.getUserPlan(userId);
    if (!userPlan || !userPlan.isActive) {
      throw new Error('No active plan found');
    }

    // Check if user has remaining AI calls
    if (userPlan.aiCallsLimit !== null && userPlan.aiCallsUsed >= userPlan.aiCallsLimit) {
      throw new Error('AI generation limit reached for current plan');
    }

    const { error } = await supabase
      .from('user_plans')
      .update({ 
        ai_calls_used: userPlan.aiCallsUsed + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userPlan.id);

    return !error;
  }

  // Check if user can use AI features
  static async canUseAI(userId: string): Promise<boolean> {
    const userPlan = await this.getUserPlan(userId);
    if (!userPlan || !userPlan.isActive) {
      return false;
    }

    // Unlimited AI calls for pro plan
    if (userPlan.aiCallsLimit === null) {
      return true;
    }

    // Check if user has remaining calls
    return userPlan.aiCallsUsed < userPlan.aiCallsLimit;
  }

  // Deactivate all user plans (when upgrading/canceling)
  static async deactivateUserPlans(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_plans')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_active', true);

    return !error;
  }

  // Mark plan as non-refundable (after first export)
  static async markNonRefundable(userId: string): Promise<boolean> {
    const userPlan = await this.getUserPlan(userId);
    if (!userPlan) return false;

    const { error } = await supabase
      .from('user_plans')
      .update({ 
        can_refund: false,
        first_export_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userPlan.id);

    return !error;
  }

  // Get plan usage statistics
  static async getPlanUsage(userId: string): Promise<{
    aiCallsUsed: number;
    aiCallsLimit: number | null;
    exportsCount: number;
    daysRemaining: number | null;
  } | null> {
    const userPlan = await this.getUserPlan(userId);
    if (!userPlan) return null;

    // Get export count
    const { count: exportsCount } = await supabase
      .from('export_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Calculate days remaining
    let daysRemaining = null;
    if (userPlan.expiresAt) {
      const expiry = new Date(userPlan.expiresAt);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      aiCallsUsed: userPlan.aiCallsUsed,
      aiCallsLimit: userPlan.aiCallsLimit,
      exportsCount: exportsCount || 0,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0
    };
  }
}
