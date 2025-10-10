import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Sparkles, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationHeader from '@/components/NavigationHeader';
import { useToast } from '@/hooks/use-toast';
import { getSubscriptionService } from '@/lib/supabase-subscriptions';
import { GUMROAD_PRODUCTS } from '@/lib/gumroad';
import { useAuth } from '@/contexts/AuthContext';

const GumroadSuccess = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get parameters from URL or location state
  const productId = searchParams.get('product') || location.state?.planId;
  const orderId = searchParams.get('order_id') || `gumroad_${Date.now()}`;
  const email = searchParams.get('email');
  const price = searchParams.get('price');

  useEffect(() => {
    const processGumroadSuccess = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        // Check if user is authenticated
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to complete your purchase activation.",
            variant: "destructive",
          });
          navigate('/auth', { 
            state: { 
              from: location.pathname + location.search,
              message: "Please sign in to activate your purchase"
            }
          });
          return;
        }

        // Validate product ID
        if (!productId) {
          setError("Product information missing from purchase confirmation.");
          return;
        }

        // Get product details
        const product = Object.values(GUMROAD_PRODUCTS).find(p => 
          p.id === productId || 
          productId.includes(p.id) ||
          (productId === 'single' && p.id === 'single_resume') ||
          (productId === '10days' && p.id === '10day_access') ||
          (productId === 'monthly' && p.id === 'monthly_subscription')
        );

        if (!product) {
          setError(`Unknown product: ${productId}`);
          return;
        }

        setProductDetails(product);

        // Create subscription in Supabase
        const subscriptionService = getSubscriptionService(toast);
        const pricePaid = price ? parseInt(price) * 100 : product.price * 100; // Convert to cents

        const subscriptionId = await subscriptionService.createSubscription(
          product.id,
          orderId,
          pricePaid
        );

        if (subscriptionId) {
          setSubscriptionCreated(true);
          
          // Clear any stored form data since purchase is complete
          localStorage.removeItem('resumeFormData');
          localStorage.removeItem('selectedProductId');

          toast({
            title: "Purchase activated! 🎉",
            description: `Your ${product.name} is now active and ready to use.`,
            duration: 5000,
          });
        } else {
          setError("Failed to activate your purchase. Please contact support.");
        }

      } catch (error) {
        console.error('Error processing Gumroad success:', error);
        setError("An error occurred while activating your purchase. Please contact support.");
      } finally {
        setIsProcessing(false);
      }
    };

    processGumroadSuccess();
  }, [user, productId, orderId, price, toast, navigate, location]);

  const handleGenerateResume = () => {
    navigate('/form-selection');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container py-16 text-center">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Activating Your Purchase...
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Please wait while we set up your account and activate your subscription.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container py-16 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Activation Error
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
          
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Thank you for your purchase! Your {productDetails?.name} is now active.
          </p>

          {/* Purchase Summary Card */}
          {productDetails && (
            <Card className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Purchase Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Plan:</span>
                    <span className="font-semibold">{productDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Price:</span>
                    <span className="font-semibold">€{productDetails.price}</span>
                  </div>
                  {productDetails.accessValidityDays && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Access Duration:</span>
                      <span className="font-semibold">{productDetails.accessValidityDays} days</span>
                    </div>
                  )}
                  {orderId && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Order ID:</span>
                      <span className="font-mono text-sm">{orderId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={handleGenerateResume} className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Your Resume
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button size="lg" variant="outline" onClick={handleViewDashboard}>
              View Dashboard
            </Button>
          </div>

          {/* Features List */}
          <div className="mt-12 text-left">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
              What's included in your plan:
            </h3>
            <div className="grid gap-3">
              {productDetails?.features?.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GumroadSuccess;