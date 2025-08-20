import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Crown, CreditCard, Calendar, ArrowRight, Settings, CheckCircle } from "lucide-react";

interface ProfileSubscriptionCardProps {
  userPlan: any;
}

const ProfileSubscriptionCard = ({ userPlan }: ProfileSubscriptionCardProps) => {
  const navigate = useNavigate();

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
      case 'basic': return '$5 for 10 days';
      case 'pro': return '$11 per month';
      default: return 'Free';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-gradient-to-r from-slate-600 to-gray-600 text-white';
      case 'basic': return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
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

  const isSubscribed = userPlan?.isActive && (userPlan?.plan === 'basic' || userPlan?.plan === 'pro');

  const handleButtonClick = () => {
    if (isSubscribed) {
      // Navigate to subscription details page
      navigate('/subscription-details');
    } else {
      // Navigate to pricing page
      navigate('/pricing');
    }
  };

  return (
    <Card className="shadow-lg border-slate-200 dark:border-slate-700 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-200/30 to-gray-200/30 dark:from-slate-700/30 dark:to-gray-700/30 rounded-full blur-3xl"></div>
      
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 relative">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Crown className="h-5 w-5" />
          Subscription
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6 relative">
        {/* Current Plan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Plan</span>
            <Badge className={`px-3 py-1 ${getPlanColor(userPlan?.plan || 'free')}`}>
              {getPlanDisplayName(userPlan?.plan || 'free')}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Price</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {getPlanPrice(userPlan?.plan || 'free')}
            </span>
          </div>

          {isSubscribed && userPlan?.expiresAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {userPlan.plan === 'basic' ? 'Expires On' : 'Renews On'}
              </span>
              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="w-3 h-3" />
                {formatDate(userPlan.expiresAt)}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Active Subscription
              </span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                No active subscription
              </span>
            </>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {isSubscribed ? 'Your Benefits' : 'Upgrade Benefits'}
          </h4>
          <div className="space-y-2">
            {userPlan?.plan === 'pro' && (
              <>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  Unlimited AI generations
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  20+ premium templates
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  No watermarks
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  Priority support
                </div>
              </>
            )}
            
            {userPlan?.plan === 'basic' && (
              <>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  1 AI generation
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  3 professional templates
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  PDF download
                </div>
              </>
            )}

            {!isSubscribed && (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="w-3 h-3 border border-slate-300 dark:border-slate-600 rounded-full"></div>
                  AI-powered resume generation
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="w-3 h-3 border border-slate-300 dark:border-slate-600 rounded-full"></div>
                  Professional templates
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="w-3 h-3 border border-slate-300 dark:border-slate-600 rounded-full"></div>
                  Download capabilities
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleButtonClick}
          className={`w-full transition-all duration-200 ${
            isSubscribed 
              ? 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white'
              : 'bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-800 hover:to-gray-800 text-white'
          }`}
        >
          {isSubscribed ? (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Manage Subscription
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Choose a Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {!isSubscribed && (
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unlock premium features and create professional resumes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSubscriptionCard;
