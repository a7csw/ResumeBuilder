import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import NavigationHeader from "@/components/NavigationHeader";

const EnhancedPricingPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const highlightPlan = location.state?.highlightPlan;

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      description: "Perfect for getting started",
      price: "$3",
      duration: "10 days",
      originalPrice: null,
      savings: null,
      icon: Check,
      features: [
        "Access to 3 basic templates",
        "Manual form filling",
        "PDF export",
        "ATS-optimized layouts",
        "10-day access"
      ],
      buttonText: "Get Basic",
      popular: false,
      color: "border-blue-500"
    },
    {
      id: "ai",
      name: "AI Plan",
      description: "AI-powered resume enhancement",
      price: "$7",
      duration: "10 days",
      originalPrice: "$10",
      savings: "30%",
      icon: Sparkles,
      features: [
        "Everything in Basic",
        "Access to ALL 8+ templates",
        "AI content enhancement",
        "Professional bullet points",
        "AI-powered summaries",
        "30 AI enhancement calls",
        "Premium template designs"
      ],
      buttonText: "Get AI Plan",
      popular: true,
      color: "border-purple-500"
    },
    {
      id: "pro",
      name: "Pro Plan",
      description: "For serious job seekers",
      price: "$15",
      duration: "monthly",
      originalPrice: null,
      savings: null,
      icon: Crown,
      features: [
        "Everything in AI Plan",
        "Unlimited AI enhancement calls",
        "Priority AI processing",
        "Multiple resume versions",
        "Version history & backups",
        "Priority customer support",
        "Advanced analytics"
      ],
      buttonText: "Get Pro",
      popular: false,
      color: "border-yellow-500"
    }
  ];

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(planId);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with your purchase.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('enhanced-create-payment', {
        body: { planType: planId }
      });

      if (error) {
        throw error;
      }

      if (data.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create payment session",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader showBackButton backTo="/" />

      <div className="container py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create professional resumes that get noticed. All plans include ATS-friendly templates and instant PDF export.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isHighlighted = highlightPlan === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`
                  relative hover-lift transition-all duration-300 
                  ${plan.popular ? 'ring-2 ring-primary shadow-elegant scale-105' : ''}
                  ${isHighlighted ? 'ring-2 ring-orange-500 shadow-lg' : ''}
                  ${plan.color}
                `}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                {isHighlighted && (
                  <Badge className="absolute -top-3 right-4 bg-orange-500">
                    Recommended
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="flex items-baseline justify-center gap-2 mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/ {plan.duration}</span>
                    {plan.originalPrice && (
                      <span className="text-sm line-through text-muted-foreground ml-2">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {plan.savings && (
                    <Badge variant="secondary" className="mt-2">
                      Save {plan.savings}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className={`
                      w-full btn-magic transition-all duration-300
                      ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}
                    `}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        {plan.buttonText}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust & Security */}
        <div className="text-center space-y-6 animate-fade-in-up delay-300">
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            ✓ 30-day money back guarantee if you haven't exported your resume
            <br />
            ✓ All payments processed securely by Stripe
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">What's the difference between plans?</h3>
              <p className="text-sm text-muted-foreground">
                Basic gives you access to professional templates and export. AI adds intelligent content enhancement and premium templates. Pro includes unlimited AI usage and advanced features.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel anytime. For one-time plans (Basic/AI), you get full access for the duration. Pro subscriptions can be cancelled and you'll retain access until the end of your billing period.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">Is there a refund policy?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 30-day money-back guarantee if you haven't exported your resume yet. Once you download your resume, the purchase is considered complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPricingPage;