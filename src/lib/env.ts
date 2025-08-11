/**
 * Environment Variables Configuration
 * 
 * Client-side env vars must be prefixed with VITE_
 * Server-side env vars are accessed via process.env in Supabase functions
 */

// Client-side environment variables (bundled into the client)
const requiredClientEnvs = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  VITE_LEMON_STORE_ID: import.meta.env.VITE_LEMON_STORE_ID,
  VITE_LEMON_PRODUCT_BASIC: import.meta.env.VITE_LEMON_PRODUCT_BASIC,
  VITE_LEMON_PRODUCT_AI: import.meta.env.VITE_LEMON_PRODUCT_AI,
  VITE_LEMON_PRODUCT_MONTHLY: import.meta.env.VITE_LEMON_PRODUCT_MONTHLY,
} as const;

// Optional client environment variables
const optionalClientEnvs = {
  VITE_APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:8080',
  VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  PAYMENTS_PROVIDER: import.meta.env.PAYMENTS_PROVIDER || 'stripe',
  VITE_TEST_MODE: import.meta.env.VITE_TEST_MODE || 'false',
  VITE_SHOW_TEST_BANNER: import.meta.env.VITE_SHOW_TEST_BANNER || 'false',
} as const;

// Validate required environment variables
function validateRequiredEnvs() {
  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(requiredClientEnvs)) {
    if (!value) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(key => `- ${key}`).join('\n')}\n\nPlease check your .env.local file.`
    );
  }
}

// Validate on import
validateRequiredEnvs();

// Export typed environment variables
export const env = {
  ...requiredClientEnvs,
  ...optionalClientEnvs,
} as const;

// Type for server-side environment variables (used in Supabase functions)
export interface ServerEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  OPENAI_API_KEY?: string;
  RESEND_API_KEY?: string;
}

// Development helpers
export const isDevelopment = env.VITE_ENVIRONMENT === 'development';
export const isProduction = env.VITE_ENVIRONMENT === 'production';
