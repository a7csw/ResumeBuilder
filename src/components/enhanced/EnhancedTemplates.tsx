import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Crown, Star, Sparkles } from "lucide-react";
import TemplateCard from "@/components/TemplateCard";
import { useEnhancedUserPlan } from "@/hooks/useEnhancedUserPlan";

// Template images - import all available
import templateModern from "@/assets/template-modern.jpg";
import templateClassic from "@/assets/template-classic.jpg";
import templateMinimal from "@/assets/template-minimal.jpg";
import templateCreative from "@/assets/template-creative.jpg";
import templateTechnical from "@/assets/template-technical.jpg";
import templateStudent from "@/assets/template-student.jpg";
import templateGraduate from "@/assets/template-graduate.jpg";
import templateInternship from "@/assets/template-internship.jpg";

interface EnhancedTemplatesProps {
  onTemplateSelect: (templateId: string) => void;
}

const EnhancedTemplates = ({ onTemplateSelect }: EnhancedTemplatesProps) => {
  const { userPlan, canAccessTemplate } = useEnhancedUserPlan();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "basic" | "premium">("all");

  const templates = [
    // Basic Templates (3 free)
    {
      id: "classic",
      name: "Classic Professional",
      description: "Clean and traditional layout perfect for corporate environments",
      image: templateClassic,
      category: "Basic",
      isPremium: false,
      isAI: false,
      isPopular: true,
      tags: ["ATS-Friendly", "Corporate", "Traditional"]
    },
    {
      id: "minimal",
      name: "Simple & Clean",
      description: "Distraction-free design that puts focus on your content",
      image: templateMinimal,
      category: "Basic",
      isPremium: false,
      isAI: false,
      isPopular: false,
      tags: ["Minimal", "ATS-Friendly", "Clean"]
    },
    {
      id: "student", 
      name: "Student Focus",
      description: "Optimized layout for students and recent graduates",
      image: templateStudent,
      category: "Basic",
      isPremium: false,
      isAI: false,
      isPopular: true,
      tags: ["Student", "Graduate", "Entry-Level"]
    },
    
    // Premium Templates (8 premium)
    {
      id: "modern",
      name: "Modern Executive", 
      description: "Contemporary design with modern typography and professional flair",
      image: templateModern,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: true,
      tags: ["Executive", "Modern", "Leadership"]
    },
    {
      id: "creative",
      name: "Creative Designer",
      description: "Eye-catching layout ideal for creative professionals and portfolios",
      image: templateCreative,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false,
      tags: ["Creative", "Design", "Portfolio"]
    },
    {
      id: "technical",
      name: "Tech Professional",
      description: "Structured format optimized for technical and engineering roles",
      image: templateTechnical,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false,
      tags: ["Technical", "Engineering", "Development"]
    },
    {
      id: "graduate",
      name: "Fresh Graduate Pro",
      description: "Perfect for new graduates entering competitive job markets",
      image: templateGraduate,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false,
      tags: ["Graduate", "Entry-Level", "Professional"]
    },
    {
      id: "internship",
      name: "Internship Ready",
      description: "Designed for students seeking internships and entry positions",
      image: templateInternship,
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false,
      tags: ["Internship", "Student", "Entry"]
    },
    {
      id: "executive",
      name: "Executive Leadership",
      description: "Sophisticated template for C-level and senior management roles",
      image: templateModern, // Using modern as placeholder
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: true,
      tags: ["Executive", "Leadership", "C-Level"]
    },
    {
      id: "tech-lead",
      name: "Tech Lead",
      description: "Developer-focused template with modern tech aesthetic",
      image: templateTechnical, // Using technical as placeholder
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: true,
      tags: ["Tech Lead", "Development", "Programming"]
    },
    {
      id: "innovator",
      name: "Innovation Specialist",
      description: "Creative template for innovation roles and startup environments",
      image: templateCreative, // Using creative as placeholder
      category: "Premium", 
      isPremium: true,
      isAI: false,
      isPopular: false,
      tags: ["Innovation", "Startup", "Creative"]
    },
    {
      id: "consultant",
      name: "Management Consultant",
      description: "Professional template optimized for consulting and advisory roles",
      image: templateClassic, // Using classic as placeholder
      category: "Premium",
      isPremium: true,
      isAI: false,
      isPopular: false,
      tags: ["Consulting", "Advisory", "Professional"]
    }
  ];

  const basicTemplates = templates.filter(t => !t.isPremium);
  const premiumTemplates = templates.filter(t => t.isPremium);
  
  const filteredTemplates = selectedCategory === "basic" ? basicTemplates :
                           selectedCategory === "premium" ? premiumTemplates :
                           templates;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
          Professional Resume Templates
        </h2>
        <p className="text-muted-foreground mb-4">
          Choose from our collection of ATS-friendly templates designed by HR professionals
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{templates.length} Templates</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">ATS Optimized</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">PDF Export</Badge>
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              All ({templates.length})
            </TabsTrigger>
            <TabsTrigger value="basic" className="flex items-center gap-2">
              Basic ({basicTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Premium ({premiumTemplates.length})
            </TabsTrigger>
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
      <div className={`animate-fade-in-up ${
        viewMode === "grid" 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
      }`}>
        {filteredTemplates.map((template, index) => {
          const hasAccess = canAccessTemplate(template.id, template.isPremium);
          
          return (
            <div key={template.id} className="relative">
              <TemplateCard
                {...template}
                onSelect={onTemplateSelect}
                delay={index * 100}
                viewMode={viewMode}
                disabled={!hasAccess}
              />
              
              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}
              
              {/* Popular Badge */}
              {template.isPopular && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              {/* Access Lock Overlay */}
              {!hasAccess && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-20">
                  <div className="text-center text-white p-4">
                    <Crown className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Premium Template</p>
                    <p className="text-sm opacity-90">Upgrade to access</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
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

      {/* Plan Upgrade Prompt */}
      {selectedCategory === "premium" && !userPlan.canUseAITemplates && (
        <div className="text-center py-8 px-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <Crown className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Premium Templates</h3>
          <p className="text-gray-600 mb-4">
            Access our full collection of professionally designed templates with AI or Pro plans.
          </p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <a href="/pricing">View Plans</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedTemplates;