import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProfileDropdown from "@/components/ProfileDropdown";
import { FileText, Sparkles, Download, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2 animate-scale-in">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <Link to="/templates" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </nav>
            <ThemeToggle />
            {loading ? (
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
            ) : user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in-up">
              Create Your Perfect Resume in Minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
              AI-powered resume builder with professional templates, smart suggestions, and one-click PDF export. 
              Stand out from the competition with a resume that gets you hired.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
              <Button size="lg" asChild className="transition-smooth hover:scale-105">
                <Link to="/builder">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try Free Preview
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="transition-smooth hover:scale-105">
                <Link to="/pricing">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Start with AI Templates
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-elegant transition-smooth hover:shadow-glow hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Content</CardTitle>
                <CardDescription>
                  Get intelligent suggestions for bullet points, summaries, and skills based on your experience and target role.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant transition-smooth hover:shadow-glow hover:scale-105 animate-fade-in-up delay-300">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Professional Templates</CardTitle>
                <CardDescription>
                  Choose from multiple ATS-friendly templates designed by HR professionals to maximize your interview chances.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant transition-smooth hover:shadow-glow hover:scale-105 animate-fade-in-up delay-400">
              <CardHeader>
                <Download className="h-12 w-12 text-primary mb-4" />
                <CardTitle>One-Click Export</CardTitle>
                <CardDescription>
                  Export your resume to PDF format instantly, perfectly formatted and ready to send to potential employers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container">
          <div className="text-center space-y-6 animate-fade-in-up">
            <h2 className="text-3xl font-bold">Ready to build your dream resume?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of professionals who've landed their dream jobs with ResumeAI
            </p>
            <Button size="lg" asChild className="transition-smooth hover:scale-105">
              <Link to={user ? "/builder" : "/auth"}>
                {user ? "Go to Builder" : "Start Building Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;