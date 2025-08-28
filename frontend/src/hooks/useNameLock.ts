import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NameLockStatus {
  isNameLocked: boolean;
  firstName: string | null;
  lastName: string | null;
  loading: boolean;
  error: string | null;
}

export function useNameLock(userId: string | undefined): NameLockStatus {
  const [status, setStatus] = useState<NameLockStatus>({
    isNameLocked: false,
    firstName: null,
    lastName: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const checkNameStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        // Name is considered locked if either first_name or last_name exists and is not empty
        const isNameLocked = !!(data?.first_name?.trim() || data?.last_name?.trim());
        
        setStatus({
          isNameLocked,
          firstName: data?.first_name || null,
          lastName: data?.last_name || null,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error checking name lock status:', error);
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to check name status',
        }));
      }
    };

    checkNameStatus();
  }, [userId]);

  return status;
}
