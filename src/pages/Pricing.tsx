import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, Check, Zap, Crown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { generateLemonSqueezyCheckoutUrl } from "@/lib/lemonsqueezy";
import { env } from "@/lib/env";
import { paymentsDisabled } from "@/lib/flags";

const Pricing = () => {
  const navigate = useNavigate();

  // Redirect to home if payments are disabled (test mode)
  useEffect(() => {
    if (paymentsDisabled()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "$3",
      period: "10 days",
      description: "Access to Basic templates",
      icon: FileText,
      features: [
        "Basic templates only",
        "Manual form filling",
        "PDF export included after payment",
        "No AI features",
        "10 days access"
      ],
      cta: "Get Basic Access",
      highlight: false
    },
    {
      id: "ai",
      name: "AI Plan",
      price: "$7",
      period: "10 days",
      description: "All templates + AI assistance",
      badge: "Most Popular",
      icon: Zap,
      features: [
        "All templates (Basic + Premium)",
        "AI assistance for completion",
        "PDF export included after payment",
        "Smart suggestions",
        "10 days access"
      ],
      cta: "Get AI Access",
      highlight: true
    },
    {
      id: "pro",
      name: "Monthly Plan",
      price: "$15",
      period: "per month",
      description: "Full access with premium support",
      icon: Crown,
      features: [
        "Everything in AI plan",
        "Unlimited downloads",
        "Premium support",
        "All future features"
      ],
      cta: "Subscribe Monthly",
      highlight: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      // Navigate to builder for free plan
      window.location.href = '/builder';
      return;
    }

    try {
      // Get user email for checkout
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email;

      // Check payment provider
      const paymentsProvider = env.PAYMENTS_PROVIDER || 'stripe';

      if (paymentsProvider === 'lemonsqueezy') {
        // Use Lemon Squeezy checkout
        const successUrl = `${window.location.origin}/payment-success?plan=${planId}`;
        const cancelUrl = `${window.location.origin}/pricing`;
        
        const checkoutUrl = generateLemonSqueezyCheckoutUrl(
          planId,
          userEmail,
          successUrl,
          cancelUrl
        );

        // Open Lemon Squeezy checkout in a new tab
        window.open(checkoutUrl, '_blank');
      } else {
        // Use Stripe checkout (legacy)
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: { planType: planId }
        });

        if (error) throw error;
        
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment setup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Back to home</span>
          </Link>
          <div className="flex items-center space-x-2 ml-6">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold">ResumeBuilder</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`shadow-elegant hover:shadow-glow transition-all duration-300 relative ${
                  plan.highlight ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={`text-white bg-primary`}>
                      <Sparkles className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.highlight ? 'bg-primary/10' : 'bg-muted'}`}>
                      <IconComponent className={`w-6 h-6 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16 space-y-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Why Choose ResumeBuilder?</h3>
            <p className="text-muted-foreground mb-8">
              Professional resume templates designed by experts, trusted by professionals worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">ATS-Friendly</h4>
              <p className="text-sm text-muted-foreground">
                All templates are optimized for Applicant Tracking Systems
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Professional Design</h4>
              <p className="text-sm text-muted-foreground">
                Modern, clean designs that make a great first impression
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Easy to Use</h4>
              <p className="text-sm text-muted-foreground">
                Simple, intuitive interface gets you results fast
              </p>
            </div>
          </div>
          
          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Need help choosing the right plan? <Link to="/auth" className="text-primary hover:underline">Get in touch</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;