import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Upload, Sparkles, Download, Lock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    industry: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    date: string;
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

interface ResumeBuilderProps {
  userType: "student" | "professional" | "freelancer";
  buildingMode: "manual" | "ai";
  hasPaidPlan: boolean;
  resumeData: ResumeData;
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
}

const ResumeBuilder = ({ userType, buildingMode, hasPaidPlan, resumeData, setResumeData }: ResumeBuilderProps) => {
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState("");
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      achievements: []
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      graduationDate: "",
      gpa: ""
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      date: "",
      link: ""
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: ""
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const enhanceWithAI = async (field: string) => {
    if (buildingMode === "manual") return;
    
    setIsEnhancing(field);
    
    try {
      const currentContent = getFieldContent(field);
      
      const { data, error } = await supabase.functions.invoke('ai-enhance-resume', {
        body: {
          section: field,
          content: currentContent,
          userType,
          jobTitle: resumeData.personalInfo.title || '',
          industry: resumeData.personalInfo.industry || ''
        }
      });

      if (error) throw error;

      // Update the field with AI-enhanced content
      updateFieldContent(field, data.enhancedContent);
      
      toast({
        title: "AI Enhancement Complete",
        description: `Your ${field} has been optimized with AI suggestions!`,
      });
    } catch (error) {
      console.error('AI enhancement error:', error);
      toast({
        title: "AI Enhancement Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(null);
    }
  };

  const getFieldContent = (field: string): string => {
    switch (field) {
      case 'summary':
        return resumeData.summary || '';
      case 'skills':
        return resumeData.skills.join(', ');
      default:
        return '';
    }
  };

  const updateFieldContent = (field: string, content: string) => {
    switch (field) {
      case 'summary':
        setResumeData(prev => ({ ...prev, summary: content }));
        break;
      case 'skills':
        const skillsArray = content.split(',').map(skill => skill.trim()).filter(Boolean);
        setResumeData(prev => ({ ...prev, skills: skillsArray }));
        break;
    }
  };

  const handleExport = async () => {
    if (!hasPaidPlan) {
      return; // This will be handled by the AlertDialog
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-pdf', {
        body: {
          resumeData,
          templateId: 'modern'
        }
      });

      if (error) {
        if (error.message === 'Payment required') {
          toast({
            title: "Payment Required",
            description: "Please upgrade to a paid plan to export resumes.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Generate PDF using jsPDF
      await generatePDF();
      
      toast({
        title: "Resume Exported",
        description: "Your resume has been downloaded as a PDF!",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const generatePDF = async () => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) return;

    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`resume-${resumeData.personalInfo.firstName || 'user'}.pdf`);
  };

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto pr-4">
      {/* Personal Information */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={resumeData.personalInfo.firstName}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={resumeData.personalInfo.lastName}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                placeholder="Software Engineer"
                value={resumeData.personalInfo.title}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, title: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="Technology"
                value={resumeData.personalInfo.industry}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, industry: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={resumeData.personalInfo.email}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={resumeData.personalInfo.phone}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                value={resumeData.personalInfo.location}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, location: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/johndoe"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                placeholder="www.johndoe.com"
                value={resumeData.personalInfo.website}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, website: e.target.value }
                }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Professional Summary
            </CardTitle>
            {buildingMode === "ai" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => enhanceWithAI("summary")}
                disabled={isEnhancing === "summary"}
                className="flex items-center gap-2 hover-scale"
              >
                <Sparkles className={`w-4 h-4 ${isEnhancing === "summary" ? "animate-spin" : ""}`} />
                {isEnhancing === "summary" ? "Enhancing..." : "Enhance with AI"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
              value={resumeData.summary}
              onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
              className="min-h-[100px] transition-smooth focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {userType === "student" ? "Experience (Optional)" : "Work Experience"}
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addExperience}
              className="flex items-center gap-2 hover-scale"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="border rounded-lg p-4 relative hover-scale transition-smooth">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 hover-scale"
                onClick={() => removeExperience(exp.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...resumeData.experience];
                      updated[index] = { ...updated[index], title: e.target.value };
                      setResumeData(prev => ({ ...prev, experience: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...resumeData.experience];
                      updated[index] = { ...updated[index], company: e.target.value };
                      setResumeData(prev => ({ ...prev, experience: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => {
                      const updated = [...resumeData.experience];
                      updated[index] = { ...updated[index], startDate: e.target.value };
                      setResumeData(prev => ({ ...prev, experience: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => {
                      const updated = [...resumeData.experience];
                      updated[index] = { ...updated[index], endDate: e.target.value };
                      setResumeData(prev => ({ ...prev, experience: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  {buildingMode === "ai" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => enhanceWithAI("experience")}
                      className="flex items-center gap-2 hover-scale"
                    >
                      <Sparkles className="w-4 h-4" />
                      Enhance with AI
                    </Button>
                  )}
                </div>
                <Textarea
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...resumeData.experience];
                    updated[index] = { ...updated[index], description: e.target.value };
                    setResumeData(prev => ({ ...prev, experience: updated }));
                  }}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Education
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addEducation}
              className="flex items-center gap-2 hover-scale"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-4 relative hover-scale transition-smooth">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 hover-scale"
                onClick={() => removeEducation(edu.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[index] = { ...updated[index], degree: e.target.value };
                      setResumeData(prev => ({ ...prev, education: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>School</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[index] = { ...updated[index], school: e.target.value };
                      setResumeData(prev => ({ ...prev, education: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Date</Label>
                  <Input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[index] = { ...updated[index], graduationDate: e.target.value };
                      setResumeData(prev => ({ ...prev, education: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {userType === "student" && (
                  <div className="space-y-2">
                    <Label>GPA (Optional)</Label>
                    <Input
                      value={edu.gpa}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[index] = { ...updated[index], gpa: e.target.value };
                        setResumeData(prev => ({ ...prev, education: updated }));
                      }}
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Projects
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addProject}
              className="flex items-center gap-2 hover-scale"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.projects.map((project, index) => (
            <div key={project.id} className="border rounded-lg p-4 relative hover-scale transition-smooth">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 hover-scale"
                onClick={() => removeProject(project.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setResumeData(prev => ({ ...prev, projects: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[index] = { ...updated[index], technologies: e.target.value };
                      setResumeData(prev => ({ ...prev, projects: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="month"
                    value={project.date}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[index] = { ...updated[index], date: e.target.value };
                      setResumeData(prev => ({ ...prev, projects: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link (Optional)</Label>
                  <Input
                    value={project.link}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[index] = { ...updated[index], link: e.target.value };
                      setResumeData(prev => ({ ...prev, projects: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => {
                    const updated = [...resumeData.projects];
                    updated[index] = { ...updated[index], description: e.target.value };
                    setResumeData(prev => ({ ...prev, projects: updated }));
                  }}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Skills
            </CardTitle>
            {buildingMode === "ai" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => enhanceWithAI("skills")}
                disabled={isEnhancing === "skills"}
                className="flex items-center gap-2 hover-scale"
              >
                <Sparkles className={`w-4 h-4 ${isEnhancing === "skills" ? "animate-spin" : ""}`} />
                {isEnhancing === "skills" ? "Suggesting..." : "Suggest Skills"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="transition-smooth focus:ring-2 focus:ring-primary/20"
            />
            <Button onClick={addSkill} variant="outline" className="hover-scale">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm hover-scale transition-smooth cursor-pointer"
              >
                <span>{skill}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(skill)}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <Minus className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications Section */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Certifications
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addCertification}
              className="flex items-center gap-2 hover-scale"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.certifications.map((cert, index) => (
            <div key={cert.id} className="border rounded-lg p-4 relative hover-scale transition-smooth">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 hover-scale"
                onClick={() => removeCertification(cert.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...resumeData.certifications];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setResumeData(prev => ({ ...prev, certifications: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuer</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => {
                      const updated = [...resumeData.certifications];
                      updated[index] = { ...updated[index], issuer: e.target.value };
                      setResumeData(prev => ({ ...prev, certifications: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => {
                      const updated = [...resumeData.certifications];
                      updated[index] = { ...updated[index], date: e.target.value };
                      setResumeData(prev => ({ ...prev, certifications: updated }));
                    }}
                    className="transition-smooth focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Export Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {hasPaidPlan ? (
              <Button 
                onClick={handleExport} 
                className="flex items-center gap-2 hover-scale bg-gradient-primary"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 relative hover-scale"
                  >
                    <Lock className="w-4 h-4" />
                    Export as PDF
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
                    <AlertDialogDescription>
                      Upgrade your plan to unlock PDF export and professional resume features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Upgrade Now</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            {!hasPaidPlan && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 hover-scale">
                    <Lock className="w-4 h-4" />
                    Export as Word
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
                    <AlertDialogDescription>
                      Upgrade your plan to unlock Word export and other premium features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Upgrade Now</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;