import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  Settings,
  Download,
  Sparkles,
  Shield,
  AlertCircle
} from "lucide-react";

const SubscriptionDetails = () => {
  const { userPlan, isLoading } = useUserPlan();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();
  }, [navigate]);

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic Plan';
      case 'pro': return 'Professional Plan';
      case 'free': return 'Free Plan';
      default: return 'Free Plan';
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'basic': return '$5.00';
      case 'pro': return '$11.00';
      default: return 'Free';
    }
  };

  const getPlanDuration = (plan: string) => {
    switch (plan) {
      case 'basic': return '10 days';
      case 'pro': return 'monthly';
      default: return 'forever';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleManageSubscription = () => {
    toast({
      title: "Lemon Squeezy Subscription",
      description: "Please check your email for subscription management links or contact support.",
      variant: "default"
    });
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const isSubscribed = userPlan?.isActive && (userPlan?.plan === 'basic' || userPlan?.plan === 'pro');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
        </div>
      </div>
    );
  }

  // Redirect to pricing if not subscribed
  if (!isSubscribed) {
    navigate('/pricing');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Subscription Details
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your NovaCV subscription
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Plan Card */}
          <Card className="shadow-lg border-slate-200 dark:border-slate-700">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800">
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-slate-600" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Plan Badge */}
              <div className="text-center">
                <Badge className={`px-4 py-2 text-base font-semibold ${
                  userPlan.plan === 'pro' 
                    ? 'bg-gradient-to-r from-slate-600 to-gray-600 text-white'
                    : 'bg-gradient-to-r from-slate-500 to-gray-500 text-white'
                }`}>
                  {userPlan.plan === 'pro' ? (
                    <Crown className="w-4 h-4 mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {getPlanDisplayName(userPlan.plan)}
                </Badge>
              </div>

              {/* Plan Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Price</span>
                  <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {getPlanPrice(userPlan.plan)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Billing</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {getPlanDuration(userPlan.plan)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Status</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                </div>

                {userPlan.expiresAt && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {userPlan.plan === 'basic' ? 'Expires' : 'Renews'}
                    </span>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(userPlan.expiresAt)}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  onClick={handleManageSubscription}
                  className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage with Lemon Squeezy
                </Button>

                {userPlan.plan === 'basic' && (
                  <Button 
                    onClick={handleUpgrade}
                    variant="outline"
                    className="w-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="shadow-lg border-slate-200 dark:border-slate-700">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Your Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {userPlan.plan === 'pro' && (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          Unlimited AI Generations
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Create as many resumes as you need
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          20+ Premium Templates
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Access to all professional templates
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          No Watermarks
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Clean, professional downloads
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          Priority Support
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Get help when you need it
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          Resume Analytics
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Track your resume performance
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {userPlan.plan === 'basic' && (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          1 AI Generation
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Perfect for a single resume
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          3 Professional Templates
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Choose from quality designs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          PDF Download
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          High-quality resume downloads
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          Email Support
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Get help when you need it
                        </p>
                      </div>
                    </div>

                    {/* Upgrade CTA for Basic users */}
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          Want more?
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Upgrade to Pro for unlimited generations, more templates, and premium features.
                      </p>
                      <Button 
                        onClick={handleUpgrade}
                        size="sm"
                        className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
                      >
                        Upgrade to Pro
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-8 shadow-lg border-slate-200 dark:border-slate-700">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Billing Questions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  For billing inquiries, refunds, or payment issues, please contact Lemon Squeezy support 
                  directly through the manage subscription link above.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Product Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Need help with resume creation or have questions about features? 
                  Contact our support team at support@novacv.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
