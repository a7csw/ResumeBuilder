/**
 * Environment Configuration for Lovable Projects
 * 
 * Note: Lovable doesn't use .env files or VITE_ environment variables
 * Public keys and URLs are stored directly in the code
 */

// Supabase Configuration (from Lovable project)
const SUPABASE_CONFIG = {
  url: "https://sqvaqiepymfoubwibuds.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdmFxaWVweW1mb3Vid2lidWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTQzNzYsImV4cCI6MjA2OTQ5MDM3Nn0._pZbc371YtVF2-zT6DjVQDpLs-2uiDLHT-eFngdewYo"
};

// Stripe Configuration (publishable keys are safe to store in code)
const STRIPE_CONFIG = {
  publishableKey: "pk_test_51234567890", // Replace with your actual Stripe publishable key
};

// Lemon Squeezy Configuration (if using Lemon Squeezy)
const LEMON_SQUEEZY_CONFIG = {
  storeId: "your-store-id", // Replace with your actual store ID
  products: {
    basic: "variant-id-basic", // Replace with actual variant IDs
    ai: "variant-id-ai",
    monthly: "variant-id-monthly"
  }
};

// Application Configuration
const APP_CONFIG = {
  url: typeof window !== 'undefined' ? window.location.origin : 'https://sqvaqiepymfoubwibuds.supabase.co',
  environment: 'development', // Change to 'production' when deploying
  paymentsProvider: 'stripe', // 'stripe' or 'lemonsqueezy'
  testMode: 'true', // Set to 'false' for production
  showTestBanner: 'true' // Set to 'false' for production
};

// Export the environment configuration
export const env = {
  // Supabase
  SUPABASE_URL: SUPABASE_CONFIG.url,
  SUPABASE_ANON_KEY: SUPABASE_CONFIG.anonKey,
  
  // Stripe
  STRIPE_PUBLISHABLE_KEY: STRIPE_CONFIG.publishableKey,
  
  // Lemon Squeezy
  LEMON_STORE_ID: LEMON_SQUEEZY_CONFIG.storeId,
  LEMON_PRODUCT_BASIC: LEMON_SQUEEZY_CONFIG.products.basic,
  LEMON_PRODUCT_AI: LEMON_SQUEEZY_CONFIG.products.ai,
  LEMON_PRODUCT_MONTHLY: LEMON_SQUEEZY_CONFIG.products.monthly,
  
  // Application
  APP_URL: APP_CONFIG.url,
  ENVIRONMENT: APP_CONFIG.environment,
  PAYMENTS_PROVIDER: APP_CONFIG.paymentsProvider,
  TEST_MODE: APP_CONFIG.testMode,
  SHOW_TEST_BANNER: APP_CONFIG.showTestBanner,
  
  // Legacy VITE_ aliases for backward compatibility
  VITE_SUPABASE_URL: SUPABASE_CONFIG.url,
  VITE_SUPABASE_ANON_KEY: SUPABASE_CONFIG.anonKey,
  VITE_STRIPE_PUBLISHABLE_KEY: STRIPE_CONFIG.publishableKey,
  VITE_LEMON_STORE_ID: LEMON_SQUEEZY_CONFIG.storeId,
  VITE_LEMON_PRODUCT_BASIC: LEMON_SQUEEZY_CONFIG.products.basic,
  VITE_LEMON_PRODUCT_AI: LEMON_SQUEEZY_CONFIG.products.ai,
  VITE_LEMON_PRODUCT_MONTHLY: LEMON_SQUEEZY_CONFIG.products.monthly,
  VITE_APP_URL: APP_CONFIG.url,
  VITE_ENVIRONMENT: APP_CONFIG.environment,
  VITE_TEST_MODE: APP_CONFIG.testMode,
  VITE_SHOW_TEST_BANNER: APP_CONFIG.showTestBanner
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
export const isDevelopment = env.ENVIRONMENT === 'development';
export const isProduction = env.ENVIRONMENT === 'production';

// Payment provider helpers
export const isStripeEnabled = env.PAYMENTS_PROVIDER === 'stripe';
export const isLemonSqueezyEnabled = env.PAYMENTS_PROVIDER === 'lemonsqueezy';

// Test mode helpers
export const isTestMode = env.TEST_MODE === 'true';
export const showTestBanner = env.SHOW_TEST_BANNER === 'true';

console.log('✅ Environment configuration loaded successfully');
console.log('📊 Supabase URL:', env.SUPABASE_URL);
console.log('💳 Payments Provider:', env.PAYMENTS_PROVIDER);
console.log('🧪 Test Mode:', isTestMode ? 'Enabled' : 'Disabled');