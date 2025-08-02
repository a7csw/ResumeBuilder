import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, Eye, Download } from "lucide-react";

// Import template images
import templateModern from "@/assets/template-modern.jpg";
import templateClassic from "@/assets/template-classic.jpg";
import templateMinimal from "@/assets/template-minimal.jpg";
import templateCreative from "@/assets/template-creative.jpg";
import templateTechnical from "@/assets/template-technical.jpg";

const Templates = () => {
  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      description: "Clean and contemporary design perfect for tech and creative industries",
      image: templateModern,
      features: ["Single column layout", "Modern typography", "Color accents", "ATS-friendly"]
    },
    {
      id: "classic",
      name: "Classic Executive",
      description: "Traditional format ideal for corporate and executive positions",
      image: templateClassic,
      features: ["Two column layout", "Professional styling", "Traditional format", "Executive focus"]
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      description: "Minimalist design that highlights your content with elegant simplicity",
      image: templateMinimal,
      features: ["Ultra-clean design", "Minimal formatting", "Focus on content", "Versatile"]
    },
    {
      id: "creative",
      name: "Creative Professional",
      description: "Unique design perfect for creative industries and portfolio presentation",
      image: templateCreative,
      features: ["Creative layout", "Visual elements", "Portfolio-friendly", "Industry-specific"]
    },
    {
      id: "technical",
      name: "Technical Specialist",
      description: "Structured format optimized for tech and engineering professionals",
      image: templateTechnical,
      features: ["Tech-focused sections", "Skills emphasis", "Project highlights", "Engineering-optimized"]
    }
  ];

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
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Resume Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our professionally designed templates to create a standout resume
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template, index) => (
            <Card 
              key={template.id} 
              className={`shadow-elegant hover:shadow-glow transition-smooth hover:scale-105 group animate-fade-in-up delay-${(index + 2) * 100}`}
            >
              <CardHeader className="pb-4">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Features:</h4>
                  <ul className="text-sm space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 transition-smooth hover:scale-105">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button asChild size="sm" className="flex-1 transition-smooth hover:scale-105">
                    <Link to="/builder">
                      Use Template
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in-up delay-500">
          <p className="text-muted-foreground mb-6">
            Ready to create your professional resume?
          </p>
          <Button asChild size="lg" className="transition-smooth hover:scale-105">
            <Link to="/auth">
              Get Started Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Templates;