import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import { testDefinitions } from '../tests/testDefinitions';
import throttle from 'lodash.throttle';
import html2canvas from 'html2canvas';
import testStorageService from '../services/TestStorageService';

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
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const startTimeRef = useRef(null);
  const screenshotCounter = useRef(0);

  const captureScreenshot = useCallback(async () => {
    if (!startTimeRef.current) return null;
    try {
      const canvas = await html2canvas(document.body, { useCORS: true, logging: false, scale: 0.5 });
      return canvas.toDataURL('image/jpeg', 0.6);
    } catch (err) {
      console.warn('screenshot failed', err);
      return null;
    }
  }, []);

  const logEvent = useCallback(async (type, details) => {
    if (!startTimeRef.current) return;
    const timestamp = Date.now() - startTimeRef.current;
    const baseRecord = {
      timestamp,
      type,
      testId: activeTest?.id ?? null,
      ...details,
    };

    let record = baseRecord;

    if (type === 'click' || type === 'keydown') {
      const shot = await captureScreenshot();
      if (shot) {
        record = { ...baseRecord, screenshot: shot };
        
        // Save screenshot to storage
        if (currentSessionId) {
          try {
            const blob = await fetch(shot).then(r => r.blob());
            await testStorageService.saveScreenshot(blob, timestamp);
          } catch (err) {
            console.error('Failed to save screenshot:', err);
          }
        }
      }
    }

    setLogs(prev => [...prev, record]);
    
    // Save event to storage
    if (currentSessionId) {
      try {
        await testStorageService.saveEvent(record);
      } catch (err) {
        console.error('Failed to save event:', err);
      }
    }
  }, [activeTest, captureScreenshot, currentSessionId]);

  const clickListener = useCallback(
    e => {
      logEvent('click', {
        selector: getElementSelector(e.target),
        x: e.clientX,
        y: e.clientY,
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
    async testId => {
      if (activeTest) return; // prevent nested tests
      const definition =
        typeof testId === 'object' ? testId : testDefinitions.find(t => t.id === testId);
      if (!definition) return;
      
      // Initialize storage session
      try {
        const sessionMeta = {
          scenarioId: definition.id,
          scenarioName: definition.name,
          pimsType: definition.pimsType || 'unknown',
          userAgent: navigator.userAgent,
        };
        const sessionId = await testStorageService.initSession(sessionMeta);
        setCurrentSessionId(sessionId);
        screenshotCounter.current = 0;
      } catch (err) {
        console.error('Failed to initialize storage session:', err);
      }
      
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

  const endTest = useCallback(async () => {
    if (!activeTest) return null;
    stopListeners();

    const evaluation = evaluateSuccessCriteria();

    // Finalize storage session
    let finalSessionId = currentSessionId;
    if (currentSessionId) {
      try {
        await testStorageService.finaliseSession(evaluation);
      } catch (err) {
        console.error('Failed to finalize storage session:', err);
      }
    }

    const logPayload = {
      test: activeTest,
      startedAt: new Date(startTimeRef.current).toISOString(),
      evaluation,
      logs,
      sessionId: currentSessionId,
    };
    const blob = new Blob([JSON.stringify(logPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const filename = `${activeTest.id}-${Date.now()}.json`;

    // Reset state
    setActiveTest(null);
    setLogs([]);
    setCurrentSessionId(null);
    startTimeRef.current = null;

    return { url, filename, evaluation, payload: JSON.stringify(logPayload), sessionId: finalSessionId };
  }, [activeTest, logs, evaluateSuccessCriteria, currentSessionId]);

  const value = {
    activeTest,
    logs,
    startTest,
    endTest,
    currentSessionId,
    testStorageService,
  };

  return (
    <TestLoggerContext.Provider value={value}>{children}</TestLoggerContext.Provider>
  );
};