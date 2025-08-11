import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Sparkles } from "lucide-react";

interface SecurePreviewOverlayProps {
  requiredPlanLabel?: string;
  watermarkText?: string;
  onUpgrade?: () => void;
  templateName?: string;
  isPremium?: boolean;
}

const SecurePreviewOverlay: React.FC<SecurePreviewOverlayProps> = ({
  requiredPlanLabel = "AI Plan",
  watermarkText = "ResumeBuilder",
  onUpgrade,
  templateName = "Premium Template",
  isPremium = false,
}) => {
  const locked = isPremium; // Use isPremium as the lock state
  // Disable right-click and text selection when locked
  useEffect(() => {
    if (locked) {
      const disableContextMenu = (e: MouseEvent) => e.preventDefault();
      const disableSelection = (e: Event) => e.preventDefault();
      const disableKeyboard = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C')
        ) {
          e.preventDefault();
        }
      };

      document.addEventListener('contextmenu', disableContextMenu);
      document.addEventListener('selectstart', disableSelection);
      document.addEventListener('dragstart', disableSelection);
      document.addEventListener('keydown', disableKeyboard);

      return () => {
        document.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('selectstart', disableSelection);
        document.removeEventListener('dragstart', disableSelection);
        document.removeEventListener('keydown', disableKeyboard);
      };
    }
  }, [locked]);

  if (!locked) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 select-none">
      {/* Diagonal watermark pattern */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-15" 
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <pattern 
            id="diagonal-watermark" 
            patternUnits="userSpaceOnUse" 
            width="280" 
            height="140" 
            patternTransform="rotate(-35)"
          >
            <text 
              x="0" 
              y="30" 
              fontSize="18" 
              fontFamily="ui-sans-serif, system-ui" 
              fill="currentColor" 
              fillOpacity="0.6"
              fontWeight="600"
            >
              {watermarkText}
            </text>
            <text 
              x="0" 
              y="60" 
              fontSize="14" 
              fontFamily="ui-sans-serif, system-ui" 
              fill="currentColor" 
              fillOpacity="0.4"
            >
              Unlock to Export
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-watermark)" />
      </svg>

      {/* Blur overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

      {/* Lock overlay card */}
      <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-background/95 border-2 border-primary/20 rounded-xl p-6 shadow-elegant text-center max-w-sm animate-scale-in backdrop-blur-sm">
          <div className="flex justify-center mb-4">
            {isPremium ? (
              <Crown className="h-12 w-12 text-primary" />
            ) : (
              <Lock className="h-12 w-12 text-primary" />
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2">
            {isPremium ? "Premium Template" : "Secure Preview"}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-1">
            {templateName} requires:
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-primary">{requiredPlanLabel}</span>
          </div>
          
          <p className="text-xs text-muted-foreground mb-4">
            • Full template access
            <br />
            • PDF/DOCX export
            <br />
            • Remove watermarks
          </p>

          {onUpgrade && (
            <Button
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                onUpgrade(); 
              }}
              className="w-full btn-magic hover-glow"
              size="sm"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground mt-3 opacity-75">
            Screenshots and recordings are protected
          </p>
        </div>
      </div>

      {/* CSS injection to prevent copying */}
      <style>{`
        .pointer-events-none * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          pointer-events: none !important;
        }
        .pointer-events-auto {
          pointer-events: auto !important;
        }
        .pointer-events-auto * {
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
};

export default SecurePreviewOverlay;