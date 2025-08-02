import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, X, Lock, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    graduationYear: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
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
}

const ResumeBuilder = ({ userType, buildingMode, hasPaidPlan }: ResumeBuilderProps) => {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: { fullName: "", email: "", phone: "", location: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });

  const [newSkill, setNewSkill] = useState("");

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      description: ""
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
      graduationYear: "",
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
      technologies: ""
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
    
    toast({
      title: "AI Enhancement",
      description: "AI enhancement feature coming soon!",
    });
  };

  const handleExport = () => {
    if (!hasPaidPlan) {
      return; // Dialog will handle this
    }
    
    toast({
      title: "Exporting Resume",
      description: "Your resume is being generated...",
    });
  };

  const isStudentMode = userType === "student";

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={resumeData.personalInfo.location}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, location: e.target.value }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="animate-fade-in-up delay-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Professional Summary</CardTitle>
            {buildingMode === "ai" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => enhanceWithAI("summary")}
                className="btn-magic"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Enhance with AI
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={isStudentMode ? 
              "Write a brief summary highlighting your academic achievements, relevant coursework, and career goals..." :
              "Write a compelling professional summary that highlights your key achievements and career objectives..."
            }
            value={resumeData.summary}
            onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="animate-fade-in-up delay-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-4 relative hover-lift">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeEducation(edu.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[index] = { ...updated[index], degree: e.target.value };
                      setResumeData(prev => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
                <div>
                  <Label>School</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[index] = { ...updated[index], school: e.target.value };
                      setResumeData(prev => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
                <div>
                  <Label>Graduation Year</Label>
                  <Input
                    value={edu.graduationYear}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[index] = { ...updated[index], graduationYear: e.target.value };
                      setResumeData(prev => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
                {isStudentMode && (
                  <div>
                    <Label>GPA (Optional)</Label>
                    <Input
                      value={edu.gpa}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[index] = { ...updated[index], gpa: e.target.value };
                        setResumeData(prev => ({ ...prev, education: updated }));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience - Optional for Students */}
      {(!isStudentMode || resumeData.experience.length > 0) && (
        <Card className="animate-fade-in-up delay-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {isStudentMode ? "Experience (Optional)" : "Work Experience"}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="border rounded-lg p-4 relative hover-lift">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeExperience(exp.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={exp.jobTitle}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[index] = { ...updated[index], jobTitle: e.target.value };
                        setResumeData(prev => ({ ...prev, experience: updated }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[index] = { ...updated[index], company: e.target.value };
                        setResumeData(prev => ({ ...prev, experience: updated }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[index] = { ...updated[index], startDate: e.target.value };
                        setResumeData(prev => ({ ...prev, experience: updated }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[index] = { ...updated[index], endDate: e.target.value };
                        setResumeData(prev => ({ ...prev, experience: updated }));
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Description</Label>
                    {buildingMode === "ai" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => enhanceWithAI("experience")}
                        className="btn-magic"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Enhance
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
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Projects - Emphasized for Students */}
      <Card className="animate-fade-in-up delay-400">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Projects {isStudentMode && <Badge variant="secondary" className="ml-2">Important for Students</Badge>}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.projects.map((project, index) => (
            <div key={project.id} className="border rounded-lg p-4 relative hover-lift">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeProject(project.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setResumeData(prev => ({ ...prev, projects: updated }));
                    }}
                  />
                </div>
                <div>
                  <Label>Technologies Used</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => {
                      const updated = [...resumeData.projects];
                      updated[index] = { ...updated[index], technologies: e.target.value };
                      setResumeData(prev => ({ ...prev, projects: updated }));
                    }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => {
                    const updated = [...resumeData.projects];
                    updated[index] = { ...updated[index], description: e.target.value };
                    setResumeData(prev => ({ ...prev, projects: updated }));
                  }}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="animate-fade-in-up delay-500">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer hover-lift">
                {skill}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0"
                  onClick={() => removeSkill(skill)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="animate-fade-in-up delay-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Certifications</CardTitle>
            <Button variant="outline" size="sm" onClick={addCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.certifications.map((cert, index) => (
            <div key={cert.id} className="border rounded-lg p-4 relative hover-lift">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeCertification(cert.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...resumeData.certifications];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setResumeData(prev => ({ ...prev, certifications: updated }));
                    }}
                  />
                </div>
                <div>
                  <Label>Issuing Organization</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => {
                      const updated = [...resumeData.certifications];
                      updated[index] = { ...updated[index], issuer: e.target.value };
                      setResumeData(prev => ({ ...prev, certifications: updated }));
                    }}
                  />
                </div>
                <div>
                  <Label>Date Obtained</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => {
                      const updated = [...resumeData.certifications];
                      updated[index] = { ...updated[index], date: e.target.value };
                      setResumeData(prev => ({ ...prev, certifications: updated }));
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="animate-fade-in-up delay-700">
        <CardHeader>
          <CardTitle>Export Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex-1 ${!hasPaidPlan ? "opacity-60" : "hover-glow"}`}
                  disabled={!hasPaidPlan}
                >
                  {!hasPaidPlan && <Lock className="h-4 w-4 mr-2" />}
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </DialogTrigger>
              {!hasPaidPlan && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade Required</DialogTitle>
                    <DialogDescription>
                      Upgrade your plan to unlock PDF export and professional resume features.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">View Plans</Button>
                    <Button>Upgrade Now</Button>
                  </div>
                </DialogContent>
              )}
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex-1 ${!hasPaidPlan ? "opacity-60" : "hover-glow"}`}
                  disabled={!hasPaidPlan}
                >
                  {!hasPaidPlan && <Lock className="h-4 w-4 mr-2" />}
                  <Download className="h-4 w-4 mr-2" />
                  Export as Word
                </Button>
              </DialogTrigger>
              {!hasPaidPlan && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade Required</DialogTitle>
                    <DialogDescription>
                      Upgrade your plan to unlock Word export and professional resume features.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">View Plans</Button>
                    <Button>Upgrade Now</Button>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;