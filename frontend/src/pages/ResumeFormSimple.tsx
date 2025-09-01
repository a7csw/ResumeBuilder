import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { localStorage_, safeNavigate } from "@/lib/navigation";
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

const ResumeFormSimple = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // User state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if we're in edit mode
  const isEditMode = location.state?.editMode || false;
  const editData = location.state?.formData || null;
  
  // User Type State (overrides URL param)
  const [selectedUserType, setSelectedUserType] = useState(() => {
    if (isEditMode && editData?.type) {
      return editData.type;
    }
    return type || "professional";
  });
  
  // Name lock status - only call if user exists
  const nameLockResult = useNameLock(user?.id);
  const { isNameLocked, firstName, lastName, loading: nameLockLoading } = nameLockResult || {
    isNameLocked: false,
    firstName: null,
    lastName: null,
    loading: false
  };
  
  // Personal Information
  const [personalInfo, setPersonalInfo] = useState(
    isEditMode && editData?.personalInfo ? editData.personalInfo : {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: ""
    }
  );

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>(
    isEditMode && editData?.experiences && editData.experiences.length > 0 ? editData.experiences : [
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
    ]
  );

  // Education
  const [education, setEducation] = useState<Education[]>(
    isEditMode && editData?.education && editData.education.length > 0 ? editData.education : [
      {
        id: "1",
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: ""
      }
    ]
  );

  // Projects
  const [projects, setProjects] = useState<Project[]>(
    isEditMode && editData?.projects && editData.projects.length > 0 ? editData.projects : [
      {
        id: "1",
        title: "",
        description: "",
        technologies: "",
        link: ""
      }
    ]
  );

  // Skills with rating
  const [skills, setSkills] = useState<Skill[]>(
    isEditMode && editData?.skills && editData.skills.length > 0 ? editData.skills : [
      { id: "1", name: "", rating: 0 }
    ]
  );

  const getUserTypeConfig = () => {
    const configs = {
      professional: {
        title: "Professional Resume",
        subtitle: "Showcase your career achievements and leadership experience",
        icon: <Briefcase className="w-8 h-8" />,
        color: "slate"
      },
      freelancer: {
        title: "Freelancer Portfolio",
        subtitle: "Highlight your diverse projects and client success stories",
        icon: <Users className="w-8 h-8" />,
        color: "gray"
      },
      student: {
        title: "Student Resume",
        subtitle: "Emphasize your education, internships, and potential",
        icon: <GraduationCap className="w-8 h-8" />,
        color: "zinc"
      }
    };
    return configs[selectedUserType as keyof typeof configs] || configs.professional;
  };

  const config = getUserTypeConfig();

  // Star Rating Component
  const StarRating = ({ value, onChange, skillId }: { value: number; onChange: (rating: number) => void; skillId: string }) => {
    const [hoverRating, setHoverRating] = useState<number>(0);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`w-6 h-6 transition-colors ${
              star <= (hoverRating || value)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 min-w-[80px]">
          {value === 0 ? 'Not rated' : 
           value === 1 ? 'Beginner' :
           value === 2 ? 'Novice' :
           value === 3 ? 'Intermediate' :
           value === 4 ? 'Advanced' : 'Expert'}
        </span>
      </div>
    );
  };
  
  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Validate the type parameter
        if (!type || !['professional', 'freelancer', 'student'].includes(type)) {
          setError('Invalid resume type. Please select a valid type.');
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError('Failed to load user session. Please try again.');
      } finally {
        setIsLoading(false);
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
  }, [type]);

  // Add new experience
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setExperiences([...experiences, newExperience]);
  };

  // Remove experience
  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  // Update experience
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Add new education
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: ""
    };
    setEducation([...education, newEducation]);
  };

  // Remove education
  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  // Update education
  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  // Add new project
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

  // Remove project
  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter(proj => proj.id !== id));
    }
  };

  // Update project
  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  // Add new skill
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      rating: 0
    };
    setSkills([...skills, newSkill]);
  };

  // Remove skill
  const removeSkill = (id: string) => {
    if (skills.length > 1) {
      setSkills(skills.filter(skill => skill.id !== id));
    }
  };

  // Update skill
  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  // Form validation based on user type
  const isFormValid = () => {
    const hasRequiredPersonalInfo = 
      personalInfo.firstName.trim() !== "" &&
      personalInfo.lastName.trim() !== "" &&
      personalInfo.email.trim() !== "" &&
      personalInfo.phone.trim() !== "";
    
    const hasAtLeastOneSkill = skills.some(skill => skill.name.trim() !== "");
    
    // User type specific validations
    let userTypeValidation = true;
    
    if (selectedUserType === "student") {
      // Students require education
      userTypeValidation = education.some(edu => edu.degree.trim() !== "" && edu.school.trim() !== "");
    } else if (selectedUserType === "professional") {
      // Professionals require experience
      userTypeValidation = experiences.some(exp => exp.title.trim() !== "" && exp.company.trim() !== "");
    } else if (selectedUserType === "freelancer") {
      // Freelancers require projects
      userTypeValidation = projects.some(proj => proj.title.trim() !== "" && proj.description.trim() !== "");
    }
    
    return hasRequiredPersonalInfo && hasAtLeastOneSkill && userTypeValidation;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    
    const formData = {
      type: selectedUserType,
      personalInfo,
      experiences,
      education,
      projects,
      skills: skills.filter(skill => skill.name.trim() !== "")
    };
    
    // Save to localStorage as backup
    localStorage_.set('resumeFormData', formData);
    
    // Navigate to resume generated page
    navigate("/resume-generated", { state: { formData } });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader showBackButton={true} backTo="/form-selection" />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Loading Resume Form...
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Please wait while we prepare your customized form
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader showBackButton={true} backTo="/form-selection" />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {error}
            </p>
            <Button onClick={() => navigate("/form-selection")}>
              Back to Form Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo="/form-selection" />
      
      <div className="container px-6 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">
            <Star className="w-4 h-4" />
            {isEditMode ? "Editing Resume" : "Step 2 of 3"}
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-${config.color}-100 dark:bg-${config.color}-900/50 rounded-2xl flex items-center justify-center`}>
              <div className={`text-${config.color}-600 dark:text-${config.color}-400`}>
                {config.icon}
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                {isEditMode ? `Edit ${config.title}` : config.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                {isEditMode ? "Update your existing resume" : config.subtitle}
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
                  placeholder="john.doe@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
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
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                  placeholder="Brief overview of your professional background and career objectives..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="animate-fade-in-up delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Professional Experience
                {selectedUserType === "professional" && <span className="text-red-500">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    {experiences.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Tech Corp"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                      />
                      <Label htmlFor={`current-${exp.id}`}>Current Position</Label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addExperience} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="animate-fade-in-up delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
                {selectedUserType === "student" && <span className="text-red-500">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <Label>School</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addEducation} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card className="animate-fade-in-up delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Projects
                {selectedUserType === "freelancer" && <span className="text-red-500">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((proj, index) => (
                <div key={proj.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    {projects.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProject(proj.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Project Title</Label>
                      <Input
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <Input
                        value={proj.technologies}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Project Link (Optional)</Label>
                      <Input
                        value={proj.link || ''}
                        onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                        placeholder="https://project-demo.com"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Description</Label>
                    <Textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      placeholder="Describe your project, its purpose, and your role..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addProject} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="animate-fade-in-up delay-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Skills
                <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
                         <CardContent className="space-y-6">
               {skills.map((skill, index) => (
                 <div key={skill.id} className="p-4 border rounded-lg">
                   <div className="flex items-start justify-between mb-4">
                     <h4 className="font-medium">Skill {index + 1}</h4>
                     {skills.length > 1 && (
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => removeSkill(skill.id)}
                         className="text-red-600 hover:text-red-700"
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     )}
                   </div>
                   <div className="space-y-4">
                     <div>
                       <Label>Skill Name</Label>
                       <Input
                         value={skill.name}
                         onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                         placeholder="JavaScript, React, Node.js, etc."
                         required
                       />
                     </div>
                     <div>
                       <Label>Proficiency Level</Label>
                       <div className="mt-2">
                         <StarRating
                           value={skill.rating}
                           onChange={(rating) => updateSkill(skill.id, 'rating', rating)}
                           skillId={skill.id}
                         />
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
              <Button onClick={addSkill} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center animate-fade-in-up delay-700">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              size="lg"
              className={`
                px-12 py-6 text-lg transition-all duration-300 transform hover:scale-105
                ${isFormValid() 
                  ? 'bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 shadow-xl hover:shadow-2xl' 
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }
              `}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isEditMode ? "Update Resume" : "Generate Your Resume"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
                         {!isFormValid() && (
               <p className="text-sm text-red-500 mt-4">
                 Please fill in all required fields: Personal Information (First Name, Last Name, Email, Phone), at least one Skill
                 {selectedUserType === "student" && ", and Education"}
                 {selectedUserType === "professional" && ", and Professional Experience"}
                 {selectedUserType === "freelancer" && ", and Projects"}
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeFormSimple;
