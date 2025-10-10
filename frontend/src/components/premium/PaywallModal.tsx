import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap, X, FileText } from 'lucide-react';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { PRICING_PLANS } from '@/lib/revenuecat';
import { useToast } from '@/hooks/use-toast';

interface PaywallModalProps {
  trigger?: React.ReactNode;
  feature?: string;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PaywallModal = ({ 
  trigger, 
  feature = 'premium features', 
  title,
  description,
  open,
  onOpenChange 
}: PaywallModalProps) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { packages, purchasePackage, isLoading } = useRevenueCat();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    if (packages.length === 0) {
      toast({
        title: "No packages available",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpgrading(true);
      
      // Find the premium package (assuming it's the first one)
      const premiumPackage = packages[0];
      const success = await purchasePackage(premiumPackage);
      
      if (success) {
        toast({
          title: "Welcome to Premium! 🎉",
          description: "You now have access to all premium features.",
        });
        onOpenChange?.(false);
      } else {
        toast({
          title: "Upgrade failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const premiumPlan = PRICING_PLANS.premium;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-6 h-6 text-yellow-500" />
            {title || `Upgrade to Access ${feature}`}
          </DialogTitle>
          <DialogDescription>
            {description || `This feature is available with our Premium plan. Upgrade now to unlock unlimited potential!`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {/* Single Resume Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Single Resume
              </CardTitle>
              <div className="text-3xl font-bold">
                $2<span className="text-lg font-normal text-muted-foreground">/once</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PRICING_PLANS.single.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6" 
                variant="outline"
                onClick={handleUpgrade}
                disabled={isUpgrading || isLoading}
              >
                Get Single Resume
              </Button>
            </CardContent>
          </Card>

          {/* Basic Plan */}
          <Card className="relative border-primary shadow-lg">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Basic Plan
              </CardTitle>
              <div className="text-3xl font-bold">
                $5<span className="text-lg font-normal text-muted-foreground">/10 days</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PRICING_PLANS.basic.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6" 
                onClick={handleUpgrade}
                disabled={isUpgrading || isLoading}
              >
                {isUpgrading ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Basic Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Professional
              </CardTitle>
              <div className="text-3xl font-bold">
                $11<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PRICING_PLANS.professional.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6" 
                variant="outline"
                onClick={handleUpgrade}
                disabled={isUpgrading || isLoading}
              >
                <Crown className="w-4 h-4 mr-2" />
                Get Professional
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Why upgrade?</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Crown className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Premium Templates</div>
                <div className="text-muted-foreground">Access to exclusive, professional designs</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">PDF Export</div>
                <div className="text-muted-foreground">Download your resume as PDF</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Advanced AI</div>
                <div className="text-muted-foreground">Enhanced content suggestions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-4">
          Cancel anytime. No long-term commitments.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
