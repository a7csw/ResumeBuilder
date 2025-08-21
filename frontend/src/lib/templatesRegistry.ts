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

// 25+ diverse templates with rich color palettes
export const TEMPLATES_REGISTRY: TemplateMeta[] = [
  // Basic Plan Templates (8 templates)
  { id: 'classic', name: 'Classic Professional', audience: ['professional','student','freelancer'], plan: 'basic', colors: [
    { id: 'navy', label: 'Navy' }, { id: 'charcoal', label: 'Charcoal' }, { id: 'forest', label: 'Forest' }
  ] },
  { id: 'minimal', name: 'Clean Minimal', audience: ['all'], plan: 'basic', colors: [
    { id: 'slate', label: 'Slate' }, { id: 'zinc', label: 'Zinc' }, { id: 'sky', label: 'Sky' }
  ] },
  { id: 'student', name: 'Student Friendly', audience: ['student'], plan: 'basic', colors: [
    { id: 'blue', label: 'Blue' }, { id: 'violet', label: 'Violet' }, { id: 'teal', label: 'Teal' }
  ] },
  { id: 'airy', name: 'Fresh & Airy', audience: ['all'], plan: 'basic', colors: [
    { id: 'sky', label: 'Sky' }, { id: 'mint', label: 'Mint' }, { id: 'lavender', label: 'Lavender' }
  ] },
  { id: 'focus', name: 'Career Focus', audience: ['professional'], plan: 'basic', colors: [
    { id: 'indigo', label: 'Indigo' }, { id: 'cyan', label: 'Cyan' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'outline', name: 'Simple Outline', audience: ['all'], plan: 'basic', colors: [
    { id: 'slate', label: 'Slate' }, { id: 'zinc', label: 'Zinc' }, { id: 'stone', label: 'Stone' }
  ] },
  { id: 'compact', name: 'Space Saver', audience: ['professional','student'], plan: 'basic', colors: [
    { id: 'navy', label: 'Navy' }, { id: 'indigo', label: 'Indigo' }, { id: 'blue', label: 'Blue' }
  ] },
  { id: 'academic', name: 'Academic Style', audience: ['student'], plan: 'basic', colors: [
    { id: 'burgundy', label: 'Burgundy' }, { id: 'olive', label: 'Olive' }, { id: 'slate', label: 'Slate' }
  ] },

  // Premium Plan Templates (18 templates)
  { id: 'modern', name: 'Modern Executive', audience: ['professional'], plan: 'premium', colors: [
    { id: 'emerald', label: 'Emerald' }, { id: 'cyan', label: 'Cyan' }, { id: 'coral', label: 'Coral' }
  ] },
  { id: 'creative', name: 'Creative Designer', audience: ['professional','freelancer'], plan: 'premium', colors: [
    { id: 'purple', label: 'Purple' }, { id: 'magenta', label: 'Magenta' }, { id: 'amber', label: 'Amber' }
  ] },
  { id: 'technical', name: 'Tech Professional', audience: ['professional'], plan: 'premium', colors: [
    { id: 'electric', label: 'Electric Blue' }, { id: 'matrix', label: 'Matrix Green' }, { id: 'cyber', label: 'Cyber Orange' }
  ] },
  { id: 'graduate', name: 'Graduate Plus', audience: ['student'], plan: 'premium', colors: [
    { id: 'royal', label: 'Royal Blue' }, { id: 'gold', label: 'Gold' }, { id: 'emerald', label: 'Emerald' }
  ] },
  { id: 'internship', name: 'Internship Pro', audience: ['student'], plan: 'premium', colors: [
    { id: 'fresh', label: 'Fresh Mint' }, { id: 'ocean', label: 'Ocean Blue' }, { id: 'sunrise', label: 'Sunrise Orange' }
  ] },
  { id: 'executive', name: 'C-Suite Executive', audience: ['professional'], plan: 'premium', colors: [
    { id: 'platinum', label: 'Platinum' }, { id: 'charcoal', label: 'Charcoal' }, { id: 'gold', label: 'Gold' }
  ] },
  { id: 'consultant', name: 'Strategic Consultant', audience: ['professional'], plan: 'premium', colors: [
    { id: 'sage', label: 'Sage' }, { id: 'azure', label: 'Azure' }, { id: 'bronze', label: 'Bronze' }
  ] },
  { id: 'innovator', name: 'Innovation Leader', audience: ['professional','freelancer'], plan: 'premium', colors: [
    { id: 'coral', label: 'Coral' }, { id: 'violet', label: 'Violet' }, { id: 'lime', label: 'Lime' }
  ] },
  { id: 'techlead', name: 'Tech Lead Pro', audience: ['professional'], plan: 'premium', colors: [
    { id: 'neon', label: 'Neon Blue' }, { id: 'forest', label: 'Forest' }, { id: 'electric', label: 'Electric Purple' }
  ] },
  { id: 'bold', name: 'Bold Statement', audience: ['all'], plan: 'premium', colors: [
    { id: 'crimson', label: 'Crimson' }, { id: 'royal', label: 'Royal Purple' }, { id: 'turquoise', label: 'Turquoise' }
  ] },
  { id: 'elegant', name: 'Sophisticated Elegance', audience: ['professional'], plan: 'premium', colors: [
    { id: 'champagne', label: 'Champagne' }, { id: 'midnight', label: 'Midnight' }, { id: 'rose-gold', label: 'Rose Gold' }
  ] },
  { id: 'metro', name: 'Metro Professional', audience: ['freelancer','professional'], plan: 'premium', colors: [
    { id: 'urban', label: 'Urban Gray' }, { id: 'sunset', label: 'Sunset Orange' }, { id: 'mint', label: 'Mint Green' }
  ] },
  { id: 'stream', name: 'Dynamic Stream', audience: ['freelancer','professional','student'], plan: 'premium', colors: [
    { id: 'flowing', label: 'Flowing Blue' }, { id: 'energy', label: 'Energy Green' }, { id: 'passion', label: 'Passion Red' }
  ] },
  { id: 'artistic', name: 'Creative Artist', audience: ['freelancer'], plan: 'premium', colors: [
    { id: 'palette', label: 'Artist Palette' }, { id: 'canvas', label: 'Canvas Cream' }, { id: 'brush', label: 'Brush Black' }
  ] },
  { id: 'startup', name: 'Startup Founder', audience: ['professional','freelancer'], plan: 'premium', colors: [
    { id: 'venture', label: 'Venture Blue' }, { id: 'growth', label: 'Growth Green' }, { id: 'disrupt', label: 'Disrupt Orange' }
  ] },
  { id: 'finance', name: 'Financial Professional', audience: ['professional'], plan: 'premium', colors: [
    { id: 'investment', label: 'Investment Gold' }, { id: 'market', label: 'Market Blue' }, { id: 'trust', label: 'Trust Green' }
  ] },
  { id: 'healthcare', name: 'Healthcare Professional', audience: ['professional'], plan: 'premium', colors: [
    { id: 'medical', label: 'Medical Blue' }, { id: 'care', label: 'Care Green' }, { id: 'trust', label: 'Trust White' }
  ] },
  { id: 'research', name: 'Research Scholar', audience: ['student','professional'], plan: 'premium', colors: [
    { id: 'academic', label: 'Academic Navy' }, { id: 'discovery', label: 'Discovery Teal' }, { id: 'knowledge', label: 'Knowledge Purple' }
  ] },
  { id: 'digital', name: 'Digital Native', audience: ['freelancer','professional','student'], plan: 'premium', colors: [
    { id: 'pixel', label: 'Pixel Blue' }, { id: 'code', label: 'Code Green' }, { id: 'cloud', label: 'Cloud Purple' }
  ] },
];

export const findTemplateMeta = (id: string) => TEMPLATES_REGISTRY.find(t => t.id === id);
export const basicTemplates = () => TEMPLATES_REGISTRY.filter(t => t.plan === 'basic');
export const premiumTemplates = () => TEMPLATES_REGISTRY.filter(t => t.plan === 'premium');
