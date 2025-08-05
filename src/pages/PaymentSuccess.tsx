import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const planType = searchParams.get('plan');

  useEffect(() => {
    // Update user's plan in the database
    const updateUserPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const planConfig: Record<string, any> = {
          basic: { price: 300, days: 10 },
          ai: { price: 700, days: 10 },
          pro: { price: 1500, recurring: true }
        };

        const plan = planConfig[planType as string];
        if (!plan) return;

        const expiresAt = plan.recurring 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : new Date(Date.now() + (plan.days || 30) * 24 * 60 * 60 * 1000);

        const { error } = await supabase
          .from('user_plans')
          .insert({
            user_id: user.id,
            plan_type: planType,
            price_paid: plan.price,
            expires_at: expiresAt.toISOString(),
            is_active: true
          });

        if (error) {
          console.error('Error updating user plan:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    updateUserPlan();
  }, [planType, navigate]);

  const getPlanName = () => {
    switch (planType) {
      case 'basic': return 'Basic Plan';
      case 'ai': return 'AI Plan';
      case 'pro': return 'Pro Plan';
      default: return 'Plan';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div>
            <h3 className="text-lg font-semibold">
              Welcome to {getPlanName()}
            </h3>
            <p className="text-muted-foreground mt-2">
              Your subscription is now active. Start building amazing resumes!
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/builder')} 
              className="w-full"
              size="lg"
            >
              Start Building Resume
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;