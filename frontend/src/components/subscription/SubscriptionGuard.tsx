import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Crown, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: 'resume_creation' | 'resume_export' | 'ai_optimization';
  fallback?: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  feature = 'resume_creation',
  fallback 
}) => {
  const { 
    subscriptionStatus, 
    canCreateResume, 
    canExportResume, 
    getRemainingResumes,
    isExpiringSoon,
    getDaysUntilExpiry 
  } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check access based on feature
  const hasAccess = () => {
    switch (feature) {
      case 'resume_creation':
        return canCreateResume();
      case 'resume_export':
        return canExportResume();
      case 'ai_optimization':
        return canCreateResume(); // Same as creation for now
      default:
        return canCreateResume();
    }
  };

  const handleUpgrade = () => {
    toast({
      title: "Redirecting to pricing",
      description: "Choose a plan that fits your needs",
    });
    navigate('/pricing');
  };

  // If user has access, render children
  if (hasAccess()) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default access denied UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-xl text-slate-900 dark:text-white">
            Subscription Required
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {feature === 'resume_creation' && 'You need an active subscription to create resumes.'}
              {feature === 'resume_export' && 'You need an active subscription to export resumes.'}
              {feature === 'ai_optimization' && 'You need an active subscription to use AI optimization.'}
            </p>
            
            {subscriptionStatus && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Current Status:</span>
                  <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                    {subscriptionStatus.status === 'expired' ? 'Expired' : 'No Plan'}
                  </Badge>
                </div>
                
                {subscriptionStatus.plan_type === 'single' && subscriptionStatus.status === 'active' && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600 dark:text-slate-300">Resumes Remaining:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {getRemainingResumes()}
                    </span>
                  </div>
                )}
                
                {subscriptionStatus.expires_at && subscriptionStatus.status === 'expired' && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600 dark:text-slate-300">Expired:</span>
                    <span className="text-red-600 text-xs">
                      {new Date(subscriptionStatus.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              size="lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              View Pricing Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            <p>Choose from our flexible plans:</p>
            <div className="flex justify-center gap-4 mt-2">
              <span>€1 Single</span>
              <span>€4 / 10 days</span>
              <span>€9 / month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Subscription status banner component for showing warnings
export const SubscriptionBanner: React.FC = () => {
  const { 
    subscriptionStatus, 
    isExpiringSoon, 
    getDaysUntilExpiry, 
    getRemainingResumes 
  } = useSubscription();
  const navigate = useNavigate();

  if (!subscriptionStatus?.has_access) return null;

  const showWarning = isExpiringSoon() || 
    (subscriptionStatus.plan_type === 'single' && getRemainingResumes() <= 1);

  if (!showWarning) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {subscriptionStatus.plan_type === 'single' ? (
              `${getRemainingResumes()} resume${getRemainingResumes() !== 1 ? 's' : ''} remaining`
            ) : (
              `Your plan expires in ${getDaysUntilExpiry()} day${getDaysUntilExpiry() !== 1 ? 's' : ''}`
            )}
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            Renew now to continue creating professional resumes
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={() => navigate('/pricing')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Renew
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionGuard;
