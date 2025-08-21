import React from 'react';

interface ConsultantTemplateProps {
  resumeData: any;
  className?: string;
}

const ConsultantTemplate: React.FC<ConsultantTemplateProps> = ({ resumeData, className = "" }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;

  return (
    <div className={`bg-white text-gray-900 shadow-lg ${className}`} style={{ fontFamily: 'Merriweather, serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <h2 className="text-lg text-emerald-100 mb-4">{personalInfo?.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              {personalInfo?.email && <div className="mb-1">📧 {personalInfo.email}</div>}
              {personalInfo?.phone && <div className="mb-1">📞 {personalInfo.phone}</div>}
            </div>
            <div>
              {personalInfo?.location && <div className="mb-1">📍 {personalInfo.location}</div>}
              {personalInfo?.linkedin && <div className="mb-1">💼 {personalInfo.linkedin}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Professional Summary */}
        {summary && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
          </section>
        )}

        {/* Core Competencies */}
        {skills && skills.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">
              CORE COMPETENCIES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill: any, index: number) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    {skillName}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">
              PROFESSIONAL EXPERIENCE
            </h3>
            {experience.map((exp: any, index: number) => (
              <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                    <h5 className="text-emerald-600 font-semibold">{exp.company}</h5>
                  </div>
                  <div className="text-right text-gray-600">
                    <div className="font-semibold">{exp.startDate} – {exp.endDate || 'Present'}</div>
                    {exp.location && <div className="text-sm">{exp.location}</div>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 space-y-2">
                    {exp.description.split('\n').map((line: string, i: number) => (
                      <div key={i} className="flex">
                        <span className="text-emerald-400 mr-3 mt-1">▪</span>
                        <span className="text-justify">{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">
              KEY PROJECTS & ENGAGEMENTS
            </h3>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-4 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h4>
                <p className="text-gray-700 mb-2 text-justify">{project.description}</p>
                {project.technologies && (
                  <div className="text-sm">
                    <span className="font-semibold text-emerald-700">Key Technologies: </span>
                    <span className="text-gray-600">{project.technologies}</span>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-emerald-700 mb-4 pb-2 border-b border-emerald-200">
                EDUCATION
              </h3>
              {education.map((edu: any, index: number) => (
                <div key={index} className="mb-4">
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <h5 className="text-emerald-600">{edu.institution}</h5>
                  <div className="text-sm text-gray-600">
                    {edu.graduationDate}
                    {edu.gpa && <span className="ml-2">| GPA: {edu.gpa}</span>}
                  </div>
                  {edu.location && <div className="text-sm text-gray-500">{edu.location}</div>}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-emerald-700 mb-4 pb-2 border-b border-emerald-200">
                CERTIFICATIONS
              </h3>
              {certifications.map((cert: any, index: number) => (
                <div key={index} className="mb-3 p-3 bg-emerald-50 rounded border-l-3 border-emerald-400">
                  <div className="font-semibold text-gray-900">{cert.name}</div>
                  <div className="text-sm text-emerald-600">{cert.issuer}</div>
                  <div className="text-sm text-gray-600">{cert.date}</div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          Professional resume prepared with attention to detail and strategic positioning
        </div>
      </div>
    </div>
  );
};

export default ConsultantTemplate;