import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NavigationHeader from "@/components/NavigationHeader";
import { supabase } from "@/integrations/supabase/client";
import { initiateLemonSqueezyCheckout } from "@/lib/lemonsqueezy";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Crown,
  Zap,
  Clock,
  Infinity
} from "lucide-react";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      subtitle: "Perfect for quick projects",
      price: "$5",
      period: "for 10 days",
      description: "Get started with essential resume building features",
      features: [
        "1 AI-generated resume",
        "3 professional templates",
        "PDF download",
        "Basic customization",
        "Email support",
        "NovaCV watermark"
      ],
      buttonText: "Start Basic",
      popular: false,
      planId: "basic",
      gradient: "from-slate-600 to-gray-600",
      icon: <Zap className="w-12 h-12" />
    },
    {
      id: "pro",
      name: "Professional Plan",
      subtitle: "For serious professionals",
      price: "$11",
      period: "per month",
      description: "Everything you need to create outstanding resumes",
      features: [
        "Unlimited AI-generated resumes",
        "20+ premium templates",
        "Advanced AI optimization",
        "Multiple format exports (PDF, DOCX)",
        "No watermarks",
        "Priority support",
        "ATS optimization",
        "Resume analytics",
        "Custom styling options",
        "Unlimited revisions"
      ],
      buttonText: "Go Professional",
      popular: true,
      planId: "pro",
      gradient: "from-slate-600 to-gray-600",
      icon: <Crown className="w-12 h-12" />
    }
  ];

  const handleSelectPlan = (planId: "basic" | "pro") => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (planId: "basic" | "pro") => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate(`/auth?redirect=pricing`);
        return;
      }

      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      await initiateLemonSqueezyCheckout(
        planId,
        user.email || undefined,
        user.user_metadata?.full_name || user.user_metadata?.name || undefined,
        user.id
      );
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: "Payment Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container px-6 mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Start with our basic plan for quick projects or go professional for unlimited access to all features.
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up ${
                  plan.popular 
                    ? 'ring-4 ring-slate-500 dark:ring-slate-400 shadow-2xl scale-105 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20' 
                    : 'hover:shadow-xl bg-white dark:bg-slate-800'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-6 py-2 text-sm font-medium shadow-lg">
                      <Star className="w-4 h-4 mr-2" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan Duration Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="text-xs">
                    {plan.id === "basic" ? (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        10 Days
                      </>
                    ) : (
                      <>
                        <Infinity className="w-3 h-3 mr-1" />
                        Monthly
                      </>
                    )}
                  </Badge>
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50 text-slate-600 dark:text-slate-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                } hover:scale-110 transition-transform duration-300`}>
                  {plan.icon}
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm font-medium mb-4 text-slate-600 dark:text-slate-400">
                    {plan.subtitle}
                  </p>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id as "basic" | "pro")}
                  className={`w-full py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-12 animate-fade-in-up delay-600">
            <h3 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-white">
              Why Choose Professional?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
                <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Advanced AI</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Get intelligent suggestions for content, formatting, and optimization
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
                <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Premium Templates</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Access to 20+ professional templates designed by experts
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
                <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">ATS Optimized</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Ensure your resume passes through Applicant Tracking Systems
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="text-center animate-fade-in-up delay-800">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="text-left">
                <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Can I upgrade my plan?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Yes! You can upgrade from Basic to Professional at any time. The remaining days from your Basic plan will be prorated.
                </p>
              </div>
              <div className="text-left">
                <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">What happens after 10 days?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  After 10 days, your Basic plan expires. You can upgrade to Professional for unlimited access or purchase another Basic plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;