import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  // Template-specific fields
  research?: Array<{
    id: string;
    title: string;
    publication: string;
    date: string;
    description: string;
  }>;
  awards?: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
  languages?: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
  volunteer?: Array<{
    id: string;
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

interface TemplateSpecificFormProps {
  templateId: string;
  resumeData: ResumeData;
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  canUseAI: boolean;
}

const TemplateSpecificForm = ({ templateId, resumeData, setResumeData, canUseAI }: TemplateSpecificFormProps) => {
  const [newSkill, setNewSkill] = useState("");

  // Template configurations
  const templateConfigs = {
    classic: {
      name: "Classic Professional",
      sections: ["personalInfo", "summary", "experience", "education", "skills"],
      emphasis: "Clean and professional layout perfect for traditional industries"
    },
    modern: {
      name: "Modern Creative",
      sections: ["personalInfo", "summary", "experience", "education", "skills", "projects"],
      emphasis: "Contemporary design with project showcase for creative professionals"
    },
    creative: {
      name: "Creative Portfolio",
      sections: ["personalInfo", "summary", "projects", "experience", "skills", "awards"],
      emphasis: "Visual-focused design highlighting creative work and achievements"
    },
    technical: {
      name: "Technical Expert",
      sections: ["personalInfo", "summary", "experience", "skills", "projects", "certifications"],
      emphasis: "Technical skills and project-focused for developers and engineers"
    },
    graduate: {
      name: "Graduate Scholar",
      sections: ["personalInfo", "summary", "education", "research", "skills", "awards"],
      emphasis: "Academic-focused with research and scholarly achievements"
    },
    internship: {
      name: "Internship Seeker",
      sections: ["personalInfo", "summary", "education", "projects", "skills", "volunteer"],
      emphasis: "Entry-level focused with projects and volunteer experience"
    },
    student: {
      name: "Student Professional",
      sections: ["personalInfo", "summary", "education", "projects", "skills"],
      emphasis: "Student-friendly with emphasis on education and projects"
    },
    minimal: {
      name: "Minimal Clean",
      sections: ["personalInfo", "summary", "experience", "education", "skills"],
      emphasis: "Clean, distraction-free design focusing on content"
    }
  };

  const config = templateConfigs[templateId as keyof typeof templateConfigs] || templateConfigs.classic;

  const addResearch = () => {
    const newResearch = {
      id: Date.now().toString(),
      title: "",
      publication: "",
      date: "",
      description: ""
    };
    setResumeData(prev => ({
      ...prev,
      research: [...(prev.research || []), newResearch]
    }));
  };

  const removeResearch = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      research: (prev.research || []).filter(r => r.id !== id)
    }));
  };

  const addAward = () => {
    const newAward = {
      id: Date.now().toString(),
      title: "",
      issuer: "",
      date: "",
      description: ""
    };
    setResumeData(prev => ({
      ...prev,
      awards: [...(prev.awards || []), newAward]
    }));
  };

  const removeAward = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      awards: (prev.awards || []).filter(a => a.id !== id)
    }));
  };

  const addLanguage = () => {
    const newLanguage = {
      id: Date.now().toString(),
      language: "",
      proficiency: ""
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLanguage]
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(l => l.id !== id)
    }));
  };

  const addVolunteer = () => {
    const newVolunteer = {
      id: Date.now().toString(),
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setResumeData(prev => ({
      ...prev,
      volunteer: [...(prev.volunteer || []), newVolunteer]
    }));
  };

  const removeVolunteer = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      volunteer: (prev.volunteer || []).filter(v => v.id !== id)
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

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {config.name} Template
            </span>
            <Badge variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              Optimized
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{config.emphasis}</p>
        </CardHeader>
      </Card>

      {/* Research Section (Graduate template) */}
      {config.sections.includes("research") && (
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Research & Publications</CardTitle>
              <Button onClick={addResearch} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Research
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(resumeData.research || []).map((research) => (
              <div key={research.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label>Research Title</Label>
                      <Input
                        placeholder="Title of your research"
                        value={research.title}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          research: (prev.research || []).map(r => 
                            r.id === research.id ? { ...r, title: e.target.value } : r
                          )
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Publication/Conference</Label>
                      <Input
                        placeholder="Where it was published"
                        value={research.publication}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          research: (prev.research || []).map(r => 
                            r.id === research.id ? { ...r, publication: e.target.value } : r
                          )
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={research.date}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          research: (prev.research || []).map(r => 
                            r.id === research.id ? { ...r, date: e.target.value } : r
                          )
                        }))}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => removeResearch(research.id)} 
                    size="sm" 
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of your research"
                    value={research.description}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      research: (prev.research || []).map(r => 
                        r.id === research.id ? { ...r, description: e.target.value } : r
                      )
                    }))}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Awards Section (Creative, Graduate templates) */}
      {config.sections.includes("awards") && (
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Awards & Achievements</CardTitle>
              <Button onClick={addAward} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Award
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(resumeData.awards || []).map((award) => (
              <div key={award.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label>Award Title</Label>
                      <Input
                        placeholder="Name of the award"
                        value={award.title}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          awards: (prev.awards || []).map(a => 
                            a.id === award.id ? { ...a, title: e.target.value } : a
                          )
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Issuing Organization</Label>
                      <Input
                        placeholder="Who issued the award"
                        value={award.issuer}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          awards: (prev.awards || []).map(a => 
                            a.id === award.id ? { ...a, issuer: e.target.value } : a
                          )
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Date Received</Label>
                      <Input
                        type="date"
                        value={award.date}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          awards: (prev.awards || []).map(a => 
                            a.id === award.id ? { ...a, date: e.target.value } : a
                          )
                        }))}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => removeAward(award.id)} 
                    size="sm" 
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="Brief description of the achievement"
                    value={award.description}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      awards: (prev.awards || []).map(a => 
                        a.id === award.id ? { ...a, description: e.target.value } : a
                      )
                    }))}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Volunteer Experience Section (Internship template) */}
      {config.sections.includes("volunteer") && (
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Volunteer Experience</CardTitle>
              <Button onClick={addVolunteer} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(resumeData.volunteer || []).map((vol) => (
              <div key={vol.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label>Organization</Label>
                      <Input
                        placeholder="Organization name"
                        value={vol.organization}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          volunteer: (prev.volunteer || []).map(v => 
                            v.id === vol.id ? { ...v, organization: e.target.value } : v
                          )
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        placeholder="Your volunteer role"
                        value={vol.role}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          volunteer: (prev.volunteer || []).map(v => 
                            v.id === vol.id ? { ...v, role: e.target.value } : v
                          )
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={vol.startDate}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          volunteer: (prev.volunteer || []).map(v => 
                            v.id === vol.id ? { ...v, startDate: e.target.value } : v
                          )
                        }))}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={vol.endDate}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          volunteer: (prev.volunteer || []).map(v => 
                            v.id === vol.id ? { ...v, endDate: e.target.value } : v
                          )
                        }))}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => removeVolunteer(vol.id)} 
                    size="sm" 
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your volunteer experience and impact"
                    value={vol.description}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      volunteer: (prev.volunteer || []).map(v => 
                        v.id === vol.id ? { ...v, description: e.target.value } : v
                      )
                    }))}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Skills Section with template-specific suggestions */}
      {config.sections.includes("skills") && (
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
            <p className="text-sm text-muted-foreground">
              {templateId === 'technical' ? 'Focus on programming languages and technical skills' :
               templateId === 'creative' ? 'Include design tools and creative software' :
               templateId === 'graduate' ? 'Research methods and academic skills' :
               'Add relevant skills for your field'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={
                  templateId === 'technical' ? 'e.g., Python, React, AWS' :
                  templateId === 'creative' ? 'e.g., Photoshop, Figma, Illustration' :
                  templateId === 'graduate' ? 'e.g., Data Analysis, Research Methods' :
                  'e.g., Leadership, Communication'
                }
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                  <Button
                    onClick={() => removeSkill(skill)}
                    size="sm"
                    variant="ghost"
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateSpecificForm;