import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Star } from "lucide-react";
import { useUserPlan } from "@/hooks/useUserPlan";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  isPremium?: boolean;
  isAI?: boolean;
  isPopular?: boolean;
  onSelect: (templateId: string) => void;
  delay?: number;
  viewMode?: "grid" | "list";
}

const TemplateCard = ({ 
  id, 
  name, 
  description, 
  image, 
  category, 
  isPremium = false, 
  isAI = false,
  isPopular = false,
  onSelect,
  delay = 0,
  viewMode = "grid"
}: TemplateCardProps) => {
  // Browsing/selection is allowed for all. Access level is enforced at export/unlock time.
  const isLocked = false;

  if (viewMode === "list") {
    return (
      <Card className={`shadow-elegant hover:shadow-glow transition-all duration-300 relative overflow-hidden ${isLocked ? 'opacity-60' : ''} hover:scale-[1.02]`}>
        <div className="flex">
          <div className="w-48 h-32 bg-muted relative flex-shrink-0">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
            {isLocked && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{name}</CardTitle>
                {isPopular && (
                  <Badge className="bg-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {isPremium && !isAI && (
                  <Badge variant="secondary">Premium</Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ATS-friendly • Professional design
              </div>
              <Button 
                onClick={() => onSelect(id)}
                className="px-6"
              >
                Use Template
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`shadow-elegant hover:shadow-glow transition-all duration-300 relative overflow-hidden ${isLocked ? 'opacity-60' : ''} hover:scale-105 cursor-pointer group`}>
      {isPopular && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-orange-500 text-white shadow-md">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      
      {isPremium && !isAI && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="shadow-md">Premium</Badge>
        </div>
      )}

      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">{name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
        <Button 
          onClick={() => onSelect(id)}
          className="w-full transition-smooth hover:scale-105"
        >
          Use Template
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;