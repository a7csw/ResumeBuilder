import React from 'react';

const TestModeBanner: React.FC = () => {
  // Demo mode - no test banner
  return null;

  return (
    <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-4 py-3 shadow-md">
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