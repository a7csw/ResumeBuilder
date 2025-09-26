import { useEffect, useRef } from 'react';

// Global counter to track how many components want to prevent scroll
let preventScrollCount = 0;
let originalStyles: {
  position: string;
  top: string;
  width: string;
  overflow: string;
} | null = null;
let scrollPosition = 0;

/**
 * Enhanced scroll manager that handles multiple components wanting to prevent scroll
 */
export const useScrollManager = (shouldPrevent: boolean) => {
  const wasPreventingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (shouldPrevent && !wasPreventingRef.current) {
      // Increment counter
      preventScrollCount++;
      wasPreventingRef.current = true;

      // Only apply styles on first prevention
      if (preventScrollCount === 1) {
        scrollPosition = window.scrollY;
        originalStyles = {
          position: document.body.style.position,
          top: document.body.style.top,
          width: document.body.style.width,
          overflow: document.body.style.overflow,
        };

        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      }
    } else if (!shouldPrevent && wasPreventingRef.current) {
      // Decrement counter
      preventScrollCount = Math.max(0, preventScrollCount - 1);
      wasPreventingRef.current = false;

      // Only restore styles when no components want to prevent scroll
      if (preventScrollCount === 0 && originalStyles) {
        document.body.style.position = originalStyles.position;
        document.body.style.top = originalStyles.top;
        document.body.style.width = originalStyles.width;
        document.body.style.overflow = originalStyles.overflow;

        window.scrollTo(0, scrollPosition);
        originalStyles = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (wasPreventingRef.current && typeof window !== 'undefined') {
        preventScrollCount = Math.max(0, preventScrollCount - 1);
        wasPreventingRef.current = false;

        // Force cleanup if this was the last component
        if (preventScrollCount === 0 && originalStyles) {
          document.body.style.position = originalStyles.position || '';
          document.body.style.top = originalStyles.top || '';
          document.body.style.width = originalStyles.width || '';
          document.body.style.overflow = originalStyles.overflow || '';

          window.scrollTo(0, scrollPosition);
          originalStyles = null;
        }
      }
    };
  }, [shouldPrevent]);

  // Emergency cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        // Reset everything if this component is unmounting
        if (wasPreventingRef.current) {
          preventScrollCount = Math.max(0, preventScrollCount - 1);
          if (preventScrollCount === 0) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            originalStyles = null;
          }
        }
      }
    };
  }, []);
};
