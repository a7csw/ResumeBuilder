import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, ArrowRight, Zap, Crown, CreditCard } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: 'single' | '10days' | 'monthly';
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  icon: React.ReactNode;
  features: string[];
  isPopular?: boolean;
  gumroadUrl: string;
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'secondary';
}

const PricingPage = () => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans: PricingPlan[] = [
    {
      id: 'single',
      name: 'Single Resume',
      description: 'Perfect for one-time use',
      price: 1,
      currency: '€',
      duration: 'One-time',
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
      features: [
        '1 AI-generated resume',
        'ATS-optimized format',
        'PDF & Word download',
        'Professional template',
        'Instant access'
      ],
      gumroadUrl: import.meta.env.VITE_GUMROAD_SINGLE || 'https://gum.co/single-resume',
      buttonText: 'Get Single Resume',
      buttonVariant: 'outline'
    },
    {
      id: '10days',
      name: '10 Days Access',
      description: 'Best value for job seekers',
      price: 4,
      currency: '€',
      duration: '10 days',
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      features: [
        'Unlimited resume generation',
        'AI-powered optimization',
        'Multiple templates',
        'PDF & Word downloads',
        '10 days full access',
        'Email support'
      ],
      isPopular: true,
      gumroadUrl: import.meta.env.VITE_GUMROAD_10DAYS || 'https://gum.co/10day-access',
      buttonText: 'Start 10-Day Access',
      buttonVariant: 'default'
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      description: 'For ongoing career development',
      price: 9,
      currency: '€',
      duration: 'per month',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      features: [
        'Everything in 10 Days',
        'Monthly subscription',
        'Unlimited access',
        'Priority AI processing',
        'Advanced templates',
        'Priority support',
        'Career guidance'
      ],
      gumroadUrl: import.meta.env.VITE_GUMROAD_MONTHLY || 'https://gum.co/monthly-access',
      buttonText: 'Go Monthly',
      buttonVariant: 'outline'
    }
  ];

  const handlePurchase = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase a plan",
        variant: "destructive",
      });
      navigate('/auth', { state: { from: '/pricing' } });
      return;
    }

    setIsProcessing(plan.id);

    try {
      // Construct Gumroad URL with user ID
      const gumroadUrl = new URL(plan.gumroadUrl);
      gumroadUrl.searchParams.set('user_id', user.id);

      // Show processing toast
      toast({
        title: "Opening checkout...",
        description: `Redirecting to secure payment for ${plan.name}`,
      });

      // Open Gumroad in new tab
      const newWindow = window.open(gumroadUrl.toString(), '_blank');
      
      if (!newWindow) {
        toast({
          title: "Popup blocked",
          description: "Please allow popups and try again",
          variant: "destructive",
        });
        return;
      }

      // Optional: Listen for window close to refresh subscription status
      const checkClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkClosed);
          toast({
            title: "Checkout window closed",
            description: "If you completed your purchase, you should receive access shortly.",
          });
        }
      }, 1000);

      // Clean up interval after 5 minutes
      setTimeout(() => clearInterval(checkClosed), 5 * 60 * 1000);

    } catch (error) {
      console.error('Error opening checkout:', error);
      toast({
        title: "Checkout failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container px-4 sm:px-6 py-12 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent ml-3">
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Create professional, ATS-optimized resumes with AI-powered content optimization. 
            Choose the plan that fits your career goals.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id}
              className={`relative group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                plan.isPopular 
                  ? 'border-primary shadow-xl ring-2 ring-primary/20 bg-gradient-to-br from-white to-primary/5 dark:from-slate-800 dark:to-primary/10' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm'
              }`}
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 pt-8">
                <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover:scale-110 transition-transform duration-300">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {plan.description}
                </p>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {plan.currency}{plan.price}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      {plan.duration}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-center gap-3 text-sm"
                      style={{
                        animationDelay: `${(index * 150) + (featureIndex * 50)}ms`,
                        animation: 'fadeInLeft 0.4s ease-out forwards'
                      }}
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full group relative overflow-hidden transition-all duration-300 ${
                    plan.isPopular 
                      ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl' 
                      : ''
                  }`}
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => handlePurchase(plan)}
                  disabled={isProcessing === plan.id}
                >
                  {isProcessing === plan.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Opening checkout...
                    </>
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Why Choose Our Resume Builder?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-primary" />,
                title: "AI-Powered",
                description: "Advanced AI optimizes your content for maximum impact"
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "ATS-Optimized",
                description: "Beat applicant tracking systems with optimized formatting"
              },
              {
                icon: <Crown className="w-8 h-8 text-purple-500" />,
                title: "Professional",
                description: "Industry-standard templates trusted by recruiters"
              },
              {
                icon: <Check className="w-8 h-8 text-green-500" />,
                title: "Instant Results",
                description: "Generate and download your resume in minutes"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              🔒 Secure Payment Processing
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              All payments are processed securely through Gumroad. Your payment information is encrypted and protected.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@resumebuilder.com" className="text-primary hover:underline">
                support@resumebuilder.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;
