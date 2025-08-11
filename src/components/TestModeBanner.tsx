import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { showTestBanner } from '@/lib/env';

const TestModeBanner: React.FC = () => {
  // Show banner when test mode is active
  if (!showTestBanner) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 shadow-md">
      <div className="container flex items-center justify-center gap-3 text-center">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            TEST MODE
          </Badge>
          <span className="font-medium">
            All premium features unlocked • No payments required • Full access enabled
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestModeBanner;