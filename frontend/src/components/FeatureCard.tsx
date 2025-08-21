import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: string;
  actionLabel?: string;
  onAction?: () => void;
  clickable?: boolean;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = "delay-200", 
  actionLabel,
  onAction,
  clickable = false 
}: FeatureCardProps) => {
  const baseClasses = `shadow-elegant transition-smooth hover:shadow-glow hover:scale-105 animate-fade-in-up ${delay}`;
  const clickableClasses = clickable ? "cursor-pointer hover:border-primary/50" : "";

  const handleCardClick = () => {
    if (clickable && onAction) {
      onAction();
    }
  };

  return (
    <Card 
      className={`${baseClasses} ${clickableClasses}`}
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      {actionLabel && onAction && (
        <CardContent className="pt-0">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            variant="outline" 
            className="w-full transition-smooth hover:bg-primary hover:text-primary-foreground"
          >
            {actionLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default FeatureCard;