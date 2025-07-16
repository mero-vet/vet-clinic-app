import { useState, useCallback, useRef } from 'react';

const useDataFetchMonitor = (fetchName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchMetrics = useRef({
    attempts: 0,
    successes: 0,
    failures: 0,
    totalDuration: 0,
    durations: [],
  });

  const monitoredFetch = useCallback(async (fetchFn, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      timeout = 30000,
      retries = 0,
      retryDelay = 1000,
    } = options;

    setLoading(true);
    setError(null);
    
    const startTime = performance.now();
    fetchMetrics.current.attempts += 1;
    
    const attemptFetch = async (attemptNumber = 0) => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });
        
        const result = await Promise.race([
          fetchFn(),
          timeoutPromise,
        ]);
        
        const duration = performance.now() - startTime;
        fetchMetrics.current.successes += 1;
        fetchMetrics.current.totalDuration += duration;
        fetchMetrics.current.durations.push(duration);
        
        if (import.meta.env.DEV) {
          console.log(`[DataFetch] ${fetchName} completed in ${duration.toFixed(2)}ms`);
        }
        
        if (duration > 3000) {
          console.warn(`[DataFetch] Slow request: ${fetchName} took ${duration.toFixed(2)}ms`);
        }
        
        onSuccess?.(result);
        setLoading(false);
        return result;
        
      } catch (err) {
        const duration = performance.now() - startTime;
        
        if (attemptNumber < retries) {
          if (import.meta.env.DEV) {
            console.log(`[DataFetch] ${fetchName} failed, retrying (${attemptNumber + 1}/${retries})...`);
          }
          
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attemptNumber + 1)));
          return attemptFetch(attemptNumber + 1);
        }
        
        fetchMetrics.current.failures += 1;
        fetchMetrics.current.totalDuration += duration;
        fetchMetrics.current.durations.push(duration);
        
        console.error(`[DataFetch] ${fetchName} failed after ${duration.toFixed(2)}ms`, err);
        
        onError?.(err);
        setError(err);
        setLoading(false);
        throw err;
      }
    };
    
    return attemptFetch();
  }, [fetchName]);

  const getMetrics = useCallback(() => {
    const avgDuration = fetchMetrics.current.durations.length > 0
      ? fetchMetrics.current.totalDuration / fetchMetrics.current.durations.length
      : 0;
    
    const successRate = fetchMetrics.current.attempts > 0
      ? (fetchMetrics.current.successes / fetchMetrics.current.attempts) * 100
      : 0;

    return {
      fetchName,
      attempts: fetchMetrics.current.attempts,
      successes: fetchMetrics.current.successes,
      failures: fetchMetrics.current.failures,
      avgDuration,
      successRate,
      durations: fetchMetrics.current.durations,
    };
  }, [fetchName]);

  const reset = useCallback(() => {
    fetchMetrics.current = {
      attempts: 0,
      successes: 0,
      failures: 0,
      totalDuration: 0,
      durations: [],
    };
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    monitoredFetch,
    getMetrics,
    reset,
  };
};

export default useDataFetchMonitor;