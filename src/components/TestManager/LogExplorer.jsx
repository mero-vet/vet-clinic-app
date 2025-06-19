import React, { useState, useEffect, useRef } from 'react';
import ScreenshotTimeline from './ScreenshotTimeline';
import LogViewer from './LogViewer';
import testStorageService from '../../services/TestStorageService';
import '../../styles/LogExplorer.css';

const LogExplorer = ({ isOpen, onClose, sessionId }) => {
  const [sessionData, setSessionData] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [currentScreenshot, setCurrentScreenshot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load session from storage if sessionId is provided
    if (sessionId && isOpen) {
      loadSessionFromStorage(sessionId);
    } else if (!sessionId && isOpen) {
      // Try to load last session from sessionStorage
      const lastTestData = sessionStorage.getItem('lastTestData');
      if (lastTestData) {
        try {
          const data = JSON.parse(lastTestData);
          processSessionData(data);
        } catch (error) {
          console.error('Failed to load last session:', error);
        }
      }
    }
  }, [sessionId, isOpen]);

  const loadSessionFromStorage = async (sessionId) => {
    setIsLoading(true);
    try {
      const session = await testStorageService.getSession(sessionId);
      
      // Convert storage format to LogExplorer format
      const screenshots = session.screenshots || [];
      const events = session.events || [];
      
      setSessionData({
        sessionId: session.meta?.sessionId || sessionId,
        startedAt: new Date(session.meta?.startTime).toISOString(),
        screenshots,
        events,
        test: {
          id: session.meta?.scenarioId,
          name: session.meta?.scenarioName
        },
        evaluation: session.meta?.evaluation
      });
      
      // Set initial timestamp
      if (screenshots.length > 0) {
        setCurrentTimestamp(screenshots[0].timestamp);
        setCurrentScreenshot(screenshots[0].dataUrl);
      }
    } catch (error) {
      console.error('Failed to load session from storage:', error);
      alert('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  const processSessionData = (data) => {
    // Extract screenshots from logs
    const screenshots = [];
    const events = [];
    
    if (data.logs) {
      data.logs.forEach((log) => {
        if (log.screenshot) {
          screenshots.push({
            timestamp: log.timestamp,
            dataUrl: log.screenshot
          });
        }
        events.push({
          timestamp: log.timestamp,
          type: log.type,
          x: log.x,
          y: log.y,
          selector: log.selector,
          key: log.key,
          ...log
        });
      });
    }

    // Sort screenshots by timestamp
    screenshots.sort((a, b) => a.timestamp - b.timestamp);

    setSessionData({
      sessionId: data.test?.id || data.sessionId || 'unknown',
      startedAt: data.startedAt,
      screenshots,
      events,
      test: data.test,
      evaluation: data.evaluation
    });

    // Set initial timestamp
    if (screenshots.length > 0) {
      setCurrentTimestamp(screenshots[0].timestamp);
      setCurrentScreenshot(screenshots[0].dataUrl);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          processSessionData(data);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(f => f.name.endsWith('.json'));

    if (jsonFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          processSessionData(data);
        } catch (error) {
          console.error('Failed to parse dropped JSON:', error);
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(jsonFile);
    }
  };

  const handleTimeSelect = (timestamp) => {
    setCurrentTimestamp(timestamp);
    
    // Find the screenshot for this timestamp
    if (sessionData?.screenshots) {
      const screenshot = sessionData.screenshots.find(s => s.timestamp === timestamp) ||
        sessionData.screenshots.reduce((prev, curr) => {
          return Math.abs(curr.timestamp - timestamp) < Math.abs(prev.timestamp - timestamp) ? curr : prev;
        });
      
      if (screenshot) {
        setCurrentScreenshot(screenshot.dataUrl || screenshot.data);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="log-explorer-overlay">
      <div className="log-explorer-container">
        <div className="log-explorer-header">
          <h2>Log Explorer</h2>
          <div className="header-controls">
            {sessionData && (
              <span className="session-info">
                Session: {sessionData.sessionId} | 
                Started: {new Date(sessionData.startedAt).toLocaleString()}
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current?.click()}>
              Upload Log File
            </button>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">Loading session...</div>
          </div>
        ) : !sessionData ? (
          <div 
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="drop-zone-content">
              <h3>No session loaded</h3>
              <p>Drag and drop a log JSON file here or click to upload</p>
              <button onClick={() => fileInputRef.current?.click()}>
                Choose File
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="log-explorer-content">
              <div className="screenshot-pane">
                {currentScreenshot ? (
                  <img 
                    src={currentScreenshot} 
                    alt="Screenshot"
                    className="current-screenshot"
                  />
                ) : (
                  <div className="no-screenshot">No screenshot available</div>
                )}
              </div>
              
              <div className="log-pane">
                <LogViewer 
                  events={sessionData.events}
                  currentTimestamp={currentTimestamp}
                  evaluation={sessionData.evaluation}
                />
              </div>
            </div>

            <div className="timeline-container">
              <ScreenshotTimeline
                screenshots={sessionData.screenshots}
                currentTimestamp={currentTimestamp}
                onTimeSelect={handleTimeSelect}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogExplorer;