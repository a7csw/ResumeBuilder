export type Audience = 'student' | 'professional' | 'freelancer' | 'all';
export type Plan = 'basic' | 'premium';

export interface TemplateColorVariant {
  id: string;
  label: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  audience: Audience[];
  plan: Plan;
  colors: TemplateColorVariant[];
}

// 20 photo-free templates with safe color palettes
export const TEMPLATES_REGISTRY: TemplateMeta[] = [
  { id: 'classic', name: 'Classic', audience: ['professional','student','freelancer'], plan: 'basic', colors: [
    { id: 'indigo', label: 'Indigo' }, { id: 'slate', label: 'Slate' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'minimal', name: 'Minimal', audience: ['all'], plan: 'basic', colors: [
    { id: 'slate', label: 'Slate' }, { id: 'zinc', label: 'Zinc' }, { id: 'sky', label: 'Sky' }
  ] },
  { id: 'student', name: 'Student Focus', audience: ['student'], plan: 'basic', colors: [
    { id: 'blue', label: 'Blue' }, { id: 'violet', label: 'Violet' }, { id: 'teal', label: 'Teal' }
  ] },
  { id: 'modern', name: 'Modern', audience: ['professional'], plan: 'premium', colors: [
    { id: 'emerald', label: 'Emerald' }, { id: 'cyan', label: 'Cyan' }, { id: 'rose', label: 'Rose' }
  ] },
  { id: 'creative', name: 'Creative', audience: ['professional','freelancer'], plan: 'premium', colors: [
    { id: 'purple', label: 'Purple' }, { id: 'pink', label: 'Pink' }, { id: 'amber', label: 'Amber' }
  ] },
  { id: 'technical', name: 'Technical', audience: ['professional'], plan: 'premium', colors: [
    { id: 'sky', label: 'Sky' }, { id: 'indigo', label: 'Indigo' }, { id: 'lime', label: 'Lime' }
  ] },
  { id: 'graduate', name: 'Graduate', audience: ['student'], plan: 'premium', colors: [
    { id: 'violet', label: 'Violet' }, { id: 'blue', label: 'Blue' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'internship', name: 'Internship', audience: ['student'], plan: 'premium', colors: [
    { id: 'sky', label: 'Sky' }, { id: 'teal', label: 'Teal' }, { id: 'indigo', label: 'Indigo' }
  ] },
  { id: 'executive', name: 'Executive', audience: ['professional'], plan: 'premium', colors: [
    { id: 'stone', label: 'Stone' }, { id: 'indigo', label: 'Indigo' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'consultant', name: 'Consultant', audience: ['professional'], plan: 'premium', colors: [
    { id: 'slate', label: 'Slate' }, { id: 'cyan', label: 'Cyan' }, { id: 'amber', label: 'Amber' }
  ] },
  { id: 'innovator', name: 'Innovator', audience: ['professional','freelancer'], plan: 'premium', colors: [
    { id: 'rose', label: 'Rose' }, { id: 'violet', label: 'Violet' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'techlead', name: 'Tech Lead', audience: ['professional'], plan: 'premium', colors: [
    { id: 'indigo', label: 'Indigo' }, { id: 'emerald', label: 'Emerald' }, { id: 'sky', label: 'Sky' }
  ] },
  { id: 'bold', name: 'Bold', audience: ['all'], plan: 'premium', colors: [
    { id: 'rose', label: 'Rose' }, { id: 'violet', label: 'Violet' }, { id: 'cyan', label: 'Cyan' }
  ] },
  { id: 'elegant', name: 'Elegant', audience: ['professional'], plan: 'premium', colors: [
    { id: 'stone', label: 'Stone' }, { id: 'slate', label: 'Slate' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'airy', name: 'Airy', audience: ['all'], plan: 'basic', colors: [
    { id: 'sky', label: 'Sky' }, { id: 'zinc', label: 'Zinc' }, { id: 'violet', label: 'Violet' }
  ] },
  { id: 'focus', name: 'Focus', audience: ['professional'], plan: 'basic', colors: [
    { id: 'indigo', label: 'Indigo' }, { id: 'cyan', label: 'Cyan' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'outline', name: 'Outline', audience: ['all'], plan: 'basic', colors: [
    { id: 'slate', label: 'Slate' }, { id: 'zinc', label: 'Zinc' }, { id: 'stone', label: 'Stone' }
  ] },
  { id: 'compact', name: 'Compact', audience: ['professional','student'], plan: 'basic', colors: [
    { id: 'zinc', label: 'Zinc' }, { id: 'indigo', label: 'Indigo' }, { id: 'blue', label: 'Blue' }
  ] },
  { id: 'metro', name: 'Metro', audience: ['freelancer','professional'], plan: 'premium', colors: [
    { id: 'purple', label: 'Purple' }, { id: 'teal', label: 'Teal' }, { id: 'amber', label: 'Amber' }
  ] },
  { id: 'stream', name: 'Stream', audience: ['freelancer','professional','student'], plan: 'premium', colors: [
    { id: 'cyan', label: 'Cyan' }, { id: 'emerald', label: 'Emerald' }, { id: 'rose', label: 'Rose' }
  ] },
];

export const findTemplateMeta = (id: string) => TEMPLATES_REGISTRY.find(t => t.id === id);
export const basicTemplates = () => TEMPLATES_REGISTRY.filter(t => t.plan === 'basic');
export const premiumTemplates = () => TEMPLATES_REGISTRY.filter(t => t.plan === 'premium');
