import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { ArrowLeft, Sparkles, Users, Zap } from "lucide-react";
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
              <Sparkles className="w-4 h-4" />
              About This Project
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Free Resume Builder
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              A completely free, open-access AI-powered resume builder
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

          {/* Features Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Free AI Generation */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                  AI-Powered
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Generate professional resume content using advanced AI technology. Completely free with unlimited usage.
                </p>
              </div>
            </div>
            
            {/* All Templates Free */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                  All Templates
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Access to all professional resume templates. No premium restrictions or watermarks.
                </p>
              </div>
            </div>
            
            {/* Unlimited Export */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                  Unlimited Export
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Download your resumes in PDF format as many times as you want. No limits or restrictions.
                </p>
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              About This Project
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
              <p>
                This is a free, open-access resume builder designed to help everyone create professional resumes without any cost barriers.
              </p>
              <p>
                <strong>Key Features:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-powered content generation</li>
                <li>Multiple professional templates</li>
                <li>PDF export functionality</li>
                <li>No payment required</li>
                <li>No usage limits</li>
                <li>No watermarks</li>
                <li>Clean, ad-free experience</li>
              </ul>
            </div>
          </section>
          
          {/* Usage Guide */}
          <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              How to Use
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>Create an account or sign in</li>
                <li>Fill out your resume information</li>
                <li>Use AI to enhance your content (optional)</li>
                <li>Choose from any available template</li>
                <li>Download your professional resume as PDF</li>
                <li>Create as many resumes as you need</li>
              </ol>
              <div className="mt-6 text-center">
                <Link to="/form-selection">
                  <Button 
                    size="lg" 
                    className="px-8 py-3 text-lg bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Building Your Resume
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;