import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, FileText, ArrowLeft, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  gumroadUrl: string | undefined;
  isPopular?: boolean;
  badge?: string;
  icon: React.ReactNode;
}

const PlanSelection = () => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [envVarsLoaded, setEnvVarsLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get form data from navigation state (optional for pricing page)
  const { formData } = location.state || {};
  const isFromForm = !!formData;

  // Import Gumroad product URLs from environment variables
  const singleResumeUrl = import.meta.env.VITE_GUMROAD_SINGLE_RESUME_URL;
  const tenDayPassUrl = import.meta.env.VITE_GUMROAD_10DAY_ACCESS_URL;
  const monthlyAccessUrl = import.meta.env.VITE_GUMROAD_MONTHLY_ACCESS_URL;

  // Check environment variables and log status
  useEffect(() => {
    console.log('🚀 PlanSelection component mounted');
    console.log('🔗 Gumroad URLs Configuration:');
    console.log('Single Resume URL:', singleResumeUrl || '❌ MISSING');
    console.log('10-Day Pass URL:', tenDayPassUrl || '❌ MISSING');
    console.log('Monthly Access URL:', monthlyAccessUrl || '❌ MISSING');
    
    // Debug all environment variables
    console.log('🔍 All import.meta.env variables:');
    console.log('VITE_GUMROAD_SINGLE_RESUME_URL:', import.meta.env.VITE_GUMROAD_SINGLE_RESUME_URL);
    console.log('VITE_GUMROAD_10DAY_ACCESS_URL:', import.meta.env.VITE_GUMROAD_10DAY_ACCESS_URL);
    console.log('VITE_GUMROAD_MONTHLY_ACCESS_URL:', import.meta.env.VITE_GUMROAD_MONTHLY_ACCESS_URL);
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Missing');
    
    console.log('Environment variables status:', {
      VITE_GUMROAD_SINGLE_RESUME_URL: singleResumeUrl ? '✅ Set' : '❌ Missing',
      VITE_GUMROAD_10DAY_ACCESS_URL: tenDayPassUrl ? '✅ Set' : '❌ Missing',
      VITE_GUMROAD_MONTHLY_ACCESS_URL: monthlyAccessUrl ? '✅ Set' : '❌ Missing'
    });

    // Check if any URLs are missing
    const missingUrls = [];
    if (!singleResumeUrl) missingUrls.push('VITE_GUMROAD_SINGLE_RESUME_URL');
    if (!tenDayPassUrl) missingUrls.push('VITE_GUMROAD_10DAY_ACCESS_URL');
    if (!monthlyAccessUrl) missingUrls.push('VITE_GUMROAD_MONTHLY_ACCESS_URL');

    if (missingUrls.length > 0) {
      console.warn('⚠️ Missing environment variables:', missingUrls);
      console.warn('Please add these to your .env.local file in the frontend directory');
      console.warn('Current .env.local should contain:');
      console.warn('VITE_GUMROAD_SINGLE_RESUME_URL=https://alfaiadiabood.gumroad.com/l/resume-single');
      console.warn('VITE_GUMROAD_10DAY_ACCESS_URL=https://alfaiadiabood.gumroad.com/l/10daypass');
      console.warn('VITE_GUMROAD_MONTHLY_ACCESS_URL=https://alfaiadiabood.gumroad.com/l/novaecv-monthly');
    } else {
      console.log('✅ All Gumroad URLs are configured correctly!');
    }

    // Simulate loading time for environment variables
    const timer = setTimeout(() => {
      setEnvVarsLoaded(true);
      setIsLoading(false);
      console.log('✅ Environment variables loaded and validated');
    }, 500);

    return () => clearTimeout(timer);
  }, [singleResumeUrl, tenDayPassUrl, monthlyAccessUrl]);

  // Define plans with environment variables
  const plans: Plan[] = [
    {
      id: 'single',
      name: 'Single Resume',
      price: 1,
      currency: '€',
      description: 'Perfect for one-time use',
      badge: 'One-time',
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      gumroadUrl: singleResumeUrl,
      features: [
        'AI-generated professional resume',
        'ATS-optimized format',
        'PDF & Word download',
        'One-time access',
        'Professional template'
      ]
    },
    {
      id: '10days',
      name: '10 Days Access',
      price: 4,
      currency: '€',
      description: 'Unlimited resumes for 10 days',
      badge: 'Most Popular',
      isPopular: true,
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      gumroadUrl: tenDayPassUrl,
      features: [
        'Unlimited resume generation',
        'AI-powered content optimization',
        'PDF & Word downloads',
        '10 days full access',
        'Professional ATS format',
        'Priority support'
      ]
    },
    {
      id: 'monthly',
      name: '30-Day Pro Pass',
      price: 9,
      currency: '€',
      description: 'Maximum value for serious job seekers',
      badge: 'Best Value',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      gumroadUrl: monthlyAccessUrl,
      features: [
        'Everything in 10 Days Access',
        '30 days full access',
        'Unlimited resume creation',
        'Priority AI processing',
        'Premium tools access',
        'Email support',
        'Career guidance'
      ]
    }
  ];

  const handlePlanSelect = async (plan: Plan) => {
    console.log('🎯 Plan selected:', plan.id, '-', plan.name);
    console.log('💰 Price:', plan.currency + plan.price);
    console.log('🔗 Using URL:', plan.gumroadUrl || '❌ URL NOT SET');
    
    if (!plan.gumroadUrl) {
      console.error('❌ Plan URL not available for:', plan.id);
      console.error('Missing environment variable for this plan');
      toast({
        title: "Plan not available",
        description: "This plan is currently not configured. Please check environment variables.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(plan.id);
      console.log('⚡ Processing plan selection for:', plan.id);

      toast({
        title: "Redirecting to checkout...",
        description: `Opening secure payment for ${plan.name}`,
      });

      // Store form data if coming from form
      if (isFromForm && formData) {
        console.log('💾 Storing form data for post-purchase');
        localStorage.setItem('resumeFormData', JSON.stringify(formData));
        localStorage.setItem('selectedProductId', plan.id);
      }

      // Build redirect URL with success callback
      const redirectUrl = `${window.location.origin}/success?plan=${plan.id}`;
      const gumroadUrlWithRedirect = `${plan.gumroadUrl}${plan.gumroadUrl.includes('?') ? '&' : '?'}wanted=true&redirect_url=${encodeURIComponent(redirectUrl)}`;
      
      console.log('🚀 Redirecting to Gumroad URL:', gumroadUrlWithRedirect);
      console.log('🔄 Success redirect will go to:', redirectUrl);
      
      // Redirect to Gumroad with success URL
      window.location.href = gumroadUrlWithRedirect;

    } catch (error) {
      console.error('❌ Error selecting plan:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleBack = () => {
    if (isFromForm) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container px-4 sm:px-6 py-8 mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-8">
              Pricing Plans
            </h1>
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Loading pricing plans...
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Checking environment configuration
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container px-4 sm:px-6 py-8 mx-auto max-w-6xl">
        {/* Simple title for verification */}
        <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Pricing Plans
        </h1>
        
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 mx-auto text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            {isFromForm ? 'Back to Form' : 'Back to Home'}
          </Button>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Select a plan to generate your professional, ATS-optimized resume with AI-powered content optimization.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-xl transition-all duration-300 ${
                plan.isPopular 
                  ? 'border-primary shadow-lg scale-105 ring-2 ring-primary/20' 
                  : 'hover:scale-105'
              } bg-white dark:bg-slate-800`}
            >
              {plan.badge && (
                <Badge 
                  className={`absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 ${
                    plan.isPopular 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-700">
                    {plan.icon}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                
                <div className="text-4xl font-bold text-primary mb-2">
                  {plan.currency}{plan.price}
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* Plan availability check */}
                {plan.gumroadUrl ? (
                  <Button 
                    className={`w-full ${
                      plan.isPopular 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                        : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isProcessing === plan.id}
                  >
                    {isProcessing === plan.id ? (
                      'Redirecting...'
                    ) : (
                      <>
                        Get {plan.name}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">Plan not available</span>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Configuration missing. Please contact support.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
            What you get with every plan:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">AI-Powered</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Content optimization</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">ATS Format</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Professional layout</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ExternalLink className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Multiple Formats</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">PDF & Word downloads</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Check className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Instant Access</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Generate immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            🔒 Secure payment processing • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
