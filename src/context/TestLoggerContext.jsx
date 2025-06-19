import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import { testDefinitions } from '../tests/testDefinitions';
import throttle from 'lodash.throttle';

// Context
const TestLoggerContext = createContext();

export const useTestLogger = () => useContext(TestLoggerContext);

// Helper to derive a concise selector for the target element
function getElementSelector(element) {
  if (!element) return '';
  const parts = [];
  let el = element;
  // Limit to 3 levels up to keep selector readable
  while (el && parts.length < 3 && el.nodeType === Node.ELEMENT_NODE) {
    let part = el.tagName.toLowerCase();
    if (el.id) {
      part += `#${el.id}`;
      parts.unshift(part);
      break; // id is unique enough
    }
    if (el.className && typeof el.className === 'string') {
      const firstClass = el.className.split(' ')[0];
      if (firstClass) part += `.${firstClass}`;
    }
    parts.unshift(part);
    el = el.parentElement;
  }
  return parts.join(' > ');
}

export const TestLoggerProvider = ({ children }) => {
  const [activeTest, setActiveTest] = useState(null); // contains definition
  const [logs, setLogs] = useState([]);
  const startTimeRef = useRef(null);

  const logEvent = useCallback((type, details) => {
    if (!startTimeRef.current) return;
    setLogs(prev => [
      ...prev,
      {
        timestamp: Date.now() - startTimeRef.current, // relative ms
        type,
        testId: activeTest?.id ?? null,
        ...details,
      },
    ]);
  }, [activeTest]);

  const clickListener = useCallback(
    e => {
      logEvent('click', {
        selector: getElementSelector(e.target),
      });
    },
    [logEvent],
  );

  const keyListener = useCallback(
    e => {
      logEvent('keydown', {
        key: e.key,
        selector: getElementSelector(e.target),
      });
    },
    [logEvent],
  );

  const mousemoveListener = useCallback(
    throttle(e => {
      logEvent('mousemove', { x: e.clientX, y: e.clientY });
    }, 100),
    [logEvent],
  );

  const scrollListener = useCallback(
    throttle(() => {
      logEvent('scroll', { scrollX: window.scrollX, scrollY: window.scrollY });
    }, 200),
    [logEvent],
  );

  const startTest = useCallback(
    testId => {
      if (activeTest) return; // prevent nested tests
      const definition =
        typeof testId === 'object' ? testId : testDefinitions.find(t => t.id === testId);
      if (!definition) return;
      setActiveTest(definition);
      setLogs([]);
      startTimeRef.current = Date.now();
      document.addEventListener('click', clickListener, true);
      document.addEventListener('keydown', keyListener, true);
      document.addEventListener('mousemove', mousemoveListener, true);
      window.addEventListener('scroll', scrollListener, true);
    },
    [activeTest, clickListener, keyListener, mousemoveListener, scrollListener],
  );

  const stopListeners = () => {
    document.removeEventListener('click', clickListener, true);
    document.removeEventListener('keydown', keyListener, true);
    document.removeEventListener('mousemove', mousemoveListener, true);
    window.removeEventListener('scroll', scrollListener, true);
  };

  const evaluateSuccessCriteria = useCallback(() => {
    if (!activeTest || !Array.isArray(activeTest.successCriteria)) {
      return { result: 'unknown', criteriaMet: 0, criteriaFailed: 0 };
    }

    let criteriaMet = 0;
    let criteriaFailed = 0;

    activeTest.successCriteria.forEach(c => {
      switch (c.type) {
        case 'selector': {
          const exists = !!document.querySelector(c.selector);
          const mustExist = c.mustExist !== false; // default true
          const passed = mustExist ? exists : !exists;
          if (passed) criteriaMet += 1;
          else criteriaFailed += 1;
          break;
        }
        case 'url-contains': {
          const passed = window.location.pathname.includes(c.value);
          if (passed) criteriaMet += 1;
          else criteriaFailed += 1;
          break;
        }
        default:
          criteriaFailed += 1; // unknown criterion counts as failed
      }
    });

    let result = 'unknown';
    if (criteriaFailed === 0 && criteriaMet > 0) result = 'success';
    else if (criteriaMet > 0 && criteriaFailed > 0) result = 'partial';
    else if (criteriaMet === 0 && criteriaFailed > 0) result = 'failure';

    return { result, criteriaMet, criteriaFailed };
  }, [activeTest]);

  const endTest = useCallback(() => {
    if (!activeTest) return null;
    stopListeners();

    const evaluation = evaluateSuccessCriteria();

    const logPayload = {
      test: activeTest,
      startedAt: new Date(startTimeRef.current).toISOString(),
      evaluation,
      logs,
    };
    const blob = new Blob([JSON.stringify(logPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const filename = `${activeTest.id}-${Date.now()}.json`;

    // Reset state
    setActiveTest(null);
    setLogs([]);
    startTimeRef.current = null;

    return { url, filename, evaluation };
  }, [activeTest, logs, evaluateSuccessCriteria]);

  const value = {
    activeTest,
    logs,
    startTest,
    endTest,
  };

  return (
    <TestLoggerContext.Provider value={value}>{children}</TestLoggerContext.Provider>
  );
};