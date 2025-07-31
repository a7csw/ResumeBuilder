import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, Sparkles, Download, Zap, Users, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/builder");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Welcome back!</span>
                <Button onClick={() => navigate("/builder")}>
                  Go to Builder
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button onClick={handleGetStarted}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container text-center">
          <Badge className="mb-6" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Resume Builder
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
            Build Professional Resumes
            <br />
            in Minutes, Not Hours
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create stunning, ATS-friendly resumes with our AI-powered builder. 
            Get personalized suggestions and export to PDF instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="shadow-elegant">
              Start Building for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to help you create the perfect resume
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-elegant">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI-Powered Suggestions</CardTitle>
                <CardDescription>
                  Get intelligent recommendations for content, formatting, and improvements
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant">
              <CardHeader>
                <Download className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Instant PDF Export</CardTitle>
                <CardDescription>
                  Download your resume as a professional PDF with one click
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See your changes in real-time as you build your resume
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Multiple Templates</CardTitle>
                <CardDescription>
                  Choose from professionally designed templates for any industry
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>ATS-Friendly</CardTitle>
                <CardDescription>
                  Optimized for Applicant Tracking Systems used by employers
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-elegant">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Easy Editing</CardTitle>
                <CardDescription>
                  Simple drag-and-drop interface with intelligent section ordering
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container">
          <Card className="p-8 text-center shadow-elegant gradient-primary">
            <CardContent className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Build Your Perfect Resume?
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of professionals who've landed their dream jobs
              </p>
              <div className="flex items-center justify-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  AI-powered
                </div>
              </div>
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={handleGetStarted}
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
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
