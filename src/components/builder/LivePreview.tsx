import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TemplatePreview from "@/components/TemplatePreview";
import { getTemplateConfig } from "@/lib/templateConfigs";

interface LivePreviewProps {
  templateId: string;
  resumeData: any;
  userType: "student" | "professional" | "freelancer";
  isLocked?: boolean;
  overlayComponent?: React.ReactNode;
}

const LivePreview = ({ 
  templateId, 
  resumeData, 
  userType, 
  isLocked = false,
  overlayComponent 
}: LivePreviewProps) => {
  const [isRendering, setIsRendering] = useState(false);
  const [debouncedData, setDebouncedData] = useState(resumeData);

  // Debounce resume data updates to avoid render thrash
  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => {
      setDebouncedData(resumeData);
      setIsRendering(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [resumeData]);

  const config = getTemplateConfig(templateId);
  
  // Show empty template with placeholders even when no data
  const getEmptyTemplate = () => ({
    personalInfo: {
      firstName: "John",
      lastName: "Doe", 
      title: "Your Professional Title",
      email: "your.email@example.com",
      phone: "+1 (555) 123-4567",
      location: "City, State",
      linkedin: "linkedin.com/in/yourname",
      website: "www.yourwebsite.com",
      industry: "Your Industry"
    },
    summary: "Your professional summary will appear here. This is where you highlight your key achievements, skills, and career objectives.",
    experience: [{
      id: "1",
      title: "Your Job Title",
      company: "Company Name",
      startDate: "2023-01",
      endDate: "Present",
      description: "Description of your role and responsibilities...",
      achievements: ["Key achievement 1", "Key achievement 2"]
    }],
    education: [{
      id: "1", 
      degree: "Your Degree",
      school: "University Name",
      graduationDate: "2023-05",
      gpa: "3.8"
    }],
    skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
    projects: [{
      id: "1",
      name: "Project Name",
      description: "Project description...",
      technologies: "Technologies used",
      date: "2023-12",
      link: "https://github.com/..."
    }],
    certifications: [{
      id: "1",
      name: "Certification Name", 
      issuer: "Issuing Organization",
      date: "2023-12"
    }]
  });

  const hasData = resumeData?.personalInfo?.firstName || resumeData?.personalInfo?.lastName;
  const displayData = hasData ? resumeData : getEmptyTemplate();

  return (
    <div className="relative">
      <Card className="w-full sticky top-6">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Live Preview
            </CardTitle>
            <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              {config.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRendering && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Updating...
              </div>
            )}
            {!hasData && (
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                Template Preview
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative p-4">
          <div className={isLocked ? 'blur-sm grayscale opacity-95 transition-smooth' : 'transition-smooth'}>
            <TemplatePreview 
              resumeData={hasData ? debouncedData : displayData}
              userType={userType}
              templateId={templateId}
              isPreview={!hasData}
            />
          </div>
          {isLocked && overlayComponent && (
            <div className="absolute inset-0 rounded-lg">
              {overlayComponent}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePreview;