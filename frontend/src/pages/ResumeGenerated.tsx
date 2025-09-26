import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { 
  CheckCircle2, 
  Download, 
  Eye, 
  ArrowRight, 
  Sparkles,
  Star,
  FileText,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { localStorage_, validateResumeData, safeNavigate } from "@/lib/navigation";

const ResumeGenerated = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Get form data from navigation state or localStorage
    let data = location.state?.formData;
    
    if (!data) {
      data = localStorage_.get('resumeFormData');
    }
    
    if (data && validateResumeData(data)) {
      setFormData(data);
    } else {
      // If no valid form data is available, redirect to form selection
      safeNavigate(navigate, "/form-selection", { replace: true });
      return;
    }
    
    // Simulate generation process
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleDownload = () => {
    // Redirect to preview page for download
    navigate("/resume-preview", { state: { resumeData: formData, selectedPlan: "free" } });
  };

  const handleViewResume = () => {
    navigate("/resume-preview", { state: { resumeData: formData, selectedPlan: "free" } });
  };

  const handleCreateNew = () => {
    safeNavigate(navigate, "/form-selection");
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Generating Your Resume...
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our AI is optimizing your resume for maximum impact
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container px-6 py-12 mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            Success!
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Your Resume Has Been Generated!
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your professional resume is ready with AI optimization and industry insights.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* View Resume */}
          <Card className="animate-fade-in-up delay-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewResume}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Preview Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                See how your resume looks with professional formatting and layout.
              </p>
              <Button className="w-full" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Resume
              </Button>
            </CardContent>
          </Card>

          {/* Download Resume */}
          <Card className="animate-fade-in-up delay-300 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleDownload}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                Download PDF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Get your resume in high-quality PDF format, ready to send to employers.
              </p>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Highlight */}
        <Card className="animate-fade-in-up delay-400 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm">ATS-Optimized Format</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm">AI-Enhanced Content</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm">Professional Templates</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm">Industry Insights</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm">Multiple Formats</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm">Unlimited Revisions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center animate-fade-in-up delay-500">
          <Button 
            onClick={handleCreateNew}
            size="lg"
            className="px-8 py-4 text-lg bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FileText className="w-5 h-5 mr-2" />
            Create Another Resume
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            ✨ All features are completely free with unlimited usage
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerated;
