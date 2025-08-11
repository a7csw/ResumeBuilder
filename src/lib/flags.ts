/**
 * Test Mode and Feature Flags
 * 
 * Centralized helper functions for determining application state
 * and enabling/disabling features based on environment.
 */

/**
 * Check if the application is running in test mode
 */
export const isTestMode = (): boolean => {
  // Never enable test mode in production
  if (import.meta.env.PROD) {
    return false;
  }
  
  return import.meta.env.VITE_TEST_MODE === 'true' || 
         import.meta.env.MODE === 'test';
};

/**
 * Check if payments are disabled (either globally or in test mode)
 */
export const paymentsDisabled = (): boolean => {
  return import.meta.env.VITE_PAYMENTS_PROVIDER === 'disabled' || 
         isTestMode();
};

/**
 * Check if test mode banner should be shown
 */
export const showTestBanner = (): boolean => {
  return isTestMode() && 
         import.meta.env.VITE_SHOW_TEST_BANNER === 'true';
};

/**
 * Get the current payment provider (or 'disabled' if payments are off)
 */
export const getPaymentProvider = (): string => {
  if (paymentsDisabled()) {
    return 'disabled';
  }
  return import.meta.env.VITE_PAYMENTS_PROVIDER || 'stripe';
};

/**
 * Safety check to prevent test mode in production
 */
export const validateTestMode = (): void => {
  if (isTestMode() && import.meta.env.PROD) {
    throw new Error(
      'Test mode cannot be enabled in production! ' +
      'This is a critical safety measure to prevent accidental free access.'
    );
  }
};

// Validate on import
validateTestMode();
