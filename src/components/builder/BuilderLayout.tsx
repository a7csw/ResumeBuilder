import { ReactNode } from "react";

interface BuilderLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

const BuilderLayout = ({ leftPanel, rightPanel }: BuilderLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-6">
        {/* Responsive two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Panel - Form Editor */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            {leftPanel}
          </div>

          {/* Right Panel - Live Preview */}
          <div className="sticky top-24 relative">
            {rightPanel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderLayout;