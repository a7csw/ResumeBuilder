import { supabase } from '@/integrations/supabase/client';

interface NameValidationResult {
  success: boolean;
  allowed: boolean;
  error?: string;
  message?: string;
  existingName?: {
    firstName: string;
    lastName: string;
  };
}

/**
 * Validates name changes before saving to prevent unauthorized modifications
 * @param firstName - New first name
 * @param lastName - New last name
 * @returns Promise<NameValidationResult>
 */
export async function validateNameChange(
  firstName: string, 
  lastName: string
): Promise<NameValidationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('validate-name-change', {
      body: { firstName, lastName }
    });

    if (error) {
      console.error('Name validation error:', error);
      return {
        success: false,
        allowed: false,
        error: 'Validation failed',
        message: error.message || 'Failed to validate name change'
      };
    }

    return {
      success: true,
      allowed: data.allowed,
      error: data.error,
      message: data.message,
      existingName: data.existingName
    };

  } catch (error) {
    console.error('Error calling name validation function:', error);
    return {
      success: false,
      allowed: false,
      error: 'Network error',
      message: 'Failed to connect to validation service'
    };
  }
}

/**
 * Checks if a name change is allowed and shows appropriate error messages
 * @param firstName - New first name
 * @param lastName - New last name
 * @param onError - Callback function to handle errors
 * @returns Promise<boolean> - true if allowed, false if not allowed
 */
export async function checkNameChangeAllowed(
  firstName: string,
  lastName: string,
  onError?: (message: string) => void
): Promise<boolean> {
  const result = await validateNameChange(firstName, lastName);
  
  if (!result.success) {
    const message = result.message || 'Failed to validate name change';
    onError?.(message);
    return false;
  }
  
  if (!result.allowed) {
    const message = result.message || 'Name change not allowed';
    onError?.(message);
    return false;
  }
  
  return true;
}
