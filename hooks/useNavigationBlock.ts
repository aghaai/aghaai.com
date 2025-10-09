"use client";

import { useEffect, useCallback, useRef } from 'react';

interface UseNavigationBlockOptions {
  shouldBlock: boolean;
  onNavigationAttempt: () => void;
}

export function useNavigationBlock({ shouldBlock, onNavigationAttempt }: UseNavigationBlockOptions) {
  const isBlockingRef = useRef(false);

  useEffect(() => {
    isBlockingRef.current = shouldBlock;
  }, [shouldBlock]);

  // Block browser back/forward button and page reload
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = 'You have an active essay test. Are you sure you want to leave?';
      return e.returnValue;
    };

    const handlePopState = () => {
      if (isBlockingRef.current) {
        // Push state again to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
        onNavigationAttempt();
      }
    };

    // Push initial state
    window.history.pushState(null, '', window.location.pathname);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldBlock, onNavigationAttempt]);

  // Intercept link clicks
  const handleLinkClick = useCallback((e: MouseEvent) => {
    if (!isBlockingRef.current) return;

    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href) {
      const linkUrl = new URL(link.href);
      const currentUrl = new URL(window.location.href);
      
      // Check if it's an internal navigation
      if (linkUrl.origin === currentUrl.origin && linkUrl.pathname !== currentUrl.pathname) {
        e.preventDefault();
        e.stopPropagation();
        onNavigationAttempt();
      }
    }
  }, [onNavigationAttempt]);

  useEffect(() => {
    if (shouldBlock) {
      document.addEventListener('click', handleLinkClick, true);
      return () => {
        document.removeEventListener('click', handleLinkClick, true);
      };
    }
  }, [shouldBlock, handleLinkClick]);
}
