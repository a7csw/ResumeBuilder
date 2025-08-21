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

// Lemon Squeezy Configuration
const LEMON_SQUEEZY_CONFIG = {
  storeId: "92893", // Demo store ID - replace with your actual store ID
  products: {
    basic: "518740", // Basic Plan $5/10 days - replace with actual variant ID
    pro: "518741", // Pro Plan $11/month - replace with actual variant ID
  }
};

// Application Configuration
const APP_CONFIG = {
  url: typeof window !== 'undefined' ? window.location.origin : 'https://sqvaqiepymfoubwibuds.supabase.co',
  environment: 'development', // Change to 'production' when deploying
  paymentsProvider: 'lemonsqueezy', // Only Lemon Squeezy supported now
  testMode: 'false', // Demo mode - payments enabled
  showTestBanner: 'false' // No test banner for clean demo
};

// Export the environment configuration
export const env = {
  // Supabase
  SUPABASE_URL: SUPABASE_CONFIG.url,
  SUPABASE_ANON_KEY: SUPABASE_CONFIG.anonKey,
  
  // Lemon Squeezy
  LEMON_STORE_ID: LEMON_SQUEEZY_CONFIG.storeId,
  LEMON_PRODUCT_BASIC: LEMON_SQUEEZY_CONFIG.products.basic,
  LEMON_PRODUCT_PRO: LEMON_SQUEEZY_CONFIG.products.pro,
  
  // Application
  APP_URL: APP_CONFIG.url,
  ENVIRONMENT: APP_CONFIG.environment,
  PAYMENTS_PROVIDER: APP_CONFIG.paymentsProvider,
  TEST_MODE: APP_CONFIG.testMode,
  SHOW_TEST_BANNER: APP_CONFIG.showTestBanner,
  
  // Legacy VITE_ aliases for backward compatibility
  VITE_SUPABASE_URL: SUPABASE_CONFIG.url,
  VITE_SUPABASE_ANON_KEY: SUPABASE_CONFIG.anonKey,
  VITE_LEMON_STORE_ID: LEMON_SQUEEZY_CONFIG.storeId,
  VITE_LEMON_PRODUCT_BASIC: LEMON_SQUEEZY_CONFIG.products.basic,
  VITE_LEMON_PRODUCT_PRO: LEMON_SQUEEZY_CONFIG.products.pro,
  VITE_APP_URL: APP_CONFIG.url,
  VITE_ENVIRONMENT: APP_CONFIG.environment,
  VITE_TEST_MODE: APP_CONFIG.testMode,
  VITE_SHOW_TEST_BANNER: APP_CONFIG.showTestBanner
} as const;

// Type for server-side environment variables (used in Supabase functions)
export interface ServerEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  OPENAI_API_KEY?: string;
  RESEND_API_KEY?: string;
  LEMON_SQUEEZY_API_KEY?: string;
  LEMON_SQUEEZY_WEBHOOK_SECRET?: string;
}

// Development helpers
export const isDevelopment = env.ENVIRONMENT === 'development';
export const isProduction = env.ENVIRONMENT === 'production';

// Payment provider helpers
export const isLemonSqueezyEnabled = env.PAYMENTS_PROVIDER === 'lemonsqueezy';

// Test mode helpers - when true, bypasses all payment checks
export const isTestMode = env.TEST_MODE === 'true';
export const showTestBanner = env.SHOW_TEST_BANNER === 'true';

// Payment bypass helper - returns true if user should have access regardless of payment status
export const bypassPayments = () => isTestMode;

// Silent mode for demo - no console logs