import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { showTestBanner } from '@/lib/flags';

interface TestModeBannerProps {
  onClose?: () => void;
}

const TestModeBanner: React.FC<TestModeBannerProps> = ({ onClose }) => {
  if (!showTestBanner()) {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-yellow-900 px-4 py-3 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm font-medium">
            <strong>TEST MODE ACTIVE</strong> - Payments disabled, all users treated as subscribed
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-yellow-900 hover:text-yellow-700 transition-colors"
            aria-label="Close test mode banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TestModeBanner;
