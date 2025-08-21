/**
 * SEO Utilities
 * 
 * Centralized SEO management for meta tags, Open Graph, and structured data.
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

const DEFAULT_SEO: SEOData = {
  title: 'ResumeAI - Professional Resume Builder with AI',
  description: 'Create professional, ATS-optimized resumes with AI-powered content suggestions. Choose from 11+ templates and boost your job search success.',
  keywords: [
    'resume builder',
    'AI resume',
    'professional resume',
    'ATS optimized',
    'job search',
    'career',
    'cv builder',
    'resume templates',
    'resume maker',
    'online resume',
  ],
  image: '/og-image.png',
  type: 'website',
};

/**
 * Update document meta tags
 */
export function updateSEO(seoData: Partial<SEOData>) {
  const data = { ...DEFAULT_SEO, ...seoData };
  const url = data.url || window.location.href;

  // Update document title
  document.title = data.title;

  // Helper function to update or create meta tags
  const updateMetaTag = (selector: string, content: string) => {
    let element = document.querySelector(selector) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      if (selector.includes('property')) {
        element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
      } else if (selector.includes('name')) {
        element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Basic meta tags
  updateMetaTag('meta[name="description"]', data.description);
  if (data.keywords) {
    updateMetaTag('meta[name="keywords"]', data.keywords.join(', '));
  }
  if (data.author) {
    updateMetaTag('meta[name="author"]', data.author);
  }

  // Open Graph tags
  updateMetaTag('meta[property="og:title"]', data.title);
  updateMetaTag('meta[property="og:description"]', data.description);
  updateMetaTag('meta[property="og:type"]', data.type || 'website');
  updateMetaTag('meta[property="og:url"]', url);
  if (data.image) {
    updateMetaTag('meta[property="og:image"]', data.image.startsWith('http') ? data.image : window.location.origin + data.image);
  }

  // Twitter Card tags
  updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
  updateMetaTag('meta[name="twitter:title"]', data.title);
  updateMetaTag('meta[name="twitter:description"]', data.description);
  if (data.image) {
    updateMetaTag('meta[name="twitter:image"]', data.image.startsWith('http') ? data.image : window.location.origin + data.image);
  }

  // Article-specific tags
  if (data.type === 'article') {
    if (data.publishedDate) {
      updateMetaTag('meta[property="article:published_time"]', data.publishedDate);
    }
    if (data.modifiedDate) {
      updateMetaTag('meta[property="article:modified_time"]', data.modifiedDate);
    }
    if (data.author) {
      updateMetaTag('meta[property="article:author"]', data.author);
    }
  }

  // Canonical URL
  let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalElement) {
    canonicalElement = document.createElement('link');
    canonicalElement.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalElement);
  }
  canonicalElement.setAttribute('href', url);
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(type: 'Organization' | 'WebApplication' | 'SoftwareApplication' = 'WebApplication') {
  const baseUrl = window.location.origin;
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ResumeAI",
    "description": "Professional resume builder with AI-powered content suggestions",
    "url": baseUrl,
    "logo": baseUrl + "/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@resumeai.com"
    },
    "sameAs": [
      "https://twitter.com/resumeai",
      "https://linkedin.com/company/resumeai"
    ]
  };

  const applicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ResumeAI",
    "description": "Professional resume builder with AI-powered content suggestions and ATS-optimized templates",
    "url": baseUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": [
      {
        "@type": "Offer",
        "name": "Basic Plan",
        "price": "3",
        "priceCurrency": "USD",
        "description": "Access to basic templates and PDF export"
      },
      {
        "@type": "Offer",
        "name": "AI Plan",
        "price": "7",
        "priceCurrency": "USD",
        "description": "All templates plus AI content suggestions"
      },
      {
        "@type": "Offer",
        "name": "Pro Plan",
        "price": "15",
        "priceCurrency": "USD",
        "description": "Unlimited access to all features"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "publisher": organizationData
  };

  const structuredData = type === 'Organization' ? organizationData : applicationData;

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

/**
 * SEO configurations for different pages
 */
export const PAGE_SEO: Record<string, Partial<SEOData>> = {
  home: {
    title: 'ResumeAI - Professional Resume Builder with AI',
    description: 'Create professional, ATS-optimized resumes with AI-powered content suggestions. Choose from 11+ templates and boost your job search success.',
  },
  
  templates: {
    title: 'Resume Templates - Professional & ATS-Optimized | ResumeAI',
    description: 'Browse our collection of professional resume templates. ATS-optimized designs for every career level and industry.',
  },
  
  pricing: {
    title: 'Pricing Plans - Affordable Resume Builder | ResumeAI',
    description: 'Choose the perfect plan for your needs. Basic ($3), AI-Enhanced ($7), or Pro ($15/month). All plans include ATS-optimized templates.',
  },
  
  builder: {
    title: 'Resume Builder - Create Your Professional Resume | ResumeAI',
    description: 'Build your professional resume with our intuitive editor. AI-powered suggestions and real-time preview.',
  },
  
  profile: {
    title: 'My Profile - Manage Your Account | ResumeAI',
    description: 'Manage your ResumeAI account, subscription, and personal information.',
  },
};

/**
 * Initialize SEO for a page
 */
export function initPageSEO(pageKey: keyof typeof PAGE_SEO) {
  const seoData = PAGE_SEO[pageKey];
  if (seoData) {
    updateSEO(seoData);
    generateStructuredData();
  }
}

export default {
  updateSEO,
  generateStructuredData,
  initPageSEO,
  PAGE_SEO,
};
