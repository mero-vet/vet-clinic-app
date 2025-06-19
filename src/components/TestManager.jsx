import React, { useState } from 'react';
import { useTestLogger } from '../context/TestLoggerContext';
import { testDefinitions } from '../tests/testDefinitions';
import { useNavigate } from 'react-router-dom';

const floatingPanelStyle = {
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
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
};

const TestManager = ({ embedded = false }) => {
  const { activeTest, startTest, endTest, logs } = useTestLogger();
  const [selectedId, setSelectedId] = useState(testDefinitions[0]?.id || '');
  const navigate = useNavigate();
  const [lastEnded, setLastEnded] = useState(null);

  const handleStart = () => {
    startTest(selectedId);
  };

  const handleCopyPrompt = () => {
    const def = testDefinitions.find(t => t.id === selectedId);
    if (def?.agentPrompt) {
      navigator.clipboard.writeText(def.agentPrompt).then(() => {
        alert('Agent prompt copied to clipboard');
      });
    }
  };

  const handleEnd = async () => {
    const result = endTest();
    if (result) {
      const { url, filename, evaluation, payload } = result;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      sessionStorage.setItem('latestReplay', payload);
      setLastEnded({ evaluation });
      if (evaluation.result !== 'unknown') {
        alert(`Test Result: ${evaluation.result}\nCriteria Met: ${evaluation.criteriaMet}\nCriteria Failed: ${evaluation.criteriaFailed}`);
      }
    }
  };

  const openReplay = () => {
    navigate('/replay');
  };

  const containerStyle = embedded ? { padding: 0, width: '100%' } : floatingPanelStyle;

  return (
    <div style={containerStyle}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Test Manager</div>
      <div style={{ fontSize: 12, marginBottom: 8, color: '#555' }}>
        1. Select scenario ➜ 2. Start Test ➜ 3. Run agent ➜ 4. End Test & Download ➜ 5. View Replay
      </div>
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
        <>
          <button style={{ marginTop: 8, width: '100%' }} onClick={handleCopyPrompt}>
            Copy Agent Prompt
          </button>
          <button style={{ marginTop: 4, width: '100%' }} onClick={handleStart}>
            Start Test
          </button>
        </>
      ) : (
        <>
          <div style={{ marginTop: 8 }}>Logs captured: {logs.length}</div>
          <button style={{ marginTop: 4, width: '100%' }} onClick={handleEnd}>
            End Test & Download Logs
          </button>
          {lastEnded && (
            <button style={{ marginTop: 4, width: '100%' }} onClick={openReplay}>
              View Replay
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TestManager;