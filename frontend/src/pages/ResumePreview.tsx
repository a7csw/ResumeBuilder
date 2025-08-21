import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { 
  Download, 
  Edit, 
  Share2, 
  Star, 
  Crown,
  FileText,
  Eye,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const ResumePreview = () => {
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "word">("pdf");
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const { resumeData, selectedPlan } = location.state || {};

  if (!resumeData) {
    navigate("/");
    return null;
  }

  const { personalInfo, experiences, education, projects, skills, type } = resumeData;

  const handleDownload = async (format: "pdf" | "word") => {
    // Mock download functionality
    console.log(`Downloading resume as ${format.toUpperCase()}`);
    
    // Create a mock download
    const element = document.createElement("a");
    const fileName = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.${format === "pdf" ? "pdf" : "docx"}`;
    
    // For demo purposes, we'll just show an alert
    alert(`Your resume would be downloaded as ${fileName}`);
  };

  const handleEdit = () => {
    navigate(`/form/${type}`, { 
      state: { 
        editMode: true, 
        formData: resumeData 
      } 
    });
  };

  const MockResume = () => (
    <div className="bg-white p-8 shadow-lg" ref={resumeRef}>
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="text-slate-600 space-y-1">
          <p>{personalInfo.email} • {personalInfo.phone}</p>
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {selectedPlan === "pro" 
              ? `${personalInfo.summary} Enhanced with AI optimization for maximum impact and keyword density.`
              : personalInfo.summary
            }
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && experiences[0].title && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            PROFESSIONAL EXPERIENCE
          </h2>
          {experiences.map((exp, index) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {exp.title}
                </h3>
                <span className="text-slate-600 text-sm">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-slate-700 font-medium mb-2">
                {exp.company} • {exp.location}
              </p>
              {exp.description && (
                <p className="text-slate-700 leading-relaxed">
                  {selectedPlan === "pro" 
                    ? `${exp.description} [AI-Enhanced: Added industry-specific keywords and impact metrics]`
                    : exp.description
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && education[0].degree && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {edu.degree}
                  </h3>
                  <p className="text-slate-700">
                    {edu.school} • {edu.location}
                  </p>
                  {edu.gpa && (
                    <p className="text-slate-600">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-slate-600 text-sm">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && projects[0].title && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            PROJECTS
          </h2>
          {projects.map((project, index) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-slate-700 leading-relaxed mb-2">
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <p className="text-slate-600">
                  <strong>Technologies:</strong> {project.technologies}
                </p>
              )}
              {project.link && (
                <p className="text-slate-600">
                  <strong>Link:</strong> {project.link}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && skills[0] && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Watermark for free plan */}
      {selectedPlan === "free" && (
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            Created with ResumeBuilder - Upgrade to Pro to remove this watermark
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo="/ai-generation" />
      
      <div className="container px-6 py-8 mx-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Your Resume Preview
                </h1>
                                  <div className="flex items-center gap-2 mt-1">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPlan === "pro" 
                        ? "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      {selectedPlan === "pro" ? (
                        <>
                          <Crown className="w-3 h-3" />
                          Pro Plan
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3" />
                          Free Plan
                        </>
                      )}
                    </div>
                    {selectedPlan === "pro" && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        AI Enhanced
                      </div>
                    )}
                  </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Resume
              </Button>
              
              <Button
                onClick={() => handleDownload(downloadFormat)}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700"
              >
                <Download className="w-4 h-4" />
                Download {downloadFormat.toUpperCase()}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Resume Preview */}
            <div className="lg:col-span-2">
              <Card className="p-0 overflow-hidden animate-fade-in-up delay-200">
                <MockResume />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 animate-fade-in-up delay-400">
              {/* Download Options */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Options
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        checked={downloadFormat === "pdf"}
                        onChange={(e) => setDownloadFormat(e.target.value as "pdf")}
                        className="text-slate-600"
                      />
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium">PDF Format</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Best for applying online
                        </p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      selectedPlan === "free" ? "opacity-50" : ""
                    }`}>
                      <input
                        type="radio"
                        name="format"
                        value="word"
                        checked={downloadFormat === "word"}
                        onChange={(e) => setDownloadFormat(e.target.value as "word")}
                        disabled={selectedPlan === "free"}
                        className="text-slate-600"
                      />
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Word Format</p>
                          {selectedPlan === "free" && (
                            <Crown className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedPlan === "free" ? "Pro feature" : "Easy to edit"}
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  <Button
                    onClick={() => handleDownload(downloadFormat)}
                    className="w-full bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700"
                    disabled={selectedPlan === "free" && downloadFormat === "word"}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {downloadFormat.toUpperCase()}
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Upgrade (for free users) */}
              {selectedPlan === "free" && (
                <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Get AI enhancements, premium templates, and more download formats
                    </p>
                    
                    <ul className="text-left space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        Word document downloads
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        AI content optimization
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        20+ premium templates
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        Remove watermark
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700"
                      onClick={() => navigate("/plan-selection", { state: { formData: resumeData } })}
                    >
                      Upgrade Now - $7/month
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleEdit}
                      className="w-full justify-start"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Resume
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => alert("Share functionality would be implemented here")}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Resume
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate("/form-selection")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Create New Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
