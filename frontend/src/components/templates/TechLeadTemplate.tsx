import React from 'react';

interface TechLeadTemplateProps {
  resumeData: any;
  className?: string;
}

const TechLeadTemplate: React.FC<TechLeadTemplateProps> = ({ resumeData, className = "" }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;

  return (
    <div className={`bg-white text-gray-900 shadow-lg ${className}`} style={{ fontFamily: 'Source Code Pro, monospace' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            <h2 className="text-lg text-blue-100 mb-3">{personalInfo?.title}</h2>
            <div className="text-sm text-blue-100">
              {personalInfo?.industry && <span className="inline-block mr-4">🏢 {personalInfo.industry}</span>}
            </div>
          </div>
          <div className="text-sm space-y-1">
            {personalInfo?.email && <div>✉️ {personalInfo.email}</div>}
            {personalInfo?.phone && <div>📱 {personalInfo.phone}</div>}
            {personalInfo?.location && <div>📍 {personalInfo.location}</div>}
            {personalInfo?.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
            {personalInfo?.website && <div>🌐 {personalInfo.website}</div>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Technical Summary */}
        {summary && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-blue-600 border-l-4 border-blue-600 pl-3 mb-3">
              // TECHNICAL SUMMARY
            </h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border-l-4 border-blue-200">
              {summary}
            </p>
          </section>
        )}

        {/* Technical Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-blue-600 border-l-4 border-blue-600 pl-3 mb-3">
              // TECHNICAL STACK
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill: any, index: number) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  const level = typeof skill === 'object' ? skill.level : undefined;
                  return (
                    <div key={index} className="flex items-center">
                      <span className="text-blue-600 mr-2">▪</span>
                      <span className="font-mono text-sm">
                        {skillName}
                        {level && <span className="text-gray-500 ml-2">({level})</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-blue-600 border-l-4 border-blue-600 pl-3 mb-3">
              // PROFESSIONAL EXPERIENCE
            </h3>
            {experience.map((exp: any, index: number) => (
              <div key={index} className="mb-6 border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                    <h5 className="text-blue-600 font-semibold">{exp.company}</h5>
                  </div>
                  <div className="text-right text-gray-600 font-mono text-sm">
                    <div>{exp.startDate} {'->'} {exp.endDate || 'Present'}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 space-y-1">
                    {exp.description.split('\n').map((line: string, i: number) => (
                      <div key={i} className="flex">
                        <span className="text-blue-400 mr-2 font-mono">{'>'}</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-blue-600 border-l-4 border-blue-600 pl-3 mb-3">
              // KEY PROJECTS
            </h3>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-4 bg-gray-50 p-4 rounded border-l-4 border-blue-200">
                <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                <p className="text-gray-700 mt-2">{project.description}</p>
                {project.technologies && (
                  <div className="mt-2">
                    <span className="font-semibold text-blue-600">Tech Stack:</span>
                    <span className="ml-2 font-mono text-sm text-gray-600">{project.technologies}</span>
                  </div>
                )}
                {project.url && (
                  <div className="mt-1">
                    <span className="font-semibold text-blue-600">URL:</span>
                    <span className="ml-2 font-mono text-sm text-blue-500">{project.url}</span>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-blue-600 border-l-4 border-blue-600 pl-3 mb-3">
                // EDUCATION
              </h3>
              {education.map((edu: any, index: number) => (
                <div key={index} className="mb-3 bg-gray-50 p-3 rounded">
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <h5 className="text-blue-600">{edu.institution}</h5>
                  <div className="text-sm text-gray-600 font-mono">
                    {edu.graduationDate}
                    {edu.gpa && <span className="ml-2">| GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-blue-600 border-l-4 border-blue-600 pl-3 mb-3">
                // CERTIFICATIONS
              </h3>
              {certifications.map((cert: any, index: number) => (
                <div key={index} className="mb-3 bg-gray-50 p-3 rounded">
                  <div className="font-bold text-gray-900">{cert.name}</div>
                  <div className="text-sm text-blue-600">{cert.issuer}</div>
                  <div className="text-sm text-gray-600 font-mono">{cert.date}</div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechLeadTemplate;