import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Sparkles, Download, FileText, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/templates");
    } else {
      navigate("/auth");
    }
  };

  const handleViewTemplates = () => {
    navigate("/templates");
  };

  const handleViewPricing = () => {
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader />
      <HeroSection isAuthenticated={!!user} />

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to help you create the perfect resume
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Sparkles className="h-12 w-12 text-primary" />}
              title="AI-Powered Content"
              description="Get intelligent suggestions for bullet points, summaries, and skills based on your experience and target role."
              delay="delay-200"
              actionLabel="Try AI Features"
              onAction={handleViewPricing}
              clickable
            />
            
            <FeatureCard
              icon={<FileText className="h-12 w-12 text-primary" />}
              title="Professional Templates"
              description="Choose from multiple ATS-friendly templates designed by HR professionals to maximize your interview chances."
              delay="delay-300"
              actionLabel="Browse Templates"
              onAction={handleViewTemplates}
              clickable
            />
            
            <FeatureCard
              icon={<Download className="h-12 w-12 text-primary" />}
              title="One-Click Export"
              description="Export your resume to PDF format instantly, perfectly formatted and ready to send to potential employers."
              delay="delay-400"
              actionLabel="Get Started"
              onAction={handleGetStarted}
              clickable
            />
          </div>

          {/* Additional Features Row */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
            <FeatureCard
              icon={<Zap className="h-12 w-12 text-primary" />}
              title="Lightning Fast"
              description="Build your resume in under 5 minutes with our streamlined interface and smart auto-fill features."
              delay="delay-500"
            />
            
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Secure & Private"
              description="Your data is encrypted and secure. We never share your information with third parties."
              delay="delay-600"
            />
            
            <FeatureCard
              icon={<Clock className="h-12 w-12 text-primary" />}
              title="Real-time Preview"
              description="See your resume update in real-time as you type. No surprises, just perfect formatting."
              delay="delay-700"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container">
          <div className="text-center space-y-6 animate-fade-in-up">
            <h2 className="text-3xl font-bold">Ready to build your dream resume?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of professionals who've landed their dream jobs with ResumeBuilder
            </p>
            <Button size="lg" asChild className="transition-smooth hover:scale-105">
              <Link to={user ? "/templates" : "/auth"}>
                {user ? "Choose a Template" : "Start Building Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ResumeBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;