/**
 * Server Environment Variables for Supabase Edge Functions
 * 
 * This module validates server-side environment variables that are stored
 * in Supabase Edge Functions → Secrets (NOT in .env.local)
 */

export interface ServerEnvironment {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  LEMON_WEBHOOK_SECRET: string;
  PAYMENTS_PROVIDER: string;
  OPENAI_API_KEY?: string;
  RESEND_API_KEY?: string;
}

/**
 * Validates and returns server environment variables
 * Throws descriptive errors for missing required variables
 * 
 * Usage in Edge Functions:
 * ```typescript
 * import { validateServerEnv } from '../../../src/lib/server-env.ts';
 * const env = validateServerEnv();
 * ```
 */
export function validateServerEnv(): ServerEnvironment {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY', 
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'LEMON_WEBHOOK_SECRET',
    'PAYMENTS_PROVIDER'
  ] as const;

  const optional = [
    'OPENAI_API_KEY',
    'RESEND_API_KEY'
  ] as const;

  const missing: string[] = [];
  const env: Partial<ServerEnvironment> = {};

  // Check required environment variables
  for (const key of required) {
    const value = Deno.env.get(key);
    if (!value) {
      missing.push(key);
    } else {
      env[key] = value;
    }
  }

  // Get optional environment variables
  for (const key of optional) {
    const value = Deno.env.get(key);
    if (value) {
      env[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required server environment variables:\n${
        missing.map(key => `- ${key}`).join('\n')
      }\n\nSet these in Supabase Dashboard → Edge Functions → Secrets`
    );
  }

  return env as ServerEnvironment;
}

/**
 * Helper to get a specific environment variable with validation
 */
export function getServerEnv(key: keyof ServerEnvironment): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Check if AI features are enabled (OpenAI key is present)
 */
export function isAIEnabled(): boolean {
  return !!Deno.env.get('OPENAI_API_KEY');
}

/**
 * Check if email features are enabled (Resend key is present)  
 */
export function isEmailEnabled(): boolean {
  return !!Deno.env.get('RESEND_API_KEY');
}

export default validateServerEnv;
