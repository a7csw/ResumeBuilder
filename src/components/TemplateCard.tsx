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
  delay = 0
}: TemplateCardProps) => {
  // Browsing/selection is allowed for all. Access level is enforced at export/unlock time.
  const isLocked = false;

  return (
    <Card className={`shadow-elegant hover:shadow-glow transition-all duration-300 relative overflow-hidden ${isLocked ? 'opacity-60' : ''}`}>
      {isPopular && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-orange-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      

      {isPremium && !isAI && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary">Premium</Badge>
        </div>
      )}

      <div className="aspect-[3/4] bg-muted relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button 
          onClick={() => onSelect(id)}
          className="w-full"
        >
          Use Template
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;