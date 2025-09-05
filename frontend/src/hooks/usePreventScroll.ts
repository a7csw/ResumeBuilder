import { useEffect, useRef } from 'react';

/**
 * Hook to prevent background scrolling when a modal/dialog is open
 * Uses a ref to ensure cleanup happens with the correct scroll position
 * Only runs on the client side to avoid SSR issues
 */
export const usePreventScroll = (isOpen: boolean) => {
  const scrollPositionRef = useRef<number>(0);
  const originalStylesRef = useRef<{
    position: string;
    top: string;
    width: string;
    overflow: string;
  } | null>(null);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    if (isOpen) {
      // Store the current scroll position
      scrollPositionRef.current = window.scrollY;
      
      // Store original body styles
      originalStylesRef.current = {
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
      };
      
      // Prevent scrolling by setting overflow hidden
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isOpen && originalStylesRef.current && typeof window !== 'undefined') {
        // Restore original styles
        document.body.style.position = originalStylesRef.current.position;
        document.body.style.top = originalStylesRef.current.top;
        document.body.style.width = originalStylesRef.current.width;
        document.body.style.overflow = originalStylesRef.current.overflow;
        
        // Restore scroll position
        window.scrollTo(0, scrollPositionRef.current);
        
        // Clear refs
        originalStylesRef.current = null;
      }
    };
  }, [isOpen]);
};
