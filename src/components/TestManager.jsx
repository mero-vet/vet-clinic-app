import React, { useState, useEffect } from 'react';
import { useTestLogger } from '../context/TestLoggerContext';
import { testDefinitions } from '../tests/testDefinitions';
import { useNavigate } from 'react-router-dom';
import LogExplorer from './TestManager/LogExplorer';
import ScenarioSelector from './TestManager/ScenarioSelector';
import ScenarioManager from './TestManager/ScenarioManager';
import ScenarioService from '../services/ScenarioService';
import testStorageService from '../services/TestStorageService';
import { runScenarioMigration } from '../utils/migrateScenarios';

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
  const [selectedId, setSelectedId] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const navigate = useNavigate();
  const [lastEnded, setLastEnded] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showLogExplorer, setShowLogExplorer] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showScenarioManager, setShowScenarioManager] = useState(false);

  // Load scenario when selectedId changes
  useEffect(() => {
    if (selectedId) {
      ScenarioService.getScenario(selectedId).then(scenario => {
        setSelectedScenario(scenario);
      }).catch(err => {
        console.error('Failed to load scenario:', err);
        setSelectedScenario(null);
      });
    }
  }, [selectedId]);

  // Run migration on mount
  useEffect(() => {
    runScenarioMigration();
  }, []);

  const handleStart = () => {
    if (selectedScenario) {
      startTest(selectedScenario);
    }
  };

  const handleCopyPrompt = () => {
    if (selectedScenario?.agentPrompt) {
      navigator.clipboard.writeText(selectedScenario.agentPrompt).then(() => {
        setCopied(true);
      });
    }
  };

  const handleEnd = async () => {
    const result = await endTest();
    if (result) {
      const { url, filename, evaluation, payload, sessionId } = result;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      sessionStorage.setItem('latestReplay', payload);
      sessionStorage.setItem('lastTestData', payload);
      setLastEnded({ evaluation, sessionId });
      
      // Show toast with storage location
      if (sessionId) {
        setToastMessage(`Test logs saved to session: ${sessionId}`);
        loadSessions(); // Refresh sessions list
      }
      
      if (evaluation.result !== 'unknown') {
        alert(`Test Result: ${evaluation.result}\nCriteria Met: ${evaluation.criteriaMet}\nCriteria Failed: ${evaluation.criteriaFailed}`);
      }
    }
  };

  const openReplay = () => {
    navigate('/replay');
  };

  const loadSessions = async () => {
    try {
      const sessionList = await testStorageService.listSessions(20);
      setSessions(sessionList);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const handleViewLogExplorer = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowLogExplorer(true);
  };

  const handleDownloadZip = async (sessionId) => {
    try {
      const blob = await testStorageService.exportZip(sessionId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sessionId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error('Failed to export session:', err);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const containerStyle = embedded ? { padding: 0, width: '100%' } : floatingPanelStyle;

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  return (
    <div style={containerStyle}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Test Manager</div>
      
      {/* Toast Message */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#4CAF50',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 4,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          zIndex: 10001
        }}>
          {toastMessage}
        </div>
      )}
      
      {!showLogs ? (
        <>
          <ol style={{ fontSize: 12, marginBottom: 8, color: '#555', lineHeight: '1.3', paddingLeft: 16 }}>
            <li>Select a scenario from the drop-down.</li>
            <li>Click <strong>Copy Agent Prompt</strong> and paste it into your agent UI.</li>
            <li>Click <strong>Start Test</strong> then let the agent perform the workflow.</li>
            <li>When the agent is finished, click <strong>End Test & Download Logs</strong> to save the log file.</li>
            <li>(Optional) Click <strong>View Replay</strong> to watch a step-by-step playback.</li>
          </ol>
          <ScenarioSelector
            value={selectedId}
            onChange={setSelectedId}
            disabled={!!activeTest}
            onAddScenario={() => setShowScenarioManager(true)}
          />
          {!activeTest ? (
            <>
              <button style={{ marginTop: 8, width: '100%' }} onClick={handleCopyPrompt} disabled={copied}>
                {copied ? 'Copy Successful' : 'Copy Agent Prompt'}
              </button>
              <button style={{ marginTop: 4, width: '100%' }} onClick={handleStart}>
                Start Test
              </button>
              <button style={{ marginTop: 4, width: '100%' }} onClick={() => setShowLogs(true)}>
                View Logs
              </button>
              <button style={{ marginTop: 4, width: '100%' }} onClick={() => setShowScenarioManager(true)}>
                Manage Scenarios
              </button>
              {lastEnded && lastEnded.sessionId && (
                <button style={{ marginTop: 4, width: '100%' }} onClick={() => handleViewLogExplorer(lastEnded.sessionId)}>
                  View Log Explorer
                </button>
              )}
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
        </>
      ) : (
        <>
          <button style={{ marginBottom: 8, width: '100%' }} onClick={() => setShowLogs(false)}>
            ← Back to Test Manager
          </button>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Test Sessions</div>
          <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 4 }}>
            {sessions.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#666' }}>No test sessions found</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.sessionId}
                  style={{
                    padding: 8,
                    borderBottom: '1px solid #eee',
                    fontSize: 12
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{session.scenarioName || 'Unknown Scenario'}</div>
                  <div style={{ color: '#666' }}>
                    {formatDate(session.startTime)}
                    {session.duration && ` • ${formatDuration(session.duration)}`}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <button
                      style={{ marginRight: 4, fontSize: 11, padding: '2px 6px' }}
                      onClick={() => handleViewLogExplorer(session.sessionId)}
                    >
                      View
                    </button>
                    <button
                      style={{ fontSize: 11, padding: '2px 6px' }}
                      onClick={() => handleDownloadZip(session.sessionId)}
                    >
                      Export
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      
      <LogExplorer 
        isOpen={showLogExplorer} 
        onClose={() => setShowLogExplorer(false)}
        sessionId={selectedSessionId}
      />
      
      {/* Scenario Manager Modal */}
      {showScenarioManager && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10002
        }}>
          <div style={{
            background: 'white',
            borderRadius: 8,
            maxWidth: 900,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <ScenarioManager
              onClose={() => {
                setShowScenarioManager(false);
                // Reload scenarios in selector
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManager;