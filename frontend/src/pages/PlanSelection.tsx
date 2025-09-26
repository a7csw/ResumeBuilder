import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, FileText, ArrowLeft } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { PRICING_PLANS } from '@/lib/revenuecat';
import { useToast } from '@/hooks/use-toast';

const PlanSelection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { purchasePackage, packages } = useRevenueCat();

  // Get form data from navigation state
  const { formData } = location.state || {};

  // If no form data, redirect back to form
  if (!formData) {
    navigate('/form-selection');
    return null;
  }

  const handlePlanSelection = async (planId: string) => {
    try {
      setIsProcessing(true);

      // Find the corresponding package for the plan
      const selectedPackage = packages.find(pkg => pkg.identifier === planId);
      
      if (!selectedPackage) {
        toast({
          title: "Plan not available",
          description: "This plan is currently not available. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      // Process payment with RevenueCat
      const customerInfo = await purchasePackage(selectedPackage);
      
      if (customerInfo) {
        // Payment successful, navigate to resume generation
        toast({
          title: "Payment successful! 🎉",
          description: "Your resume is being generated...",
        });
        
        // Store the form data and navigate to resume generation
        localStorage.setItem('resumeFormData', JSON.stringify(formData));
        navigate('/resume-generated', { state: { formData, planId } });
      } else {
        toast({
          title: "Payment failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container px-4 sm:px-6 py-8 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Form
          </Button>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select a plan to generate your professional, ATS-optimized resume with AI-powered content optimization.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Single Resume Plan */}
          <Card className="relative hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Single Resume
              </CardTitle>
              <div className="text-3xl font-bold">
                $2<span className="text-lg font-normal text-muted-foreground">/once</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for one-time use</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {PRICING_PLANS.single.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handlePlanSelection('single')}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Get Single Resume'}
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
              <p className="text-sm text-muted-foreground">Best value for job seekers</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {PRICING_PLANS.basic.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handlePlanSelection('basic')}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Basic Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="relative hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Professional
              </CardTitle>
              <div className="text-3xl font-bold">
                $11<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">For ongoing job search</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {PRICING_PLANS.professional.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handlePlanSelection('professional')}
                disabled={isProcessing}
              >
                <Crown className="w-4 h-4 mr-2" />
                Get Professional
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">What you get with every plan:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">AI-Generated Content</h4>
                <p className="text-sm text-muted-foreground">Professional, ATS-optimized</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Multiple Formats</h4>
                <p className="text-sm text-muted-foreground">PDF & Word downloads</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Professional Design</h4>
                <p className="text-sm text-muted-foreground">Clean, modern layout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium">Instant Access</h4>
                <p className="text-sm text-muted-foreground">Generate immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>🔒 Secure payment processing • Cancel anytime • No hidden fees</p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
