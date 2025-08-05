import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, Eye, Download, Filter, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import { useUserPlan } from "@/hooks/useUserPlan";

// Import template images
import templateModern from "@/assets/template-modern.jpg";
import templateClassic from "@/assets/template-classic.jpg";
import templateMinimal from "@/assets/template-minimal.jpg";
import templateCreative from "@/assets/template-creative.jpg";
import templateTechnical from "@/assets/template-technical.jpg";
import templateStudent from "@/assets/template-student.jpg";
import templateGraduate from "@/assets/template-graduate.jpg";
import templateInternship from "@/assets/template-internship.jpg";

const Templates = () => {
  const navigate = useNavigate();
  const { userPlan } = useUserPlan();

  const templates = [
    // Free Templates
    {
      id: "classic",
      name: "Classic Professional",
      description: "Clean and traditional layout perfect for corporate environments",
      image: templateClassic,
      category: "Professional",
      isPremium: false,
      isAI: false,
      isPopular: true
    },
    {
      id: "minimal",
      name: "Simple & Clean",
      description: "Distraction-free design that puts focus on your content",
      image: templateMinimal,
      category: "Minimal",
      isPremium: false,
      isAI: false,
      isPopular: false
    },
    {
      id: "student",
      name: "Student Focus",
      description: "Optimized layout for students and recent graduates",
      image: templateStudent,
      category: "Student",
      isPremium: false,
      isAI: false,
      isPopular: true
    },
    
    // Premium Templates
    {
      id: "modern",
      name: "Modern Minimalist", 
      description: "Contemporary design with modern typography",
      image: templateModern,
      category: "Modern",
      isPremium: true,
      isAI: false,
      isPopular: true
    },
    {
      id: "creative",
      name: "Creative Designer",
      description: "Eye-catching layout ideal for creative professionals",
      image: templateCreative,
      category: "Creative",
      isPremium: true,
      isAI: false,
      isPopular: false
    },
    {
      id: "technical",
      name: "Technical Expert",
      description: "Structured format optimized for technical roles",
      image: templateTechnical,
      category: "Technical",
      isPremium: true,
      isAI: false,
      isPopular: false
    },
    {
      id: "graduate",
      name: "Fresh Graduate",
      description: "Perfect for new graduates entering the job market",
      image: templateGraduate,
      category: "Student",
      isPremium: true,
      isAI: false,
      isPopular: false
    },
    {
      id: "internship",
      name: "Internship Ready",
      description: "Designed for students seeking internships and entry-level positions",
      image: templateInternship,
      category: "Student",
      isPremium: true,
      isAI: false,
      isPopular: false
    },
    
    // AI-Generated Templates (Pro only)
    {
      id: "ai-executive",
      name: "Executive Leadership",
      description: "AI-optimized layout for C-suite and executive positions",
      image: templateModern,
      category: "AI-Generated",
      isPremium: true,
      isAI: true,
      isPopular: false
    },
    {
      id: "ai-startup",
      name: "Startup Innovator",
      description: "Dynamic AI-generated design for startup environments",
      image: templateCreative,
      category: "AI-Generated", 
      isPremium: true,
      isAI: true,
      isPopular: false
    }
  ];


  const handleTemplateSelect = (templateId: string) => {
    navigate(`/builder?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Back to home</span>
          </Link>
          <div className="flex items-center space-x-2 ml-6">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold">ResumeAI</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of ATS-friendly templates designed by HR professionals
          </p>
        </div>


        {/* Most Popular Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Most Popular Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {templates.filter(t => t.isPopular).map((template, index) => (
              <TemplateCard
                key={template.id}
                {...template}
                onSelect={handleTemplateSelect}
                delay={index * 100}
              />
            ))}
          </div>
        </div>

        {/* All Templates */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            All Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {templates.map((template, index) => (
              <TemplateCard
                key={template.id}
                {...template}
                onSelect={handleTemplateSelect}
                delay={index * 100}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Templates;