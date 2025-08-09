import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan: 'basic' | 'ai' | 'pro';
  message?: string;
}

const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  feature,
  requiredPlan,
  message
}) => {
  const navigate = useNavigate();

  const planConfig = {
    basic: {
      name: "Basic Plan",
      price: "$3",
      duration: "10 days",
      icon: Check,
      color: "bg-blue-500",
      features: [
        "Access to basic templates",
        "PDF export",
        "Manual form filling",
        "10-day access"
      ],
      popular: false
    },
    ai: {
      name: "AI Plan", 
      price: "$7",
      duration: "10 days",
      icon: Sparkles,
      color: "bg-purple-500",
      features: [
        "All basic features",
        "Access to ALL templates",
        "AI content enhancement",
        "30 AI calls included",
        "PDF export"
      ],
      popular: true
    },
    pro: {
      name: "Pro Plan",
      price: "$15",
      duration: "monthly",
      icon: Crown,
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      features: [
        "Everything in AI plan",
        "Unlimited AI calls",
        "Priority AI processing",
        "Version history",
        "Priority support"
      ],
      popular: false
    }
  };

  const currentPlan = planConfig[requiredPlan];
  const Icon = currentPlan.icon;

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing', { 
      state: { 
        highlightPlan: requiredPlan,
        feature: feature 
      }
    });
  };

  const getFeatureMessage = () => {
    if (message) return message;
    
    switch (feature) {
      case 'ai':
        return "AI content enhancement requires an AI or Pro plan to help you create compelling, professional resume content.";
      case 'export':
        return "PDF export requires a paid plan. Choose the plan that best fits your needs.";
      case 'premium-template':
        return "This premium template requires an AI or Pro plan for full access and export capabilities.";
      default:
        return `This feature requires a ${currentPlan.name} or higher.`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">
            Upgrade Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {getFeatureMessage()}
          </p>

          <div className="relative p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
            {currentPlan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            
            <div className="text-center mb-3">
              <h3 className="font-semibold text-lg">{currentPlan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-bold text-primary">{currentPlan.price}</span>
                <span className="text-sm text-muted-foreground">/ {currentPlan.duration}</span>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1 btn-magic"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ✓ Secure payment • ✓ Instant access • ✓ No commitment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;