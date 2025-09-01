import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";

const ResumeFormSimple = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader showBackButton={true} backTo="/form-selection" />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Loading Resume Form...
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Please wait while we prepare your customized form
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo="/form-selection" />
      
      <div className="container px-6 py-8 mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Resume Form - {type}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            This is a simplified version to test navigation
          </p>
        </div>
        
        <div className="text-center">
          <Button onClick={() => navigate("/form-selection")}>
            Back to Form Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeFormSimple;
