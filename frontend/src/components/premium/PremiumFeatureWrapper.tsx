import React, { useState } from "react";
import { useEnhancedUserPlan } from "@/hooks/useEnhancedUserPlan";
import PaywallModal from "./PaywallModal";

interface PremiumFeatureWrapperProps {
  children: React.ReactNode;
  feature: 'ai' | 'export' | 'premium-template';
  requiredPlan: 'basic' | 'ai' | 'pro';
  fallback?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const PremiumFeatureWrapper: React.FC<PremiumFeatureWrapperProps> = ({
  children,
  feature,
  requiredPlan,
  fallback,
  disabled = false,
  className = "",
  onClick
}) => {
  const { userPlan, canUseFeature, getUpgradeMessage } = useEnhancedUserPlan();
  const [showPaywall, setShowPaywall] = useState(false);

  const hasAccess = feature === 'premium-template' 
    ? userPlan.canUseAITemplates 
    : canUseFeature(feature as 'ai' | 'export' | 'templates');

  const handleClick = () => {
    if (disabled) return;
    
    if (hasAccess) {
      onClick?.();
    } else {
      setShowPaywall(true);
    }
  };

  if (!hasAccess && fallback) {
    return (
      <>
        <div className={className} onClick={handleClick}>
          {fallback}
        </div>
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          feature={feature}
          requiredPlan={requiredPlan}
          message={getUpgradeMessage(feature)}
        />
      </>
    );
  }

  return (
    <>
      <div 
        className={`${className} ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleClick}
      >
        {children}
      </div>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={feature}
        requiredPlan={requiredPlan}
        message={getUpgradeMessage(feature)}
      />
    </>
  );
};

export default PremiumFeatureWrapper;