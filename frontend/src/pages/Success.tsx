import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationHeader from '@/components/NavigationHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getSubscriptionService } from '@/lib/supabase-subscriptions';

interface PlanConfig {
  name: string;
  description: string;
  credits?: number;
  days?: number;
  features: string[];
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  single: {
    name: 'Single Resume',
    description: 'One professional resume generation',
    credits: 1,
    features: [
      'AI-generated professional resume',
      'ATS-optimized format',
      'PDF & Word download',
      'One-time access'
    ]
  },
  '10days': {
    name: '10 Days Access',
    description: 'Unlimited resume generation for 10 days',
    days: 10,
    features: [
      'Unlimited resume generation',
      'AI-powered content optimization',
      'PDF & Word downloads',
      '10 days full access',
      'Professional ATS format'
    ]
  },
  monthly: {
    name: '30-Day Pro Pass',
    description: 'Unlimited resume creation for 30 days',
    days: 30,
    features: [
      'Everything in 10 Days Access',
      '30 days full access',
      'Unlimited resume creation',
      'Priority AI processing',
      'Premium tools access',
      'Email support'
    ]
  }
};

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planActivated, setPlanActivated] = useState<string | null>(null);

  // Get parameters - handle both our app params and Gumroad's actual redirect params
  const plan = searchParams.get('plan'); // Our app parameter
  const saleId = searchParams.get('sale_id'); // Gumroad sends this
  const productId = searchParams.get('product_id'); // Gumroad sends this
  const productPermalink = searchParams.get('product_permalink'); // Gumroad product permalink
  const email = searchParams.get('email'); // Gumroad sends customer email
  
  // Map Gumroad product permalinks to our plan types
  const permalinkToPlan: Record<string, string> = {
    'resume-single': 'single',
    '10daypass': '10days',
    'novaecv-monthly': 'monthly'
  };
  
  useEffect(() => {
    const processPurchase = async () => {
      try {
        console.log('🎯 Processing Gumroad purchase redirect');
        console.log('App Plan:', plan);
        console.log('Gumroad Sale ID:', saleId);
        console.log('Gumroad Product ID:', productId);
        console.log('Gumroad Product Permalink:', productPermalink);
        console.log('Gumroad Email:', email);
        console.log('User:', user?.email);

        // Determine plan from either our app parameter or Gumroad's permalink
        let determinedPlan = plan;
        if (!determinedPlan && productPermalink) {
          determinedPlan = permalinkToPlan[productPermalink];
          console.log('✅ Mapped Gumroad permalink to plan:', productPermalink, '→', determinedPlan);
        }

        // Validate user authentication
        if (!user) {
          console.log('❌ No user authenticated, redirecting to auth');
          
          // If Gumroad sent email, we can try to match or create account
          if (email) {
            console.log('💡 Gumroad provided email:', email);
            toast({
              title: "Sign in to activate purchase",
              description: `Please sign in with ${email} to activate your purchase.`,
            });
          } else {
            toast({
              title: "Authentication required",
              description: "Please sign in to activate your purchase.",
              variant: "destructive",
            });
          }
          
          // Store the plan and email in localStorage to activate after login
          if (determinedPlan) {
            localStorage.setItem('pending_activation_plan', determinedPlan);
            localStorage.setItem('pending_activation_sale_id', saleId || '');
            localStorage.setItem('pending_activation_email', email || '');
            localStorage.setItem('pending_activation_permalink', productPermalink || '');
          }
          
          navigate('/auth', { 
            state: { 
              from: `/success?plan=${determinedPlan}`,
              message: "Please sign in to activate your purchase",
              email: email
            }
          });
          return;
        }

        // Check for pending activation (user came back after login)
        const pendingPlan = localStorage.getItem('pending_activation_plan');
        const pendingSaleId = localStorage.getItem('pending_activation_sale_id');
        const pendingEmail = localStorage.getItem('pending_activation_email');
        
        const activationPlan = determinedPlan || pendingPlan;
        const activationSaleId = saleId || pendingSaleId || `gumroad_${Date.now()}`;

        // Validate plan parameter
        if (!activationPlan || !PLAN_CONFIGS[activationPlan]) {
          setError(`Invalid plan: ${activationPlan || 'missing'}`);
          console.error('❌ Invalid plan:', activationPlan);
          return;
        }

        console.log('✅ Using plan:', activationPlan);
        console.log('✅ Using sale ID:', activationSaleId);

        const planConfig = PLAN_CONFIGS[activationPlan];
        const subscriptionService = getSubscriptionService(toast);

        // Map plan to product ID
        const productIdMap: Record<string, string> = {
          'single': 'single_resume',
          '10days': '10day_access',
          'monthly': 'monthly_subscription'
        };

        const mappedProductId = productIdMap[activationPlan];
        if (!mappedProductId) {
          setError(`Unknown product for plan: ${activationPlan}`);
          console.error('❌ Unknown product for plan:', activationPlan);
          return;
        }

        // Determine price based on plan
        const prices: Record<string, number> = {
          'single': 100,    // €1 in cents
          '10days': 400,    // €4 in cents
          'monthly': 900    // €9 in cents
        };

        const price = prices[activationPlan] || 0;

        console.log('💾 Creating subscription in Supabase...');
        console.log('Product ID:', mappedProductId);
        console.log('Sale ID:', activationSaleId);
        console.log('Price:', price);

        // Create subscription in Supabase
        const subscriptionId = await subscriptionService.createSubscription(
          mappedProductId,
          activationSaleId,
          price
        );

        if (subscriptionId) {
          console.log('✅ Subscription created successfully:', subscriptionId);
          setPlanActivated(activationPlan);
          
          toast({
            title: "Purchase activated! 🎉",
            description: `Your ${planConfig.name} is now active and ready to use.`,
            duration: 5000,
          });

          // Clear all stored data since purchase is complete
          localStorage.removeItem('resumeFormData');
          localStorage.removeItem('selectedProductId');
          localStorage.removeItem('pending_activation_plan');
          localStorage.removeItem('pending_activation_sale_id');
          localStorage.removeItem('pending_activation_email');
          localStorage.removeItem('pending_activation_permalink');
        } else {
          throw new Error('Failed to activate subscription');
        }

      } catch (error) {
        console.error('Error processing purchase:', error);
        setError("Failed to activate your purchase. Please contact support with your order details.");
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [user, plan, saleId, productId, productPermalink, email, toast, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGenerateResume = () => {
    navigate('/form-selection');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container py-16 text-center">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Activating Your Purchase...
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Please wait while we verify your payment and set up your account.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container py-16 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Activation Error
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const planConfig = planActivated ? PLAN_CONFIGS[planActivated] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
          
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Purchase Activated!
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Thank you for your purchase! Your {planConfig?.name} is now active.
          </p>

          {/* Purchase Summary Card */}
          {planConfig && (
            <Card className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {planConfig.name} Activated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    {planConfig.description}
                  </p>
                  
                  {planConfig.credits && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Credits: {planConfig.credits} resume generation
                      </p>
                    </div>
                  )}
                  
                  {planConfig.days && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Access: {planConfig.days} days unlimited
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      What's included:
                    </h4>
                    {planConfig.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={handleGenerateResume} className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Your Resume
            </Button>
            
            <Button size="lg" variant="outline" onClick={handleGoToDashboard}>
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;

