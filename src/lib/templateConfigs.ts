// Template configurations for different resume templates
// This centralizes all template-specific form fields and styling

export interface TemplateField {
  id: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'array';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  arrayType?: 'simple' | 'object';
  fields?: TemplateField[];
}

export interface TemplateSection {
  id: string;
  name: string;
  fields: TemplateField[];
  showForUserType?: ('student' | 'professional' | 'freelancer')[];
  priority: number; // Lower number = higher priority
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'creative' | 'academic' | 'minimal';
  isPremium: boolean;
  sections: TemplateSection[];
  userTypeRecommendations: {
    student: number; // 1-10 rating
    professional: number;
    freelancer: number;
  };
  colors: {
    primary: string;
    accent: string;
    text: string;
    background: string;
  };
}

// Base sections that all templates share
const basePersonalInfoSection: TemplateSection = {
  id: 'personalInfo',
  name: 'Personal Information',
  priority: 1,
  fields: [
    { id: 'firstName', type: 'text', label: 'First Name', placeholder: 'John', required: true },
    { id: 'lastName', type: 'text', label: 'Last Name', placeholder: 'Doe', required: true },
    { id: 'title', type: 'text', label: 'Professional Title', placeholder: 'Software Engineer' },
    { id: 'email', type: 'text', label: 'Email', placeholder: 'john.doe@example.com', required: true },
    { id: 'phone', type: 'text', label: 'Phone', placeholder: '+1 (555) 123-4567' },
    { id: 'location', type: 'text', label: 'Location', placeholder: 'San Francisco, CA' },
    { id: 'linkedin', type: 'text', label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe' },
    { id: 'website', type: 'text', label: 'Website', placeholder: 'www.johndoe.com' },
    { id: 'industry', type: 'text', label: 'Industry', placeholder: 'Technology' }
  ]
};

const baseSummarySection: TemplateSection = {
  id: 'summary',
  name: 'Professional Summary',
  priority: 2,
  fields: [
    { 
      id: 'summary', 
      type: 'textarea', 
      label: 'Summary', 
      placeholder: 'Write a compelling professional summary highlighting your key achievements and skills...' 
    }
  ]
};

const baseExperienceSection: TemplateSection = {
  id: 'experience',
  name: 'Work Experience',
  priority: 3,
  showForUserType: ['professional', 'freelancer'],
  fields: [
    {
      id: 'experience',
      type: 'array',
      label: 'Experience',
      arrayType: 'object',
      fields: [
        { id: 'title', type: 'text', label: 'Job Title', placeholder: 'Senior Developer', required: true },
        { id: 'company', type: 'text', label: 'Company', placeholder: 'Tech Corp Inc.', required: true },
        { id: 'startDate', type: 'date', label: 'Start Date', required: true },
        { id: 'endDate', type: 'date', label: 'End Date' },
        { id: 'description', type: 'textarea', label: 'Description', placeholder: 'Describe your role and key responsibilities...' },
        {
          id: 'achievements',
          type: 'array',
          label: 'Key Achievements',
          arrayType: 'simple',
          fields: [{ id: 'achievement', type: 'text', label: 'Achievement', placeholder: 'Increased performance by 40%' }]
        }
      ]
    }
  ]
};

const baseEducationSection: TemplateSection = {
  id: 'education',
  name: 'Education',
  priority: 4,
  fields: [
    {
      id: 'education',
      type: 'array',
      label: 'Education',
      arrayType: 'object',
      fields: [
        { id: 'degree', type: 'text', label: 'Degree', placeholder: 'Bachelor of Computer Science', required: true },
        { id: 'school', type: 'text', label: 'School', placeholder: 'University of Technology', required: true },
        { id: 'graduationDate', type: 'date', label: 'Graduation Date', required: true },
        { id: 'gpa', type: 'text', label: 'GPA', placeholder: '3.8' }
      ]
    }
  ]
};

const baseSkillsSection: TemplateSection = {
  id: 'skills',
  name: 'Skills',
  priority: 5,
  fields: [
    {
      id: 'skills',
      type: 'array',
      label: 'Skills',
      arrayType: 'simple',
      fields: [{ id: 'skill', type: 'text', label: 'Skill', placeholder: 'JavaScript, React, Node.js' }]
    }
  ]
};

const baseProjectsSection: TemplateSection = {
  id: 'projects',
  name: 'Projects',
  priority: 6,
  fields: [
    {
      id: 'projects',
      type: 'array',
      label: 'Projects',
      arrayType: 'object',
      fields: [
        { id: 'name', type: 'text', label: 'Project Name', placeholder: 'E-commerce Platform', required: true },
        { id: 'description', type: 'textarea', label: 'Description', placeholder: 'Built a full-stack e-commerce solution...' },
        { id: 'technologies', type: 'text', label: 'Technologies', placeholder: 'React, Node.js, MongoDB' },
        { id: 'date', type: 'date', label: 'Completion Date' },
        { id: 'link', type: 'text', label: 'Project Link', placeholder: 'https://github.com/...' }
      ]
    }
  ]
};

const baseCertificationsSection: TemplateSection = {
  id: 'certifications',
  name: 'Certifications',
  priority: 7,
  fields: [
    {
      id: 'certifications',
      type: 'array',
      label: 'Certifications',
      arrayType: 'object',
      fields: [
        { id: 'name', type: 'text', label: 'Certification Name', placeholder: 'AWS Solutions Architect', required: true },
        { id: 'issuer', type: 'text', label: 'Issuing Organization', placeholder: 'Amazon Web Services', required: true },
        { id: 'date', type: 'date', label: 'Issue Date', required: true }
      ]
    }
  ]
};

// Template-specific sections
const researchSection: TemplateSection = {
  id: 'research',
  name: 'Research & Publications',
  priority: 8,
  showForUserType: ['student'],
  fields: [
    {
      id: 'research',
      type: 'array',
      label: 'Research',
      arrayType: 'object',
      fields: [
        { id: 'title', type: 'text', label: 'Research Title', placeholder: 'Machine Learning in Healthcare', required: true },
        { id: 'publication', type: 'text', label: 'Publication/Conference', placeholder: 'IEEE Conference on AI' },
        { id: 'date', type: 'date', label: 'Publication Date' },
        { id: 'description', type: 'textarea', label: 'Description', placeholder: 'Brief description of your research...' }
      ]
    }
  ]
};

const awardsSection: TemplateSection = {
  id: 'awards',
  name: 'Awards & Achievements',
  priority: 9,
  fields: [
    {
      id: 'awards',
      type: 'array',
      label: 'Awards',
      arrayType: 'object',
      fields: [
        { id: 'title', type: 'text', label: 'Award Title', placeholder: 'Employee of the Year', required: true },
        { id: 'issuer', type: 'text', label: 'Issuing Organization', placeholder: 'Tech Corp Inc.', required: true },
        { id: 'date', type: 'date', label: 'Date Received', required: true },
        { id: 'description', type: 'textarea', label: 'Description', placeholder: 'Description of the achievement...' }
      ]
    }
  ]
};

const volunteerSection: TemplateSection = {
  id: 'volunteer',
  name: 'Volunteer Experience',
  priority: 10,
  showForUserType: ['student'],
  fields: [
    {
      id: 'volunteer',
      type: 'array',
      label: 'Volunteer Experience',
      arrayType: 'object',
      fields: [
        { id: 'organization', type: 'text', label: 'Organization', placeholder: 'Red Cross', required: true },
        { id: 'role', type: 'text', label: 'Role', placeholder: 'Volunteer Coordinator', required: true },
        { id: 'startDate', type: 'date', label: 'Start Date', required: true },
        { id: 'endDate', type: 'date', label: 'End Date' },
        { id: 'description', type: 'textarea', label: 'Description', placeholder: 'Describe your volunteer activities...' }
      ]
    }
  ]
};

const languagesSection: TemplateSection = {
  id: 'languages',
  name: 'Languages',
  priority: 11,
  fields: [
    {
      id: 'languages',
      type: 'array',
      label: 'Languages',
      arrayType: 'object',
      fields: [
        { id: 'language', type: 'text', label: 'Language', placeholder: 'Spanish', required: true },
        { 
          id: 'proficiency', 
          type: 'select', 
          label: 'Proficiency', 
          required: true,
          options: ['Beginner', 'Intermediate', 'Advanced', 'Native']
        }
      ]
    }
  ]
};

// Template configurations
export const templateConfigs: Record<string, TemplateConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean and professional layout perfect for traditional industries',
    category: 'classic',
    isPremium: false,
    sections: [basePersonalInfoSection, baseSummarySection, baseExperienceSection, baseEducationSection, baseSkillsSection],
    userTypeRecommendations: { student: 6, professional: 10, freelancer: 8 },
    colors: { primary: '#2563eb', accent: '#1d4ed8', text: '#1f2937', background: '#ffffff' }
  },
  modern: {
    id: 'modern',
    name: 'Modern Creative',
    description: 'Contemporary design with project showcase for creative professionals',
    category: 'modern',
    isPremium: true,
    sections: [basePersonalInfoSection, baseSummarySection, baseExperienceSection, baseEducationSection, baseProjectsSection, baseSkillsSection],
    userTypeRecommendations: { student: 8, professional: 9, freelancer: 10 },
    colors: { primary: '#059669', accent: '#047857', text: '#1f2937', background: '#ffffff' }
  },
  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Visual-focused design highlighting creative work and achievements',
    category: 'creative',
    isPremium: true,
    sections: [basePersonalInfoSection, baseSummarySection, baseProjectsSection, baseExperienceSection, baseSkillsSection, awardsSection],
    userTypeRecommendations: { student: 7, professional: 8, freelancer: 10 },
    colors: { primary: '#7c3aed', accent: '#6d28d9', text: '#1f2937', background: '#ffffff' }
  },
  technical: {
    id: 'technical',
    name: 'Technical Expert',
    description: 'Technical skills and project-focused for developers and engineers',
    category: 'modern',
    isPremium: true,
    sections: [basePersonalInfoSection, baseSummarySection, baseExperienceSection, baseSkillsSection, baseProjectsSection, baseCertificationsSection],
    userTypeRecommendations: { student: 8, professional: 10, freelancer: 9 },
    colors: { primary: '#dc2626', accent: '#b91c1c', text: '#1f2937', background: '#ffffff' }
  },
  graduate: {
    id: 'graduate',
    name: 'Graduate Scholar',
    description: 'Academic-focused with research and scholarly achievements',
    category: 'academic',
    isPremium: true,
    sections: [basePersonalInfoSection, baseSummarySection, baseEducationSection, researchSection, baseSkillsSection, awardsSection],
    userTypeRecommendations: { student: 10, professional: 6, freelancer: 4 },
    colors: { primary: '#1f2937', accent: '#374151', text: '#1f2937', background: '#ffffff' }
  },
  internship: {
    id: 'internship',
    name: 'Internship Seeker',
    description: 'Entry-level focused with projects and volunteer experience',
    category: 'academic',
    isPremium: true,
    sections: [basePersonalInfoSection, baseSummarySection, baseEducationSection, baseProjectsSection, baseSkillsSection, volunteerSection],
    userTypeRecommendations: { student: 10, professional: 4, freelancer: 5 },
    colors: { primary: '#0891b2', accent: '#0e7490', text: '#1f2937', background: '#ffffff' }
  },
  student: {
    id: 'student',
    name: 'Student Professional',
    description: 'Student-friendly with emphasis on education and projects',
    category: 'academic',
    isPremium: false,
    sections: [basePersonalInfoSection, baseSummarySection, baseEducationSection, baseProjectsSection, baseSkillsSection],
    userTypeRecommendations: { student: 10, professional: 5, freelancer: 6 },
    colors: { primary: '#2563eb', accent: '#1d4ed8', text: '#1f2937', background: '#ffffff' }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean, distraction-free design focusing on content',
    category: 'minimal',
    isPremium: false,
    sections: [basePersonalInfoSection, baseSummarySection, baseExperienceSection, baseEducationSection, baseSkillsSection],
    userTypeRecommendations: { student: 7, professional: 9, freelancer: 8 },
    colors: { primary: '#6b7280', accent: '#4b5563', text: '#1f2937', background: '#ffffff' }
  }
};

export const getTemplateConfig = (templateId: string): TemplateConfig => {
  return templateConfigs[templateId] || templateConfigs.classic;
};

export const getRecommendedTemplates = (userType: 'student' | 'professional' | 'freelancer', limit = 3): TemplateConfig[] => {
  return Object.values(templateConfigs)
    .sort((a, b) => b.userTypeRecommendations[userType] - a.userTypeRecommendations[userType])
    .slice(0, limit);
};

export const getPremiumTemplates = (): TemplateConfig[] => {
  return Object.values(templateConfigs).filter(config => config.isPremium);
};

export const getFreeTemplates = (): TemplateConfig[] => {
  return Object.values(templateConfigs).filter(config => !config.isPremium);
};