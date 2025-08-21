import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurePreviewOverlayProps {
  isBlurred?: boolean;
  showUpgradeButton?: boolean;
  upgradeText?: string;
  onUpgrade?: () => void;
  className?: string;
  children: React.ReactNode;
  userPlan?: string | null;
}

/**
 * SecurePreviewOverlay
 * 
 * Provides secure preview functionality with:
 * - Strong blur effect for non-paid users
 * - Diagonal watermark overlay
 * - Disabled right-click, text selection, and printing
 * - Upgrade CTA
 */
export const SecurePreviewOverlay: React.FC<SecurePreviewOverlayProps> = ({
  isBlurred = true,
  showUpgradeButton = true,
  upgradeText = "Upgrade to see clear preview",
  onUpgrade,
  className,
  children,
  userPlan = null,
}) => {
  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection, drag, and print
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+P (print), Ctrl+S (save), Ctrl+A (select all)
      if (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'a')) {
        e.preventDefault();
        return false;
      }
      // Disable F12 (dev tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    if (isBlurred) {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('selectstart', handleSelectStart);
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBlurred]);

  const shouldShowBlur = isBlurred && (!userPlan || userPlan === 'free');

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Content with conditional blur */}
      <div 
        className={cn(
          "transition-all duration-300",
          shouldShowBlur && "blur-md filter"
        )}
        style={{
          userSelect: shouldShowBlur ? 'none' : 'auto',
          pointerEvents: shouldShowBlur ? 'none' : 'auto',
        }}
      >
        {children}
      </div>

      {/* Watermark overlay */}
      {shouldShowBlur && (
        <>
          {/* Diagonal watermark pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 35px,
                  rgba(0, 0, 0, 0.1) 35px,
                  rgba(0, 0, 0, 0.1) 36px
                )`,
              }}
            />
            
            {/* Watermark text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="text-6xl font-bold text-black/20 transform rotate-45 select-none pointer-events-none"
                style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.5)' }}
              >
                PREVIEW
              </div>
            </div>
          </div>

          {/* Upgrade overlay */}
          {showUpgradeButton && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 text-center max-w-sm mx-4 shadow-xl">
                <div className="flex justify-center mb-4">
                  {userPlan === 'basic' ? (
                    <Crown className="h-12 w-12 text-purple-600" />
                  ) : userPlan === 'ai' ? (
                    <Sparkles className="h-12 w-12 text-blue-600" />
                  ) : (
                    <Lock className="h-12 w-12 text-gray-600" />
                  )}
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {upgradeText}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  Subscribe to remove blur and access all features
                </p>
                
                {onUpgrade && (
                  <Button 
                    onClick={onUpgrade}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SecurePreviewOverlay;