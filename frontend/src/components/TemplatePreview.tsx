import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplatePreviewProps {
  resumeData: any;
  userType: "student" | "professional" | "freelancer";
  templateId?: string;
  isPreview?: boolean;
  colorVariant?: string;
}

const TemplatePreview = ({ resumeData, userType, templateId = "classic", isPreview = false, colorVariant = 'indigo' }: TemplatePreviewProps) => {
  // Different template styles based on templateId and color variant
  const colorMap = (variant: string) => {
    switch (variant) {
      case 'emerald': return { accent: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', chip: 'bg-emerald-100 dark:bg-emerald-900/30' };
      case 'cyan': return { accent: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', chip: 'bg-cyan-100 dark:bg-cyan-900/30' };
      case 'rose': return { accent: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', chip: 'bg-rose-100 dark:bg-rose-900/30' };
      case 'violet': return { accent: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', chip: 'bg-violet-100 dark:bg-violet-900/30' };
      case 'purple': return { accent: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', chip: 'bg-purple-100 dark:bg-purple-900/30' };
      case 'amber': return { accent: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', chip: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'sky': return { accent: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', chip: 'bg-sky-100 dark:bg-sky-900/30' };
      case 'indigo': return { accent: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', chip: 'bg-indigo-100 dark:bg-indigo-900/30' };
      case 'blue': return { accent: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', chip: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'teal': return { accent: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', chip: 'bg-teal-100 dark:bg-teal-900/30' };
      case 'zinc': return { accent: 'text-zinc-700 dark:text-zinc-300', border: 'border-zinc-300 dark:border-zinc-700', chip: 'bg-zinc-100 dark:bg-zinc-800/30' };
      case 'slate': return { accent: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700', chip: 'bg-slate-100 dark:bg-slate-800/30' };
      case 'stone': return { accent: 'text-stone-700 dark:text-stone-300', border: 'border-stone-300 dark:border-stone-700', chip: 'bg-stone-100 dark:bg-stone-800/30' };
      case 'lime': return { accent: 'text-lime-700 dark:text-lime-400', border: 'border-lime-200 dark:border-lime-800', chip: 'bg-lime-100 dark:bg-lime-900/30' };
      default: return { accent: 'text-primary', border: 'border-border', chip: 'bg-primary/10' };
    }
  };

  const getTemplateStyles = () => {
    const c = colorMap(colorVariant);
    switch (templateId) {
      case "student":
        return {
          headerBg: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
          accentColor: c.accent,
          borderColor: c.border,
          skillBg: c.chip
        };
      case "minimal":
        return {
          headerBg: "bg-gray-50 dark:bg-gray-900/30",
          accentColor: c.accent,
          borderColor: c.border,
          skillBg: c.chip
        };
      case "creative":
        return {
          headerBg: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
          accentColor: c.accent,
          borderColor: c.border,
          skillBg: c.chip
        };
      case "modern":
        return {
          headerBg: "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
          accentColor: c.accent,
          borderColor: c.border,
          skillBg: c.chip
        };
      default:
        return {
          headerBg: "bg-muted/30",
          accentColor: c.accent,
          borderColor: c.border,
          skillBg: c.chip
        };
    }
  };

  const styles = getTemplateStyles();

  // Custom section order for students
  const getSectionOrder = () => {
    if (userType === "student") {
      return ["personalInfo", "summary", "education", "projects", "experience", "skills", "certifications"];
    }
    return ["personalInfo", "summary", "experience", "education", "projects", "skills", "certifications"];
  };

  const sectionOrder = getSectionOrder();

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case "personalInfo":
        return (
          <div className={`text-center p-6 rounded-lg ${styles.headerBg} animate-scale-in`}>
            <h1 className="text-3xl font-bold mb-2">
              {resumeData?.personalInfo?.firstName} {resumeData?.personalInfo?.lastName}
            </h1>
            {resumeData?.personalInfo?.title && (
              <p className={`text-xl mb-4 ${styles.accentColor} font-medium`}>
                {resumeData?.personalInfo?.title}
              </p>
            )}
            <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
              {resumeData?.personalInfo?.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData?.personalInfo?.phone && <span>{resumeData.personalInfo.phone}</span>}
              {resumeData?.personalInfo?.location && <span>{resumeData.personalInfo.location}</span>}
            </div>
            {(resumeData?.personalInfo?.linkedin || resumeData?.personalInfo?.website) && (
              <div className="flex justify-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                {resumeData?.personalInfo?.linkedin && <span>LinkedIn: {resumeData.personalInfo.linkedin}</span>}
                {resumeData?.personalInfo?.website && <span>Website: {resumeData.personalInfo.website}</span>}
              </div>
            )}
          </div>
        );

      case "summary":
        return resumeData?.summary && (
          <div className="animate-scale-in">
            <h2 className={`text-xl font-semibold pb-2 mb-4 ${styles.accentColor} border-b ${styles.borderColor}`}>
              Professional Summary
            </h2>
            <p className="text-foreground leading-relaxed">{resumeData?.summary}</p>
          </div>
        );

      case "education":
        return resumeData?.education?.length > 0 && (
          <div className="animate-scale-in">
            <h2 className={`text-xl font-semibold pb-2 mb-4 ${styles.accentColor} border-b ${styles.borderColor}`}>
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu: any, index: number) => (
                <div key={index} className="hover-scale transition-smooth">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.school}</p>
                      {userType === "student" && edu.gpa && (
                        <p className="text-muted-foreground text-sm">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "experience":
        return resumeData?.experience?.length > 0 && (
          <div className="animate-scale-in">
            <h2 className={`text-xl font-semibold pb-2 mb-4 ${styles.accentColor} border-b ${styles.borderColor}`}>
              {userType === "student" ? "Experience" : "Work Experience"}
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={index} className="hover-scale transition-smooth">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-foreground leading-relaxed whitespace-pre-line text-sm mt-2">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {exp.achievements.map((achievement: string, achIndex: number) => (
                        <li key={achIndex} className="text-foreground text-sm">{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "projects":
        return resumeData?.projects?.length > 0 && (
          <div className="animate-scale-in">
            <h2 className={`text-xl font-semibold pb-2 mb-4 ${styles.accentColor} border-b ${styles.borderColor}`}>
              Projects
            </h2>
            <div className="space-y-4">
              {resumeData.projects.map((project: any, index: number) => (
                <div key={index} className="hover-scale transition-smooth">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      {project.technologies && (
                        <p className="text-muted-foreground text-sm">{project.technologies}</p>
                      )}
                    </div>
                    {project.date && (
                      <span className="text-muted-foreground text-sm">{project.date}</span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-foreground leading-relaxed text-sm mt-2">{project.description}</p>
                  )}
                  {project.link && (
                    <p className={`text-sm mt-1 ${styles.accentColor}`}>Link: {project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "skills":
        return resumeData?.skills?.length > 0 && (
          <div className="animate-scale-in">
            <h2 className={`text-xl font-semibold pb-2 mb-4 ${styles.accentColor} border-b ${styles.borderColor}`}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: string, index: number) => (
                <span 
                  key={index} 
                  className={`${styles.skillBg} ${styles.accentColor} px-3 py-1 rounded-full text-sm hover-scale transition-smooth`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case "certifications":
        return resumeData?.certifications?.length > 0 && (
          <div className="animate-scale-in">
            <h2 className={`text-xl font-semibold pb-2 mb-4 ${styles.accentColor} border-b ${styles.borderColor}`}>
              Certifications
            </h2>
            <div className="space-y-3">
              {resumeData.certifications.map((cert: any, index: number) => (
                <div key={index} className="flex justify-between items-start hover-scale transition-smooth">
                  <div>
                    <h3 className="font-semibold text-foreground">{cert.name}</h3>
                    <p className="text-muted-foreground text-sm">{cert.issuer}</p>
                  </div>
                  <span className="text-muted-foreground text-sm">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in" id="template-preview">
      <div className="bg-white dark:bg-card border border-border rounded-lg shadow-sm p-6 space-y-6">
        {isPreview && (
          <div className="text-center text-muted-foreground/70 py-2 border-b border-dashed">
            <p className="text-sm font-medium">Template Preview Mode</p>
            <p className="text-xs">Start filling the form to see your actual data</p>
          </div>
        )}
        
        <div className="space-y-6">
          {sectionOrder.map((sectionName) => (
            <div key={sectionName}>
              {renderSection(sectionName)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;