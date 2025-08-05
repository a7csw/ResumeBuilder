import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResumePreviewProps {
  resumeData: any;
  userType: "student" | "professional" | "freelancer";
}

const ResumePreview = ({ resumeData, userType }: ResumePreviewProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in hover-scale" id="resume-preview">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Resume Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!resumeData.personalInfo.firstName ? (
          <div className="text-center text-muted-foreground py-12 animate-fade-in">
            <p className="text-lg font-medium mb-2">Your resume preview will appear here</p>
            <p className="text-sm">Start filling out your resume details to see the live preview</p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            {/* Personal Information */}
            <div className="text-center border-b pb-6 animate-scale-in">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
              </h1>
              {resumeData.personalInfo.title && (
                <p className="text-xl text-muted-foreground mb-4">{resumeData.personalInfo.title}</p>
              )}
              <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
              </div>
              {(resumeData.personalInfo.linkedin || resumeData.personalInfo.website) && (
                <div className="flex justify-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                  {resumeData.personalInfo.linkedin && <span>LinkedIn: {resumeData.personalInfo.linkedin}</span>}
                  {resumeData.personalInfo.website && <span>Website: {resumeData.personalInfo.website}</span>}
                </div>
              )}
            </div>

            {/* Professional Summary */}
            {resumeData.summary && (
              <div className="animate-scale-in">
                <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4 text-primary">
                  Professional Summary
                </h2>
                <p className="text-foreground leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Education - Prioritized for students */}
            {resumeData.education.length > 0 && (
              <div className="animate-scale-in">
                <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4 text-primary">
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
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div className="animate-scale-in">
                <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4 text-primary">
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
            )}

            {/* Projects - Emphasized for students */}
            {resumeData.projects.length > 0 && (
              <div className="animate-scale-in">
                <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4 text-primary">
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
                        <p className="text-primary text-sm mt-1">Link: {project.link}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div className="animate-scale-in">
                <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4 text-primary">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm hover-scale transition-smooth"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <div className="animate-scale-in">
                <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4 text-primary">
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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumePreview;