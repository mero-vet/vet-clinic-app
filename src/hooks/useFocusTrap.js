import { useEffect } from 'react';

/**
 * useFocusTrap hook for trapping focus within modal dialogs
 * Ensures keyboard navigation stays within the modal for accessibility
 * @param {boolean} isActive - Whether the focus trap is active
 * @param {React.RefObject} containerRef - Reference to the container element
 */
export const useFocusTrap = (isActive, containerRef) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    // Get all focusable elements
    const getFocusableElements = () => {
      return Array.from(container.querySelectorAll(focusableSelectors));
    };
    
    let focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Store the previously focused element
    const previouslyFocused = document.activeElement;
    
    // Set initial focus
    if (firstElement) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        firstElement.focus();
      }, 50);
    }
    
    const handleTab = (event) => {
      // Update focusable elements list in case DOM changed
      focusableElements = getFocusableElements();
      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];
      
      if (event.key !== 'Tab') return;
      
      // Handle Shift+Tab
      if (event.shiftKey) {
        if (document.activeElement === firstEl) {
          event.preventDefault();
          lastEl?.focus();
        }
      } else {
        // Handle Tab
        if (document.activeElement === lastEl) {
          event.preventDefault();
          firstEl?.focus();
        }
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        // You can add a callback prop to handle escape key
        // For now, we'll just blur the current element
        document.activeElement?.blur();
      }
    };
    
    // Add event listeners
    container.addEventListener('keydown', handleTab);
    container.addEventListener('keydown', handleEscape);
    
    // Cleanup function
    return () => {
      container.removeEventListener('keydown', handleTab);
      container.removeEventListener('keydown', handleEscape);
      
      // Restore focus to previously focused element
      if (previouslyFocused && previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isActive, containerRef]);
};

export default useFocusTrap;