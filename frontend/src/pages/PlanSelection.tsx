import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
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

const PlanSelection = () => {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;

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
      bgGradient: "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
      iconBg: "bg-slate-100 dark:bg-slate-900/50",
      iconColor: "text-slate-600 dark:text-slate-400",
      popular: false
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
        "Multiple format exports (PDF, Word)",
        "No watermarks",
        "Priority support",
        "ATS optimization",
        "Resume analytics",
        "Custom styling options",
        "Unlimited revisions"
      ],
      buttonText: "Go Professional",
      bgGradient: "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
      iconBg: "bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50",
      iconColor: "text-slate-600 dark:text-slate-400",
      popular: true
    }
  ];

  const handleSelectPlan = (planId: "basic" | "pro") => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (selectedPlan && formData) {
      // Navigate to AI generation page
      navigate("/ai-generation", { 
        state: { 
          formData, 
          selectedPlan 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo={`/form/${formData?.type || 'professional'}`} />
      
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">
                <Star className="w-4 h-4" />
                Step 3 of 3
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                Choose Your Plan
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Both plans include AI generation! Start with Basic for quick projects or go Professional for unlimited access.
              </p>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.id as "basic" | "pro")}
                  className={`
                    group relative p-8 bg-gradient-to-br ${plan.bgGradient} rounded-3xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up
                    ${selectedPlan === plan.id 
                      ? 'ring-4 ring-slate-500 dark:ring-slate-400 shadow-2xl scale-105' 
                      : 'hover:shadow-xl'
                    }
                    ${plan.popular ? 'border-2 border-slate-500 dark:border-slate-400' : ''}
                  `}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan Duration Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {plan.id === "basic" ? (
                        <>
                          <Clock className="w-3 h-3" />
                          10 Days
                        </>
                      ) : (
                        <>
                          <Infinity className="w-3 h-3" />
                          Monthly
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedPlan === plan.id && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-slate-500 dark:bg-slate-400 rounded-full flex items-center justify-center animate-scale-in">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 ${plan.iconBg} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={plan.iconColor}>
                      {plan.id === "basic" ? (
                        <Zap className="w-12 h-12" />
                      ) : (
                        <Crown className="w-12 h-12" />
                      )}
                    </div>
                  </div>
                  
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-sm font-medium mb-4 text-slate-600 dark:text-slate-400">
                      {plan.subtitle}
                    </p>
                    <div className="flex items-baseline gap-2 mb-2">
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
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <Button
                    className={`
                      w-full py-3 font-medium transition-all duration-300 transform group-hover:scale-105
                      ${plan.id === "pro" 
                        ? 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan.id as "basic" | "pro");
                    }}
                  >
                    {plan.buttonText}
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
                  <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Unlimited Access</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Create unlimited resumes with no restrictions or watermarks
                  </p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center animate-fade-in-up delay-800">
              <Button
                onClick={handleContinue}
                disabled={!selectedPlan}
                size="lg"
                className={`
                  px-12 py-6 text-lg transition-all duration-300 transform hover:scale-105
                  ${selectedPlan 
                    ? 'bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 shadow-xl hover:shadow-2xl' 
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }
                `}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Continue to AI Generation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              {!selectedPlan && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Please select a plan to continue
                </p>
              )}
              
              {selectedPlan && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
                  {selectedPlan === "basic" 
                    ? "Great! You'll get AI-powered resume generation for 10 days!" 
                    : "Excellent choice! You'll get access to all premium features with unlimited access."
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlanSelection;