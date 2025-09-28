import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowRight, Loader2 } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { lemonSqueezy, LemonProduct } from '@/lib/lemonsqueezy';

const CheckoutSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<LemonProduct | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get('product');
  const checkoutId = searchParams.get('checkout_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Simulate processing time and load stored data
    const timer = setTimeout(() => {
      try {
        // Get stored form data and product
        const storedFormData = localStorage.getItem('resumeFormData');
        const storedProduct = localStorage.getItem('selectedProduct');

        if (storedFormData) {
          setFormData(JSON.parse(storedFormData));
        }

        if (storedProduct) {
          setProduct(JSON.parse(storedProduct));
        } else if (productId) {
          const prod = lemonSqueezy.getProduct(productId);
          setProduct(prod);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading checkout data:', error);
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [productId]);

  const handleGenerateResume = () => {
    if (formData) {
      // Store that user has paid
      localStorage.setItem('hasPaidAccess', 'true');
      localStorage.setItem('purchasedProduct', JSON.stringify(product));
      
      // Navigate to resume generation
      navigate('/resume-generated', { 
        state: { 
          formData, 
          planId: product?.id,
          isPaid: true 
        } 
      });
    } else {
      // If no form data, redirect to form
      navigate('/form-selection');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Processing Your Order...
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Please wait while we confirm your payment and prepare your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container px-4 sm:px-6 py-8 mx-auto max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Thank you for your purchase. Your account has been activated and you can now generate your professional resume.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product && (
              <>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Product</span>
                  <span>{product.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Price</span>
                  <span className="font-bold">{lemonSqueezy.formatPrice(product.price)}</span>
                </div>
                {product.interval && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Billing</span>
                    <span>Every {product.interval}</span>
                  </div>
                )}
                {checkoutId && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Checkout ID</span>
                    <span className="text-sm text-muted-foreground">{checkoutId}</span>
                  </div>
                )}
                {orderId && (
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Order ID</span>
                    <span className="text-sm text-muted-foreground">{orderId}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Generate Your Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our AI-powered system to create your professional, ATS-optimized resume
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Download & Apply</h3>
                  <p className="text-sm text-muted-foreground">
                    Download your resume in PDF or Word format and start applying to jobs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Track Your Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Access your account to create more resumes and track your job applications
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {formData ? (
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={handleGenerateResume}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate My Resume Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/form-selection')}
                >
                  Start Creating Resume
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@novaecv.com" className="text-primary hover:underline">
              support@novaecv.com
            </a>
          </p>
          <p className="mt-2">
            You'll receive a confirmation email shortly with your receipt and account details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
