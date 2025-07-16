import { useEffect, useRef, useCallback } from 'react';

const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const renderStartTime = useRef(null);
  const metrics = useRef({
    renderTimes: [],
    mountTime: null,
    updateTimes: [],
  });

  useEffect(() => {
    renderCount.current += 1;
    const renderEndTime = performance.now();
    
    if (renderStartTime.current) {
      const renderDuration = renderEndTime - renderStartTime.current;
      
      if (renderCount.current === 1) {
        metrics.current.mountTime = renderDuration;
        if (import.meta.env.DEV) {
          console.log(`[Performance] ${componentName} mounted in ${renderDuration.toFixed(2)}ms`);
        }
      } else {
        metrics.current.updateTimes.push(renderDuration);
        if (import.meta.env.DEV && renderDuration > 16) {
          console.warn(`[Performance] ${componentName} slow render: ${renderDuration.toFixed(2)}ms`);
        }
      }
      
      metrics.current.renderTimes.push(renderDuration);
    }
    
    renderStartTime.current = performance.now();
  });

  const measureInteraction = useCallback((interactionName, fn) => {
    return async (...args) => {
      const startTime = performance.now();
      
      try {
        const result = await fn(...args);
        const duration = performance.now() - startTime;
        
        if (import.meta.env.DEV) {
          console.log(`[Performance] ${componentName}.${interactionName} took ${duration.toFixed(2)}ms`);
        }
        
        if (duration > 100) {
          console.warn(`[Performance] Slow interaction: ${componentName}.${interactionName} took ${duration.toFixed(2)}ms`);
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        console.error(`[Performance] ${componentName}.${interactionName} failed after ${duration.toFixed(2)}ms`, error);
        throw error;
      }
    };
  }, [componentName]);

  const getMetrics = useCallback(() => {
    const avgRenderTime = metrics.current.renderTimes.length > 0
      ? metrics.current.renderTimes.reduce((a, b) => a + b, 0) / metrics.current.renderTimes.length
      : 0;
    
    const avgUpdateTime = metrics.current.updateTimes.length > 0
      ? metrics.current.updateTimes.reduce((a, b) => a + b, 0) / metrics.current.updateTimes.length
      : 0;

    return {
      componentName,
      renderCount: renderCount.current,
      mountTime: metrics.current.mountTime,
      avgRenderTime,
      avgUpdateTime,
      renderTimes: metrics.current.renderTimes,
      updateTimes: metrics.current.updateTimes,
    };
  }, [componentName]);

  useEffect(() => {
    return () => {
      if (import.meta.env.DEV) {
        const finalMetrics = getMetrics();
        console.log(`[Performance] ${componentName} unmounted. Final metrics:`, finalMetrics);
      }
    };
  }, [componentName, getMetrics]);

  return {
    measureInteraction,
    getMetrics,
    renderCount: renderCount.current,
  };
};

export default usePerformanceMonitor;