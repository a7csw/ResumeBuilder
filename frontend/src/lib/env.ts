/**
 * Environment Configuration for Vercel Deployment
 * 
 * All environment variables must be prefixed with VITE_ for client-side access
 */

// Supabase Configuration
const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || "https://sqvaqiepymfoubwibuds.supabase.co",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdmFxaWVweW1mb3Vid2lidWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTQzNzYsImV4cCI6MjA2OTQ5MDM3Nn0._pZbc371YtVF2-zT6DjVQDpLs-2uiDLHT-eFngdewYo"
};

// Lemon Squeezy Configuration
const LEMON_SQUEEZY_CONFIG = {
  storeId: import.meta.env.VITE_LEMON_STORE_ID || "92893",
  products: {
    basic: import.meta.env.VITE_LEMON_PRODUCT_BASIC || "518740",
    pro: import.meta.env.VITE_LEMON_PRODUCT_PRO || "518741",
  }
};

// Application Configuration
const APP_CONFIG = {
  url: typeof window !== 'undefined' ? window.location.origin : 'https://sqvaqiepymfoubwibuds.supabase.co',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  paymentsProvider: 'lemonsqueezy',
  testMode: import.meta.env.VITE_TEST_MODE || 'false',
  showTestBanner: import.meta.env.VITE_SHOW_TEST_BANNER || 'false'
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
  
  // VITE_ prefixed variables for Vercel
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