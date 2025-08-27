import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/30 to-gray-100/30 dark:from-slate-800/30 dark:to-gray-800/30"></div>
      
      <div className="relative z-10 container px-6 py-12 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">
              <FileText className="w-4 h-4" />
              Legal Information
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Terms of Service
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            {/* Back to Home Button */}
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Content Section */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300">
              <p>
                Welcome to NovaECV's Terms of Service. This page outlines the terms and conditions that govern your use of our AI-powered resume builder platform.
              </p>
              
              <p>
                By accessing and using NovaECV, you agree to be bound by these terms. Our service is designed to help you create professional, ATS-optimized resumes with the power of artificial intelligence.
              </p>
              
              <p>
                We are committed to providing a secure, reliable, and user-friendly platform for resume creation. Our terms ensure fair usage while protecting both our users and our service.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                  Key Points:
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>You retain ownership of your resume content</li>
                  <li>We process payments securely through Paddle</li>
                  <li>AI-generated content should be reviewed before use</li>
                  <li>Fair usage policies apply to prevent abuse</li>
                  <li>Your privacy is protected as outlined in our Privacy Policy</li>
                </ul>
              </div>
              
              <p>
                For the complete Terms of Service, please refer to our detailed legal documentation. If you have any questions about these terms, please contact our support team.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              By using NovaECV, you acknowledge that you have read and agree to these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;