import React from "react";

interface SecurePreviewOverlayProps {
  locked: boolean;
  requiredPlanLabel?: string;
  watermarkText?: string;
  onUpgrade?: () => void;
}

const SecurePreviewOverlay: React.FC<SecurePreviewOverlayProps> = ({
  locked,
  requiredPlanLabel = "Basic",
  watermarkText = "ResumeBuilder",
  onUpgrade,
}) => {
  if (!locked) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      {/* Watermark pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
        <defs>
          <pattern id="wm" patternUnits="userSpaceOnUse" width="240" height="120" patternTransform="rotate(-25)">
            <text x="0" y="40" fontSize="22" fontFamily="ui-sans-serif, system-ui" fill="currentColor" fillOpacity="0.4">
              {watermarkText}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wm)" />
      </svg>

      {/* Dark veil for professionalism */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />

      {/* Message card */}
      <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-background/90 border border-border rounded-xl p-5 shadow-elegant text-center max-w-md animate-enter">
          <p className="text-sm text-muted-foreground mb-1">Secure Preview</p>
          <h3 className="text-lg font-semibold">Preview hidden until payment</h3>
          <p className="text-sm text-muted-foreground mt-2">This template requires: <span className="font-medium text-primary">{requiredPlanLabel}</span></p>
          {onUpgrade && (
            <button
              onClick={(e) => { e.preventDefault(); onUpgrade(); }}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
            >
              Upgrade to Unlock
            </button>
          )}
          <p className="text-xs text-muted-foreground mt-3">Screenshots and recordings are disabled.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurePreviewOverlay;
