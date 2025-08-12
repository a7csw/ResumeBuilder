import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TemplatePreview from "@/components/TemplatePreview";

interface LivePreviewProps {
  templateId: string;
  resumeData: any;
  userType: "student" | "professional" | "freelancer";
  isLocked?: boolean;
  overlayComponent?: React.ReactNode;
}

const LivePreview = ({ 
  templateId, 
  resumeData, 
  userType, 
  isLocked = false,
  overlayComponent 
}: LivePreviewProps) => {
  const [isRendering, setIsRendering] = useState(false);
  const [debouncedData, setDebouncedData] = useState(resumeData);

  // Debounce resume data updates to avoid render thrash
  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => {
      setDebouncedData(resumeData);
      setIsRendering(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [resumeData]);

  return (
    <div className="relative">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Live Template Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            {isRendering && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Rendering...
              </div>
            )}
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {templateId}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className={isLocked ? 'blur-sm grayscale opacity-95 transition-smooth' : 'transition-smooth'}>
            <TemplatePreview 
              resumeData={debouncedData}
              userType={userType}
              templateId={templateId}
            />
          </div>
          {isLocked && overlayComponent && (
            <div className="absolute inset-0">
              {overlayComponent}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePreview;