import React, { useState } from 'react';
import { useTestLogger } from '../context/TestLoggerContext';
import { testDefinitions } from '../tests/testDefinitions';

const panelStyle = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 10000,
  background: 'white',
  border: '1px solid #999',
  borderRadius: 4,
  padding: 12,
  width: 260,
  fontFamily: 'sans-serif',
  fontSize: 14,
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
};

const TestManager = () => {
  const { activeTest, startTest, endTest, logs } = useTestLogger();
  const [selectedId, setSelectedId] = useState(testDefinitions[0]?.id || '');

  const handleStart = () => {
    startTest(selectedId);
  };

  const handleEnd = () => {
    const result = endTest();
    if (result) {
      const { url, filename, evaluation } = result;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke later
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      if (evaluation.result !== 'unknown') {
        alert(
          `Test Result: ${evaluation.result}\n` +
            `Criteria Met: ${evaluation.criteriaMet}\n` +
            `Criteria Failed: ${evaluation.criteriaFailed}`,
        );
      }
    }
  };

  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Test Manager</div>
      <label style={{ display: 'block', marginBottom: 4 }}>
        Scenario:
        <select
          style={{ width: '100%', marginTop: 4 }}
          disabled={!!activeTest}
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          {testDefinitions.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      {!activeTest ? (
        <button style={{ marginTop: 8, width: '100%' }} onClick={handleStart}>
          Start Test
        </button>
      ) : (
        <>
          <div style={{ marginTop: 8 }}>Logs captured: {logs.length}</div>
          <button style={{ marginTop: 4, width: '100%' }} onClick={handleEnd}>
            End Test & Download Logs
          </button>
        </>
      )}
    </div>
  );
};

export default TestManager;