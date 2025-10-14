/**
 * Navigation utilities to handle safe routing and prevent broken navigation
 */

export const VALID_ROUTES = [
  '/',
  '/auth',
  '/form-selection',
  '/form/professional',
  '/form/freelancer', 
  '/form/student',
  '/ai-generation',
  '/resume-preview',
  '/resume-generated',
  '/pricing',
  '/plan-selection',
  '/dashboard',
  '/profile',
  '/my-resumes',
  '/reset-password',
  '/status',
  '/success',
  '/gumroad/success'
] as const;

export type ValidRoute = typeof VALID_ROUTES[number];

/**
 * Check if a route is valid
 */
export const isValidRoute = (route: string): route is ValidRoute => {
  return VALID_ROUTES.includes(route as ValidRoute);
};

/**
 * Safe navigation with fallback
 */
export const safeNavigate = (navigate: (path: string, options?: any) => void, path: string, options?: any) => {
  if (isValidRoute(path)) {
    navigate(path, options);
  } else {
    console.warn(`Invalid route attempted: ${path}. Redirecting to home.`);
    navigate('/', { replace: true });
  }
};

/**
 * Get fallback route based on user state
 */
export const getFallbackRoute = (hasFormData: boolean = false): ValidRoute => {
  if (hasFormData) {
    return '/resume-preview';
  }
  return '/form-selection';
};

/**
 * Validate and clean localStorage data
 */
export const validateResumeData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  const required = ['personalInfo', 'type'];
  return required.every(field => data[field]);
};

/**
 * Safe localStorage operations
 */
export const localStorage_ = {
  get: (key: string): any | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error reading from localStorage:`, error);
      return null;
    }
  },
  
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage:`, error);
      return false;
    }
  }
};
