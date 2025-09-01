import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.warn(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      <div className="container px-6 py-20 mx-auto max-w-4xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </Button>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
            Path: {location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
