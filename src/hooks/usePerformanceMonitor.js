import { useEffect, useRef, useCallback } from 'react';
import { perfLog, warnLog, errorLog } from '../utils/logger';

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
        perfLog(`${componentName} mounted`, renderDuration);
      } else {
        metrics.current.updateTimes.push(renderDuration);
        if (renderDuration > 16) {
          warnLog(`${componentName} slow render: ${renderDuration.toFixed(2)}ms`);
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

        perfLog(`${componentName}.${interactionName}`, duration);

        if (duration > 100) {
          warnLog(`Slow interaction: ${componentName}.${interactionName} took ${duration.toFixed(2)}ms`);
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        errorLog(`${componentName}.${interactionName} failed after ${duration.toFixed(2)}ms`, error);
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
      const finalMetrics = getMetrics();
      perfLog(`${componentName} unmounted`, 0, finalMetrics);
    };
  }, [componentName, getMetrics]);

  return {
    measureInteraction,
    getMetrics,
    renderCount: renderCount.current,
  };
};

export default usePerformanceMonitor;