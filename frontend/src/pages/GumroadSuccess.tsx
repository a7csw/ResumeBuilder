import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const GumroadSuccess = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSubscription, refetch } = useSubscription();
  const { toast } = useToast();

  // Get parameters from URL
  const product = searchParams.get('product');
  const userId = searchParams.get('user_id');
  const orderId = searchParams.get('order_id');
  const email = searchParams.get('email');

  const planNames = {
    single: 'Single Resume',
    '10days': '10 Days Access',
    monthly: 'Monthly Plan'
  };

  const planPrices = {
    single: '€1',
    '10days': '€4',
    monthly: '€9'
  };

  useEffect(() => {
    const processPurchase = async () => {
      // Validate required parameters
      if (!product || !userId) {
        setError('Missing required parameters. Please contact support.');
        setIsProcessing(false);
        return;
      }

      // Validate product type
      if (!['single', '10days', 'monthly'].includes(product)) {
        setError('Invalid product type. Please contact support.');
        setIsProcessing(false);
        return;
      }

      // Check if user is authenticated and matches the purchase
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to complete your purchase activation.",
          variant: "destructive",
        });
        navigate('/auth', { 
          state: { 
            from: `/gumroad/success?${searchParams.toString()}` 
          } 
        });
        return;
      }

      if (user.id !== userId) {
        setError('User mismatch. Please sign in with the account used for purchase.');
        setIsProcessing(false);
        return;
      }

      try {
        // Create subscription in database
        await createSubscription(
          product as 'single' | '10days' | 'monthly',
          orderId || undefined
        );

        setSubscriptionCreated(true);
        
        // Refresh subscription status
        await refetch();

        toast({
          title: "Purchase activated! 🎉",
          description: `Your ${planNames[product as keyof typeof planNames]} is now active.`,
        });

      } catch (err) {
        console.error('Error processing purchase:', err);
        setError('Failed to activate your purchase. Please contact support.');
        toast({
          title: "Activation failed",
          description: "Please contact support with your order details.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    // Add a small delay to make the process feel more natural
    const timer = setTimeout(processPurchase, 2000);
    return () => clearTimeout(timer);
  }, [product, userId, orderId, user, createSubscription, refetch, toast, navigate, searchParams]);

  const handleContinue = () => {
    // Navigate to dashboard or resume builder
    navigate('/dashboard');
  };

  const handleCreateResume = () => {
    navigate('/form-selection');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Activating Your Purchase...
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Please wait while we set up your account and activate your subscription.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Product:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {product && planNames[product as keyof typeof planNames]}
                  </span>
                </div>
                {orderId && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600 dark:text-slate-300">Order ID:</span>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {orderId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Activation Failed
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
            <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              <p>
                Need help? Contact support at{' '}
                <a href="mailto:support@resumebuilder.com" className="text-primary hover:underline">
                  support@resumebuilder.com
                </a>
              </p>
              {orderId && (
                <p className="mt-2">
                  Reference Order ID: <span className="font-mono">{orderId}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container px-4 sm:px-6 py-12 mx-auto max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Premium! 🎉
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your purchase has been successfully activated. You now have full access to create professional, 
            ATS-optimized resumes with our AI-powered platform.
          </p>
        </div>

        {/* Purchase Details */}
        <Card className="mb-8 max-w-2xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Purchase Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="font-medium text-slate-700 dark:text-slate-300">Plan</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {product && planNames[product as keyof typeof planNames]}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="font-medium text-slate-700 dark:text-slate-300">Price</span>
              <span className="font-bold text-primary text-lg">
                {product && planPrices[product as keyof typeof planPrices]}
              </span>
            </div>
            {product === '10days' && (
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-700 dark:text-slate-300">Access Duration</span>
                <span className="text-slate-900 dark:text-white">10 days</span>
              </div>
            )}
            {product === 'monthly' && (
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-700 dark:text-slate-300">Billing</span>
                <span className="text-slate-900 dark:text-white">Monthly subscription</span>
              </div>
            )}
            {product === 'single' && (
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-700 dark:text-slate-300">Resumes Included</span>
                <span className="text-slate-900 dark:text-white">1 resume</span>
              </div>
            )}
            {email && (
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-700 dark:text-slate-300">Email</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{email}</span>
              </div>
            )}
            {orderId && (
              <div className="flex justify-between items-center py-3">
                <span className="font-medium text-slate-700 dark:text-slate-300">Order ID</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{orderId}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-primary/5 dark:from-slate-800 dark:to-primary/10">
          <CardHeader>
            <CardTitle className="text-center">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-8">
            <div className="grid gap-6">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Create Your Resume</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Use our AI-powered builder to create a professional, ATS-optimized resume
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Download & Apply</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Export your resume in PDF or Word format and start applying to jobs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Track Your Success</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Manage your resumes and track your job applications from your dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
                onClick={handleCreateResume}
              >
                <Download className="w-4 h-4 mr-2" />
                Create My Resume
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1"
                onClick={handleContinue}
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="text-center mt-12 space-y-4">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              🔒 Secure Payment Confirmation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              Your payment was processed securely through Gumroad. You'll receive a confirmation email shortly.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need help? Contact us at{' '}
              <a href="mailto:support@resumebuilder.com" className="text-primary hover:underline">
                support@resumebuilder.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GumroadSuccess;