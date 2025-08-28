import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import NavigationHeader from "@/components/NavigationHeader";
import { supabase } from "@/integrations/supabase/client";
import { useNameLock } from "@/hooks/useNameLock";
import LockedNameField from "@/components/LockedNameField";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  User, 
  Building, 
  GraduationCap,
  Award,
  CheckCircle2,
  Star,
  Crown,
  Briefcase,
  Users,
  Settings
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  rating: number;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link?: string;
}

const ResumeForm = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState<any>(null);
  
  // User Type State (overrides URL param)
  const [selectedUserType, setSelectedUserType] = useState(type || "professional");
  
  // Name lock status
  const { isNameLocked, firstName, lastName, loading: nameLockLoading } = useNameLock(user?.id);
  
  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: ""
  });

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    }
  ]);

  // Education
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: ""
    }
  ]);

  // Projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "",
      description: "",
      technologies: "",
      link: ""
    }
  ]);

  // Skills with rating
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "", rating: 0 }
  ]);

  const getUserTypeConfig = () => {
    switch (selectedUserType) {
      case "professional":
        return {
          title: "Professional Resume",
          subtitle: "Showcase your career progression and achievements",
          icon: <Briefcase className="w-6 h-6" />,
          color: "amber",
          experienceRequired: true,
          educationRequired: true,
          projectsRequired: false,
          skillsRequired: true
        };
      case "freelancer":
        return {
          title: "Freelancer Resume",
          subtitle: "Highlight your diverse projects and client work",
          icon: <Users className="w-6 h-6" />,
          color: "rose",
          experienceRequired: false, // Optional for freelancers
          educationRequired: false,  // Optional for freelancers
          projectsRequired: true,
          skillsRequired: true
        };
      case "student":
        return {
          title: "Student Resume",
          subtitle: "Emphasize your education and potential",
          icon: <GraduationCap className="w-6 h-6" />,
          color: "purple",
          experienceRequired: false, // Optional for students
          educationRequired: true,
          projectsRequired: false,   // Optional for students
          skillsRequired: true
        };
      default:
        return {
          title: "Resume",
          subtitle: "Build your professional resume",
          icon: <User className="w-6 h-6" />,
          color: "amber",
          experienceRequired: true,
          educationRequired: true,
          projectsRequired: false,
          skillsRequired: true
        };
    }
  };

  const config = getUserTypeConfig();

  // Skills functions
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      rating: 0
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id: string) => {
    if (skills.length > 1) {
      setSkills(skills.filter(skill => skill.id !== id));
    }
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`transition-all duration-200 transform hover:scale-110 ${
              star <= rating 
                ? 'text-slate-600 hover:text-slate-700' 
                : 'text-gray-300 hover:text-slate-500'
            }`}
          >
            <Star 
              className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} 
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 min-w-[60px]">
          {rating === 0 ? 'Not rated' : 
           rating === 1 ? 'Beginner' :
           rating === 2 ? 'Basic' :
           rating === 3 ? 'Good' :
           rating === 4 ? 'Advanced' : 'Expert'}
        </span>
      </div>
    );
  };

  // Experience functions
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Education functions
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: ""
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  // Project functions
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: "",
      link: ""
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter(proj => proj.id !== id));
    }
  };

  const updateProject = (id: string, field: string, value: string) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const handleSubmit = () => {
    const formData = {
      type: selectedUserType,
      personalInfo,
      experiences,
      education,
      projects,
      skills: skills.filter(skill => skill.name.trim() !== "")
    };
    
    // Navigate to plan selection
    navigate("/plan-selection", { state: { formData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo="/form-selection" />
      
      <div className="container px-6 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">
            <Star className="w-4 h-4" />
            Step 2 of 3
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-${config.color}-100 dark:bg-${config.color}-900/50 rounded-2xl flex items-center justify-center`}>
              <div className={`text-${config.color}-600 dark:text-${config.color}-400`}>
                {config.icon}
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                {config.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* User Type Selector */}
          <div className="flex items-center justify-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="professional"
                  checked={selectedUserType === "professional"}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="text-gray-600 focus:ring-gray-500"
                />
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">Professional</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="freelancer"
                  checked={selectedUserType === "freelancer"}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="text-gray-600 focus:ring-gray-500"
                />
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Freelancer</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={selectedUserType === "student"}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="text-gray-600 focus:ring-gray-500"
                />
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">Student</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <Card className="animate-fade-in-up delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
                <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <LockedNameField
                id="firstName"
                label="First Name"
                value={personalInfo.firstName}
                placeholder="John"
                isLocked={isNameLocked}
                required
                onChange={(value) => setPersonalInfo({...personalInfo, firstName: value})}
              />
              <LockedNameField
                id="lastName"
                label="Last Name"
                value={personalInfo.lastName}
                placeholder="Doe"
                isLocked={isNameLocked}
                required
                onChange={(value) => setPersonalInfo({...personalInfo, lastName: value})}
              />
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  className="mt-1 border-2 focus:border-slate-500 transition-colors"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="mt-1 border-2 focus:border-slate-500 transition-colors"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  placeholder="City, State"
                  className="mt-1 border-2 focus:border-slate-500 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                  placeholder="linkedin.com/in/yourprofile"
                  className="mt-1 border-2 focus:border-slate-500 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                  placeholder="A brief summary of your professional background and goals..."
                  className="mt-1 min-h-24 border-2 focus:border-slate-500 transition-colors"
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="animate-fade-in-up delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                {type === "student" ? "Experience & Internships" : "Work Experience"}
                {config.experienceRequired && <span className="text-red-500">*</span>}
                {!config.experienceRequired && <span className="text-slate-500 text-sm">(Optional)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {experiences.map((exp, index) => (
                <div key={exp.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Experience {index + 1}</h4>
                    {experiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title {config.experienceRequired && '*'}</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                        required={config.experienceRequired}
                      />
                    </div>
                    <div>
                      <Label>Company {config.experienceRequired && '*'}</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                        required={config.experienceRequired}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="mr-2 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-sm">
                          Currently working here
                        </Label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        className="mt-1 min-h-20 border-2 focus:border-slate-500 transition-colors"
                      />

                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addExperience}
                className="w-full border-2 border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="animate-fade-in-up delay-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
                {config.educationRequired && <span className="text-red-500">*</span>}
                {!config.educationRequired && <span className="text-slate-500 text-sm">(Optional)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {education.map((edu, index) => (
                <div key={edu.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Degree {config.educationRequired && '*'}</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                        required={config.educationRequired}
                      />
                    </div>
                    <div>
                      <Label>School {config.educationRequired && '*'}</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                        required={config.educationRequired}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        className="mt-1 border-2 focus:border-slate-500 transition-colors"
                      />
                    </div>
                    {selectedUserType === "student" && (
                      <div>
                        <Label>GPA (Optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                          placeholder="3.8"
                          className="mt-1 border-2 focus:border-slate-500 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addEducation}
                className="w-full border-2 border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Projects (conditional) */}
          {(config.projectsRequired || selectedUserType === "freelancer" || selectedUserType === "student") && (
            <Card className="animate-fade-in-up delay-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Projects
                  {config.projectsRequired && <span className="text-red-500">*</span>}
                  {!config.projectsRequired && <span className="text-slate-500 text-sm">(Optional)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projects.map((project, index) => (
                  <div key={project.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Project {index + 1}</h4>
                      {projects.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid gap-4">
                      <div>
                        <Label>Project Title {config.projectsRequired && '*'}</Label>
                        <Input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, "title", e.target.value)}
                          className="mt-1 border-2 focus:border-slate-500 transition-colors"
                          required={config.projectsRequired}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                          placeholder="Describe what you built and its impact..."
                          className="mt-1 min-h-20 border-2 focus:border-slate-500 transition-colors"
                        />
                      </div>
                      <div>
                        <Label>Technologies Used</Label>
                        <Input
                          value={project.technologies}
                          onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                          placeholder="React, Node.js, Python, etc."
                          className="mt-1 border-2 focus:border-slate-500 transition-colors"
                        />
                      </div>
                      <div>
                        <Label>Project Link (Optional)</Label>
                        <Input
                          value={project.link}
                          onChange={(e) => updateProject(project.id, "link", e.target.value)}
                          placeholder="https://github.com/yourproject"
                          className="mt-1 border-2 focus:border-slate-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addProject}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Skills with Star Rating */}
          <Card className="animate-fade-in-up delay-1000">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Skills & Expertise
                <span className="text-red-500">*</span>
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Rate your proficiency level for each skill (1-5 stars)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Skill {index + 1}</h5>
                      {skills.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Skill Name *</Label>
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                          placeholder="e.g., JavaScript, Project Management, Adobe Photoshop"
                          className="mt-1 border-2 focus:border-slate-500 transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Proficiency Level</Label>
                        <StarRating
                          rating={skill.rating}
                          onRatingChange={(rating) => updateSkill(skill.id, "rating", rating)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={addSkill}
                className="w-full mt-4 border-2 border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI will suggest additional relevant skills based on your experience and industry
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center py-8 animate-fade-in-up delay-1200">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="px-12 py-6 text-lg bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Your Resume
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              ✨ Your resume will be enhanced with AI optimization and industry insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;