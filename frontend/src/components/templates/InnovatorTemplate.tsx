import React from 'react';

interface InnovatorTemplateProps {
  resumeData: any;
  className?: string;
}

const InnovatorTemplate: React.FC<InnovatorTemplateProps> = ({ resumeData, className = "" }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;

  return (
    <div className={`bg-white text-gray-900 shadow-lg ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <h2 className="text-xl text-purple-100 mb-4 font-light">{personalInfo?.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {personalInfo?.email && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  {personalInfo.email}
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  {personalInfo.phone}
                </div>
              )}
            </div>
            <div className="space-y-2">
              {personalInfo?.location && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  {personalInfo.location}
                </div>
              )}
              {personalInfo?.linkedin && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  {personalInfo.linkedin}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
      </div>

      <div className="p-8">
        {/* Vision Statement */}
        {summary && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text mb-4">
              Vision & Innovation
            </h3>
            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <p className="text-gray-700 leading-relaxed text-lg pl-6 italic">{summary}</p>
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text mb-6">
              Professional Journey
            </h3>
            <div className="space-y-8">
              {experience.map((exp: any, index: number) => (
                <div key={index} className="relative">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mt-2 mr-6"></div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{exp.position}</h4>
                          <h5 className="text-lg text-purple-600 font-semibold">{exp.company}</h5>
                        </div>
                        <div className="text-right text-gray-600 mt-2 md:mt-0">
                          <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full text-sm font-medium">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </div>
                          {exp.location && <div className="text-sm mt-1">{exp.location}</div>}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 space-y-2">
                          {exp.description.split('\n').map((line: string, i: number) => (
                            <div key={i} className="flex">
                              <span className="text-purple-400 mr-3">◆</span>
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {index < experience.length - 1 && (
                    <div className="absolute left-2 top-8 w-0.5 h-16 bg-gradient-to-b from-purple-300 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Innovation Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text mb-6">
              Innovation Portfolio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h4>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  {project.technologies && (
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-purple-600">Tech Stack:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.technologies.split(',').map((tech: string, i: number) => (
                          <span key={i} className="bg-white px-2 py-1 rounded-full text-xs text-purple-700 border border-purple-200">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills & Expertise */}
          {skills && skills.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text mb-4">
                Core Expertise
              </h3>
              <div className="space-y-3">
                {skills.map((skill: any, index: number) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{skillName}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text mb-4">
                Academic Foundation
              </h3>
              {education.map((edu: any, index: number) => (
                <div key={index} className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <h5 className="text-purple-600">{edu.institution}</h5>
                  <div className="text-sm text-gray-600 mt-1">
                    {edu.graduationDate}
                    {edu.gpa && <span className="ml-2">• GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="mt-8">
            <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text mb-4">
              Professional Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert: any, index: number) => (
                <div key={index} className="flex items-start p-3 bg-white border border-purple-200 rounded-lg shadow-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-gray-900">{cert.name}</div>
                    <div className="text-sm text-purple-600">{cert.issuer}</div>
                    <div className="text-sm text-gray-500">{cert.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InnovatorTemplate;