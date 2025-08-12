import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Palette, ArrowRight } from "lucide-react";

interface ModeSelectorProps {
  onModeSelect: (mode: 'student' | 'professional' | 'freelancer') => void;
  selectedMode?: 'student' | 'professional' | 'freelancer';
}

const ModeSelector = ({ onModeSelect, selectedMode }: ModeSelectorProps) => {
  const modes = [
    {
      id: 'student' as const,
      title: 'Student Mode',
      description: 'Perfect for students, graduates, and early career professionals',
      icon: GraduationCap,
      features: [
        'Education-focused sections',
        'Academic projects showcase',
        'Volunteer experience',
        'Internship highlighting',
        'GPA and coursework details',
        'Awards and achievements'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
      id: 'professional' as const,
      title: 'Professional Mode',
      description: 'Ideal for experienced professionals and career changers',
      icon: Briefcase,
      features: [
        'Work experience emphasis',
        'Achievement-focused content',
        'Professional certifications',
        'Leadership highlights',
        'Industry-specific skills',
        'Portfolio and projects'
      ],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      textColor: 'text-green-700 dark:text-green-300'
    },
    {
      id: 'freelancer' as const,
      title: 'Freelancer Mode',
      description: 'Designed for freelancers, consultants, and creative professionals',
      icon: Palette,
      features: [
        'Project portfolio focus',
        'Client testimonials',
        'Creative work showcase',
        'Flexible project timeline',
        'Skills-based organization',
        'Personal branding'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      textColor: 'text-purple-700 dark:text-purple-300'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Choose Your Resume Mode
        </h2>
        <p className="text-muted-foreground text-lg">
          Select the mode that best fits your career stage and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <Card 
              key={mode.id}
              className={`relative transition-all duration-300 cursor-pointer hover-lift ${
                isSelected 
                  ? 'ring-2 ring-primary shadow-glow scale-105' 
                  : 'hover:shadow-elegant'
              }`}
              onClick={() => onModeSelect(mode.id)}
            >
              <CardHeader className={`${mode.bgColor} relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-10`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-8 h-8 ${mode.textColor}`} />
                    {isSelected && (
                      <Badge variant="default" className="bg-primary">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <CardTitle className={`text-xl ${mode.textColor}`}>
                    {mode.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {mode.description}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <h4 className="font-semibold text-sm text-foreground mb-3">
                  Key Features:
                </h4>
                <ul className="space-y-2">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${mode.color.replace('from-', 'bg-').replace(' to-purple-600', '').replace(' to-green-600', '').replace(' to-blue-600', '')} mr-2`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-4 bg-gradient-to-r ${mode.color} hover:opacity-90 transition-smooth`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onModeSelect(mode.id);
                  }}
                >
                  Select {mode.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMode && (
        <div className="text-center animate-fade-in-up">
          <p className="text-muted-foreground">
            Great choice! You've selected <span className="font-semibold text-primary">
              {modes.find(m => m.id === selectedMode)?.title}
            </span>. 
            Your resume form will be optimized for this career stage.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;