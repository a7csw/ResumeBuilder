import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { ArrowLeft, FileText, Shield, RefreshCw } from "lucide-react";
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
              Legal Documents
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Complete legal information for NOVAECV
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

          {/* Legal Documents Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Terms & Conditions */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                  Terms & Conditions
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Complete terms and conditions governing your use of NOVAECV, including service description, user responsibilities, and legal obligations.
                </p>
                <Link to="/terms-conditions">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Read Terms & Conditions
                  </Button>
                </Link>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                  Privacy Policy
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  How we collect, use, and protect your personal information, including data handling practices and your privacy rights.
                </p>
                <Link to="/privacy-policy">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Read Privacy Policy
                  </Button>
                </Link>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <RefreshCw className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                  Refund Policy
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Our refund terms and conditions, including eligibility criteria, process, and timeline for refund requests.
                </p>
                <Link to="/refund-policy">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Read Refund Policy
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Quick Summary
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
              <p><strong>Service Information:</strong> NOVAECV is an AI-powered resume builder operated by Abdulrahman Rafid Sabri Al-Faiadi, an individual developer.</p>
              <p><strong>Contact:</strong> For any legal questions, please contact us at <a href="mailto:alfaiadiabood@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alfaiadiabood@gmail.com</a></p>
              <p><strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours.</p>
            </div>
          </section>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              By using NOVAECV, you agree to our Terms & Conditions, Privacy Policy, and Refund Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;