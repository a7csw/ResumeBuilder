import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to prevent navigation during critical operations
 */
export const useNavigationGuard = (isBlocked: boolean, message?: string) => {
  useEffect(() => {
    if (!isBlocked) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message || 'You have unsaved changes. Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlocked, message]);
};

/**
 * Hook for safe navigation with loading states
 */
export const useSafeNavigation = () => {
  const navigate = useNavigate();

  const safeNavigate = (path: string, options?: any) => {
    try {
      navigate(path, options);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to home page
      window.location.href = '/';
    }
  };

  return { safeNavigate };
};
