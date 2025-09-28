import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Crown, Sparkles, FileText, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { lemonSqueezy, LemonProduct, PRODUCTS } from '@/lib/lemonsqueezy';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    createLemonSqueezyCheckout?: (variantId: string, options?: any) => void;
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void;
      };
    };
  }
}

const LemonSqueezyCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LemonProduct | null>(null);
  const [payWhatYouWant, setPayWhatYouWant] = useState(false);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Get form data and selected product from navigation state or URL params
  const { formData } = location.state || {};
  const productId = searchParams.get('product') || 'basic';

  useEffect(() => {
    // Load LemonSqueezy script
    const script = document.createElement('script');
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js';
    script.defer = true;
    document.head.appendChild(script);

    // Set selected product
    const product = lemonSqueezy.getProduct(productId);
    if (product) {
      setSelectedProduct(product);
      setCustomPrice(product.price);
    }

    return () => {
      // Cleanup script
      document.head.removeChild(script);
    };
  }, [productId]);

  // If no form data, redirect back to form
  if (!formData && !searchParams.get('standalone')) {
    navigate('/form-selection');
    return null;
  }

  const handleProductSelect = (product: LemonProduct) => {
    setSelectedProduct(product);
    setCustomPrice(product.price);
    
    // Update URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('product', product.id);
    window.history.replaceState({}, '', newUrl.toString());
  };

  const handleCheckout = async (product: LemonProduct) => {
    try {
      setIsLoading(true);

      // Validate product configuration
      const validation = lemonSqueezy.validateCheckoutData(product);
      if (!validation.isValid) {
        toast({
          title: "Configuration Error",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
        return;
      }

      // Prepare checkout options
      const checkoutOptions = {
        variantId: product.variantId,
        customPrice: payWhatYouWant ? customPrice * 100 : undefined, // Convert to cents
        productOptions: {
          name: product.name,
          description: product.description,
          redirectUrl: `${window.location.origin}/checkout/success?product=${product.id}`,
        },
        checkoutOptions: {
          embed: false,
          media: true,
          logo: true,
          desc: true,
          discount: true,
          dark: false,
          subscriptionPreview: true,
        },
        checkoutData: {
          email: customerEmail || undefined,
          name: customerName || undefined,
        },
      };

      // Store form data for after payment
      if (formData) {
        localStorage.setItem('resumeFormData', JSON.stringify(formData));
        localStorage.setItem('selectedProduct', JSON.stringify(product));
      }

      // Try to use Lemon.js popup first
      if (window.createLemonSqueezyCheckout) {
        window.createLemonSqueezyCheckout(product.variantId, {
          ...checkoutOptions.checkoutOptions,
          ...checkoutOptions.checkoutData,
        });
      } else {
        // Fallback to redirect
        const result = await lemonSqueezy.createCheckout(product.variantId, checkoutOptions);
        if (result?.data?.attributes?.url) {
          window.location.href = result.data.attributes.url;
        } else {
          throw new Error('Failed to create checkout URL');
        }
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const products = lemonSqueezy.getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      {/* LemonSqueezy Test Mode Banner */}
      {lemonSqueezy.isTestMode() && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-center">
          <p className="font-medium">🧪 Test Mode Active - No real payments will be processed</p>
        </div>
      )}
      
      <div className="container px-4 sm:px-6 py-8 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Complete Your Purchase
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Choose your plan and generate your professional, ATS-optimized resume with AI-powered content optimization.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Select Your Plan</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {products.map((product) => (
                <Card 
                  key={product.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedProduct?.id === product.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : ''
                  } ${product.isPopular ? 'border-primary shadow-lg' : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  {product.isPopular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-2">
                      {product.id === 'single' && <FileText className="w-8 h-8 text-blue-500" />}
                      {product.id === 'basic' && <Sparkles className="w-8 h-8 text-purple-500" />}
                      {product.id === 'professional' && <Crown className="w-8 h-8 text-yellow-500" />}
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="text-2xl font-bold">
                      {lemonSqueezy.formatPrice(product.price)}
                      {product.interval && (
                        <span className="text-sm font-normal text-muted-foreground">
                          /{product.interval}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pay What You Want Option (if enabled) */}
            {selectedProduct && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="payWhatYouWant"
                      checked={payWhatYouWant}
                      onChange={(e) => setPayWhatYouWant(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="payWhatYouWant">
                      Pay what you want (minimum {lemonSqueezy.formatPrice(selectedProduct.price)})
                    </Label>
                  </div>
                  
                  {payWhatYouWant && (
                    <div>
                      <Label htmlFor="customPrice">Your Price</Label>
                      <Input
                        id="customPrice"
                        type="number"
                        min={selectedProduct.price}
                        value={customPrice}
                        onChange={(e) => setCustomPrice(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProduct ? (
                  <>
                    <div className="flex justify-between">
                      <span>{selectedProduct.name}</span>
                      <span className="font-medium">
                        {lemonSqueezy.formatPrice(payWhatYouWant ? customPrice : selectedProduct.price)}
                      </span>
                    </div>
                    
                    <hr />
                    
                    {/* Customer Information */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="John Doe"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <hr />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{lemonSqueezy.formatPrice(payWhatYouWant ? customPrice : selectedProduct.price)}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handleCheckout(selectedProduct)}
                      disabled={isLoading || !selectedProduct.variantId}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Complete Purchase
                        </>
                      )}
                    </Button>
                    
                    {!selectedProduct.variantId && (
                      <p className="text-sm text-red-600 text-center">
                        Product not configured. Please contact support.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Select a product to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>🔒 Secure payment processing by LemonSqueezy • Cancel anytime • No hidden fees</p>
          <p className="mt-2">
            Powered by <span className="font-medium">LemonSqueezy</span> - 
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default LemonSqueezyCheckout;
