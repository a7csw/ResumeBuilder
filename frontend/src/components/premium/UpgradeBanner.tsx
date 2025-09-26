import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, X, Sparkles } from 'lucide-react';
import { PaywallModal } from './PaywallModal';
import { useRevenueCat } from '@/hooks/useRevenueCat';

interface UpgradeBannerProps {
  feature?: string;
  className?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

export const UpgradeBanner = ({ 
  feature = "premium features", 
  className = "",
  onDismiss,
  dismissible = false
}: UpgradeBannerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isPremium, isLoading } = useRevenueCat();

  // Don't show banner if user is premium or already dismissed
  if (isPremium || isDismissed || isLoading) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <>
      <Card className={`border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Unlock {feature} with Premium
                </h3>
                <p className="text-sm text-gray-600">
                  Get access to premium templates, PDF export, and advanced AI features for just $1/month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Upgrade Now
              </Button>
              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <PaywallModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        feature={feature}
      />
    </>
  );
};

export default UpgradeBanner;
