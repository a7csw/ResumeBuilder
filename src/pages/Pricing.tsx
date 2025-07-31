import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, Check, Zap, Crown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const plans = [
    {
      id: "trial",
      name: "10-Day Access",
      price: "$7",
      period: "one-time",
      description: "Perfect for quick resume creation",
      badge: "Most Popular",
      icon: Zap,
      features: [
        "Full feature access",
        "AI-powered suggestions",
        "Export to PDF",
        "Use all templates",
        "10 days unlimited access",
        "Basic support"
      ],
      cta: "Start 10-Day Trial",
      highlight: true
    },
    {
      id: "monthly",
      name: "Monthly Pro",
      price: "$15",
      period: "per month",
      description: "For professionals who need ongoing access",
      icon: Crown,
      features: [
        "Everything in 10-day access",
        "Unlimited resume creation",
        "Priority AI suggestions",
        "Advanced templates",
        "Priority support",
        "Resume analytics",
        "Multiple export formats",
        "Version history"
      ],
      cta: "Go Pro Monthly",
      highlight: false
    }
  ];

  const handleSubscribe = (planId: string) => {
    // Placeholder for Stripe integration
    console.log(`Subscribe to ${planId} plan`);
    // TODO: Implement Stripe checkout
    alert(`Stripe integration coming soon! Selected: ${planId}`);
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
            <span className="font-bold">ResumeAI</span>
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                    <Badge className="bg-primary text-primary-foreground">
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

        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            All plans include our core features with no setup fees
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-primary mr-2" />
              Secure payments
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-primary mr-2" />
              Cancel anytime
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-primary mr-2" />
              24/7 support
            </div>
          </div>
          
          <div className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Questions about pricing? <Link to="/auth" className="text-primary hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;