import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FileText, Sparkles, Clock, Shield, Download, ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container relative">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in-up">
              Create Your Perfect Resume in Minutes
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
              Professional resume builder with AI-powered suggestions, premium templates, and instant PDF export. 
              Create stunning resumes that get you noticed and land your dream job.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up delay-300">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>2 minutes to complete</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>ATS-friendly templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>PDF download ready</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <Button 
              size="lg" 
              asChild 
              className="text-lg px-8 py-4 transition-smooth hover:scale-105 shadow-elegant hover:shadow-glow"
            >
              <Link to={isAuthenticated ? "/templates" : "/auth"}>
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Building Your Resume
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-lg px-8 py-4 transition-smooth hover:scale-105"
            >
              <Link to="/templates">
                <Play className="mr-2 h-5 w-5" />
                View Templates
              </Link>
            </Button>
          </div>

          {/* Additional info */}
          <p className="text-sm text-muted-foreground animate-fade-in-up delay-500">
            No credit card required • Start for free • Export ready in minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;