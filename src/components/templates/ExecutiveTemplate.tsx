import React from 'react';

interface ExecutiveTemplateProps {
  resumeData: any;
  className?: string;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ resumeData, className = "" }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;

  return (
    <div className={`bg-white text-gray-900 shadow-lg ${className}`} style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo?.firstName} {personalInfo?.lastName}
        </h1>
        <h2 className="text-xl text-gray-300 mb-4">{personalInfo?.title}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            {personalInfo?.email && <div>📧 {personalInfo.email}</div>}
            {personalInfo?.phone && <div>📞 {personalInfo.phone}</div>}
          </div>
          <div>
            {personalInfo?.location && <div>📍 {personalInfo.location}</div>}
            {personalInfo?.linkedin && <div>💼 {personalInfo.linkedin}</div>}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Executive Summary */}
        {summary && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-4">
              EXECUTIVE SUMMARY
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">
              PROFESSIONAL EXPERIENCE
            </h3>
            {experience.map((exp: any, index: number) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{exp.position}</h4>
                    <h5 className="text-lg font-semibold text-gray-700">{exp.company}</h5>
                  </div>
                  <div className="text-right text-gray-600">
                    <div className="font-semibold">{exp.startDate} - {exp.endDate || 'Present'}</div>
                    {exp.location && <div className="text-sm">{exp.location}</div>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 space-y-2">
                    {exp.description.split('\n').map((line: string, i: number) => (
                      <div key={i} className="flex">
                        <span className="mr-3 text-gray-400">▸</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">
              EDUCATION
            </h3>
            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                    <h5 className="text-gray-700">{edu.institution}</h5>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-gray-600 text-right">
                    <div>{edu.graduationDate}</div>
                    {edu.location && <div className="text-sm">{edu.location}</div>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Core Competencies */}
          {skills && skills.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-400 pb-2 mb-4">
                CORE COMPETENCIES
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill: any, index: number) => (
                  <div key={index} className="text-gray-700">
                    • {typeof skill === 'string' ? skill : skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-400 pb-2 mb-4">
                CERTIFICATIONS
              </h3>
              {certifications.map((cert: any, index: number) => (
                <div key={index} className="mb-2 text-gray-700">
                  <div className="font-semibold">{cert.name}</div>
                  <div className="text-sm text-gray-600">{cert.issuer} • {cert.date}</div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <section className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">
              KEY PROJECTS & ACHIEVEMENTS
            </h3>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                <p className="text-gray-700 mt-2">{project.description}</p>
                {project.technologies && (
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Technologies:</span> {project.technologies}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;