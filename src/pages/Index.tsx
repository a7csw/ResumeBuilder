import { useState } from "react";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Shield, 
  Clock, 
  Star,
  Users,
  Trophy,
  CheckCircle2,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  // Demo mode - no backend connections
  const [user] = useState(null); // Always null for demo
  const navigate = useNavigate();

  const handleBuildResume = () => {
    // Skip authentication for demo - go directly to form selection
    navigate("/form-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements - Optimized for performance */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container px-6 py-20 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full animate-fade-in-up">
              <Star className="w-4 h-4" />
              Trusted by 10,000+ professionals
            </div>
            
            {/* Main Heading */}
                          <div className="flex items-center justify-center mb-8 animate-fade-in-up delay-100">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                    NOV
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">A</span>
                  <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                    E
                  </span>
                  <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                    CV
                  </span>
                </h1>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-slate-800 dark:text-slate-200 animate-fade-in-up delay-200">
                AI-Powered Resume Builder
              </h2>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-300">
              Transform your career story into a stunning, ATS-optimized resume with the power of AI. Professional plans starting at $5. Join thousands who've landed their dream jobs.
            </p>
            
            {/* CTA Button */}
            <div className="animate-fade-in-up delay-600">
              <Button 
                onClick={handleBuildResume}
                size="lg" 
                className="px-12 py-6 text-lg bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create My Resume
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mt-16 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up delay-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                Professional templates
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                AI-powered optimization
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                5-minute setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-800">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to help you create the perfect resume that gets you hired
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">AI-Powered Content</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Get intelligent suggestions for bullet points, summaries, and skills based on your experience and target role.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up delay-400">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Professional Templates</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose from multiple ATS-friendly templates designed by HR professionals to maximize your interview chances.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up delay-600">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Build your resume in under 5 minutes with our streamlined interface and smart auto-fill features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Perfect for Every Professional
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Tailored experiences for different career paths and experience levels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Professionals */}
            <div className="group p-8 bg-white dark:bg-slate-800 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Professionals</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Showcase your career progression, achievements, and leadership experience with executive-level templates.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Career Growth</span>
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Leadership</span>
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Executive</span>
              </div>
            </div>
            
            {/* Freelancers */}
            <div className="group p-8 bg-white dark:bg-slate-800 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up delay-400">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Freelancers</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Highlight your diverse projects, client testimonials, and specialized skills to attract premium clients.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Portfolio</span>
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Clients</span>
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Projects</span>
              </div>
            </div>
            
            {/* Students */}
            <div className="group p-8 bg-white dark:bg-slate-800 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up delay-600">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Students</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Emphasize your education, internships, and potential to land your first dream job or internship.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Education</span>
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Internships</span>
                <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">Entry Level</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-700 to-gray-700">
        <div className="container mx-auto">
          <div className="text-center space-y-8 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Build Your Dream Resume?
            </h2>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Join thousands of professionals who've landed their dream jobs with our AI-powered resume builder
            </p>
            <Button 
              onClick={handleBuildResume}
              size="lg" 
              variant="outline"
              className="px-12 py-6 text-lg bg-white text-slate-700 hover:bg-slate-50 border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-slate-400 via-gray-300 to-slate-400 bg-clip-text text-transparent tracking-tight mb-4">
            NOVA<span className="text-slate-500">E</span>CV
          </div>
          <p className="text-slate-400">&copy; 2025 NovaCV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;