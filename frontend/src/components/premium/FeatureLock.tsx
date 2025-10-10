import { ReactNode, useState } from 'react';
import { Lock, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaywallModal } from './PaywallModal';
import { useRevenueCat } from '@/hooks/useRevenueCat';

interface FeatureLockProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  lockMessage?: string;
  className?: string;
}

export const FeatureLock = ({ 
  feature, 
  children, 
  fallback,
  lockMessage,
  className = "" 
}: FeatureLockProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { canAccessFeature, isLoading } = useRevenueCat();

  // Show loading state
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Check if user has access to this feature
  const hasAccess = canAccessFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default lock UI
  return (
    <>
      <Card className={`border-dashed border-2 border-gray-300 bg-gray-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Premium Feature
            </h3>
            <p className="text-gray-600 mb-4">
              {lockMessage || `This feature requires a Premium subscription to access.`}
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
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

export default FeatureLock;
