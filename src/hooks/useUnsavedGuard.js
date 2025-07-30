import { useEffect } from 'react';

/**
 * useUnsavedGuard – prompts when dirty state is true.
 * Works in browser tab (beforeunload) and client-side nav (react-router blocker).
 */
export default function useUnsavedGuard(dirty) {
  // Browser refresh / close
  useEffect(() => {
    const handler = e => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // In-app navigation guard removed pending router support
} 