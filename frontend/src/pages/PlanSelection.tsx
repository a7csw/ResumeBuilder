import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, FileText, ArrowLeft } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { gumroad, GUMROAD_PRODUCTS } from '@/lib/gumroad';
import { useToast } from '@/hooks/use-toast';

const PlanSelection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const products = gumroad.getProducts();

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

      // Find the selected product
      const selectedProduct = gumroad.getProduct(planId);
      
      if (!selectedProduct) {
        toast({
          title: "Plan not available",
          description: "This plan is currently not available. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      // Validate product configuration
      const validation = gumroad.validateProduct(selectedProduct);
      if (!validation.isValid) {
        toast({
          title: "Configuration Error",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
        return;
      }

      // Store form data for after purchase
      localStorage.setItem('resumeFormData', JSON.stringify(formData));
      localStorage.setItem('selectedProductId', planId);

      // Show success message and open Gumroad checkout
      toast({
        title: "Opening checkout...",
        description: `Redirecting to secure payment for ${selectedProduct.name}`,
      });

      // Open Gumroad checkout with success callback
      gumroad.openCheckout(planId, {
        onSuccess: () => {
          // This will be called if the overlay is used and purchase is successful
          toast({
            title: "Payment successful! 🎉",
            description: "Redirecting to resume generation...",
          });
          
          // Navigate to resume generation after successful payment
          setTimeout(() => {
            navigate('/resume-generated', { 
              state: { 
                formData, 
                planId,
                isPaid: true 
              } 
            });
          }, 2000);
        },
        onError: (error) => {
          toast({
            title: "Payment failed",
            description: error || "Please try again or contact support.",
            variant: "destructive",
          });
        }
      });

    } catch (error) {
      console.error('Checkout error:', error);
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
          {products.map((product) => (
            <Card key={product.id} className={`relative hover:shadow-lg transition-shadow ${product.isPopular ? 'border-primary shadow-lg' : ''}`}>
              {product.isPopular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {product.id === 'single_resume' && <FileText className="w-5 h-5 text-blue-500" />}
                  {product.id === '10day_access' && <Sparkles className="w-5 h-5 text-purple-500" />}
                  {product.id === 'monthly_subscription' && <Crown className="w-5 h-5 text-yellow-500" />}
                  {product.name}
                </CardTitle>
                <div className="text-3xl font-bold">
                  {gumroad.formatPrice(product.price, product.currency)}
                  {product.interval && (
                    <span className="text-lg font-normal text-muted-foreground">
                      /{product.interval}
                    </span>
                  )}
                  {product.accessValidityDays && (
                    <span className="text-lg font-normal text-muted-foreground">
                      /{product.accessValidityDays} days
                    </span>
                  )}
                  {product.id === 'single_resume' && (
                    <span className="text-lg font-normal text-muted-foreground">/once</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={product.isPopular ? "default" : "outline"}
                  onClick={() => handlePlanSelection(product.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Get ${product.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
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
