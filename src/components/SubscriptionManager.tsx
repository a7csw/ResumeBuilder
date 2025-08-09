import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserPlan } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubscriptionManager = () => {
  const { userPlan, loading, checkUserPlan } = useUserPlan();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [manageLoading, setManageLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!userPlan.isActive) {
      // Redirect to pricing if not subscribed
      navigate('/pricing');
      return;
    }

    setManageLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      window.open(data.url, '_blank');
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Unable to open subscription management portal.",
        variant: "destructive"
      });
    } finally {
      setManageLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic Plan';
      case 'ai': return 'AI Plan';
      case 'pro': return 'Monthly Plan';
      default: return 'Free Plan';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ai': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'pro': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Plan</span>
            <Badge className={getPlanColor(userPlan.plan)}>
              {getPlanDisplayName(userPlan.plan)}
            </Badge>
          </div>

          {userPlan.isActive && userPlan.expiresAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expires On</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(userPlan.expiresAt)}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={userPlan.isActive ? "default" : "secondary"}>
              {userPlan.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Features Based on Plan */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Plan Features</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {userPlan.plan === 'free' && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  Preview only - No downloads
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  Limited template access
                </div>
              </>
            )}
            
            {userPlan.plan === 'basic' && (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ Basic templates access
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ PDF downloads
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ 10 days access
                </div>
              </>
            )}

            {userPlan.plan === 'ai' && (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ All templates (Basic + Premium)
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ AI assistance
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ PDF downloads
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ 10 days access
                </div>
              </>
            )}

            {userPlan.plan === 'pro' && (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ Everything in AI plan
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ Unlimited downloads
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ Premium support
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ Monthly renewal
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleManageSubscription}
            disabled={manageLoading}
            className="w-full"
            variant={userPlan.isActive ? "outline" : "default"}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {manageLoading ? "Loading..." : 
             userPlan.isActive ? "Manage Subscription" : "Choose a Plan"}
          </Button>

          {userPlan.isActive && (
            <Button 
              onClick={checkUserPlan}
              variant="ghost" 
              size="sm"
              className="w-full"
            >
              Refresh Status
            </Button>
          )}
        </div>

        {!userPlan.isActive && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Upgrade to unlock premium templates, AI assistance, and download capabilities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;