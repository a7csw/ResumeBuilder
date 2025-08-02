import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResumePreviewProps {
  resumeData: any;
  userType: "student" | "professional" | "freelancer";
}

const ResumePreview = ({ resumeData, userType }: ResumePreviewProps) => {
  const isStudent = userType === "student";

  return (
    <Card className="animate-fade-in-up delay-100 hover-lift">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[8.5/11] bg-white border rounded-lg shadow-sm p-6 text-black overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6 border-b border-gray-300 pb-4">
            <h1 className="text-2xl font-bold mb-2">
              {resumeData?.personalInfo?.fullName || "Your Name"}
            </h1>
            <div className="text-gray-600 text-sm space-y-1">
              <p>{resumeData?.personalInfo?.email || "your.email@example.com"}</p>
              <p>{resumeData?.personalInfo?.phone || "(555) 123-4567"}</p>
              <p>{resumeData?.personalInfo?.location || "Your Location"}</p>
            </div>
          </div>
          
          {/* Summary */}
          {resumeData?.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 border-b border-gray-300 text-primary">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {resumeData.summary}
              </p>
            </div>
          )}
          
          {/* Education - Prioritized for students */}
          {resumeData?.education?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 text-primary">
                Education
              </h2>
              {resumeData.education.map((edu: any, index: number) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{edu.degree}</p>
                      <p className="text-gray-600 text-sm">{edu.school}</p>
                      {isStudent && edu.gpa && (
                        <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{edu.graduationYear}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects - Emphasized for students */}
          {resumeData?.projects?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 text-primary">
                Projects
              </h2>
              {resumeData.projects.map((project: any, index: number) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{project.name}</p>
                    {project.technologies && (
                      <p className="text-gray-500 text-xs">{project.technologies}</p>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Experience */}
          {resumeData?.experience?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 text-primary">
                {isStudent ? "Experience" : "Work Experience"}
              </h2>
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{exp.jobTitle}</p>
                      <p className="text-gray-600 text-sm">{exp.company}</p>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  {exp.description && (
                    <div className="mt-2">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData?.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 border-b border-gray-300 text-primary">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData?.certifications?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 text-primary">
                Certifications
              </h2>
              {resumeData.certifications.map((cert: any, index: number) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{cert.name}</p>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    </div>
                    <p className="text-gray-600 text-sm">{cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!resumeData?.personalInfo?.fullName && !resumeData?.summary && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg font-medium mb-2">Your resume preview will appear here</p>
              <p className="text-sm">Start filling out your information to see the live preview</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumePreview;