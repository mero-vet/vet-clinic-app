import { useRef, useEffect } from 'react';

const useRenderTracker = (componentName, props = {}) => {
  const renderInfo = useRef({
    count: 0,
    previousProps: {},
    changedProps: [],
  });

  useEffect(() => {
    renderInfo.current.count += 1;
    
    if (import.meta.env.DEV) {
      const changedProps = [];
      
      Object.keys(props).forEach(key => {
        if (props[key] !== renderInfo.current.previousProps[key]) {
          changedProps.push({
            key,
            previous: renderInfo.current.previousProps[key],
            current: props[key],
          });
        }
      });
      
      if (renderInfo.current.count > 1) {
        console.log(
          `[RenderTracker] ${componentName} rendered ${renderInfo.current.count} times`,
          changedProps.length > 0 ? 'Changed props:' : 'No prop changes',
          changedProps
        );
      }
      
      renderInfo.current.previousProps = { ...props };
      renderInfo.current.changedProps = changedProps;
    }
  });

  return {
    renderCount: renderInfo.current.count,
    changedProps: renderInfo.current.changedProps,
  };
};

export default useRenderTracker;