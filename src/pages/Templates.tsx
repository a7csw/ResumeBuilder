import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { FileText, ArrowLeft, Eye, Download, Filter, Sparkles, Star, Grid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "basic" | "premium">("all");

  const templates = [
    // Basic Templates
    {
      id: "classic",
      name: "Classic Professional",
      description: "Clean and traditional layout perfect for corporate environments",
      image: templateClassic,
      category: "Basic",
      isPremium: false,
      isAI: false,
      isPopular: true
    },
    {
      id: "minimal",
      name: "Simple & Clean",
      description: "Distraction-free design that puts focus on your content",
      image: templateMinimal,
      category: "Basic",
      isPremium: false,
      isAI: false,
      isPopular: false
    },
    {
      id: "student",
      name: "Student Focus",
      description: "Optimized layout for students and recent graduates",
      image: templateStudent,
      category: "Basic",
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
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: true
    },
    {
      id: "creative",
      name: "Creative Designer",
      description: "Eye-catching layout ideal for creative professionals",
      image: templateCreative,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false
    },
    {
      id: "technical",
      name: "Technical Expert",
      description: "Structured format optimized for technical roles",
      image: templateTechnical,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false
    },
    {
      id: "graduate",
      name: "Fresh Graduate",
      description: "Perfect for new graduates entering the job market",
      image: templateGraduate,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false
    },
    {
      id: "internship",
      name: "Internship Ready",
      description: "Designed for students seeking internships and entry-level positions",
      image: templateInternship,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false
    }
  ];


  const handleTemplateSelect = (templateId: string) => {
    navigate(`/builder?template=${templateId}`);
  };

  const basicTemplates = templates.filter(t => !t.isPremium);
  const premiumTemplates = templates.filter(t => t.isPremium);
  
  const filteredTemplates = selectedCategory === "basic" ? basicTemplates :
                          selectedCategory === "premium" ? premiumTemplates :
                          templates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader showBackButton backTo="/" />

      {/* Main Content */}
      <div className="container py-12">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our collection of ATS-friendly templates designed by HR professionals to help you land your dream job
          </p>
        </div>

        {/* Filter and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-up delay-200">
          <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="basic">Basic ({basicTemplates.length})</TabsTrigger>
              <TabsTrigger value="premium">Premium ({premiumTemplates.length})</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="transition-smooth"
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="transition-smooth"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className={`animate-fade-in-up delay-300 ${
          viewMode === "grid" 
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto" 
            : "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
        }`}>
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              {...template}
              onSelect={handleTemplateSelect}
              delay={index * 100}
              viewMode={viewMode}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up delay-400">
            <p className="text-lg text-muted-foreground">No templates found for the selected category.</p>
            <Button 
              onClick={() => setSelectedCategory("all")} 
              variant="outline" 
              className="mt-4"
            >
              Show All Templates
            </Button>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 text-center animate-fade-in-up delay-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{templates.length}</div>
              <div className="text-sm text-muted-foreground">Total Templates</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Successful Applications</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Templates;