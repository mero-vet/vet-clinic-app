import React, { useEffect, useRef, useState } from 'react';

const LogViewer = ({ events, currentTimestamp, evaluation }) => {
  const logContainerRef = useRef(null);
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Auto-scroll to current event
    if (logContainerRef.current && events.length > 0) {
      const currentEventIndex = events.findIndex(e => e.timestamp >= currentTimestamp);
      if (currentEventIndex >= 0) {
        const logEntry = logContainerRef.current.querySelector(`[data-index="${currentEventIndex}"]`);
        if (logEntry) {
          logEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentTimestamp, events]);

  const formatTimestamp = (timestamp) => {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = timestamp % 1000;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const syntaxHighlight = (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'click': return '🖱️';
      case 'keydown': return '⌨️';
      case 'mousemove': return '↔️';
      case 'scroll': return '📜';
      case 'navigation': return '🧭';
      default: return '📌';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'click': return '#4CAF50';
      case 'keydown': return '#2196F3';
      case 'mousemove': return '#FF9800';
      case 'scroll': return '#9C27B0';
      case 'navigation': return '#00BCD4';
      default: return '#757575';
    }
  };

  const toggleLogExpansion = (index) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLogs(newExpanded);
  };

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(e => e.type === filterType);

  const eventTypes = [...new Set(events.map(e => e.type))];

  return (
    <div className="log-viewer">
      <div className="log-viewer-header">
        <h3>Event Logs</h3>
        {evaluation && (
          <div className={`evaluation-badge ${evaluation.result}`}>
            {evaluation.result.toUpperCase()} 
            ({evaluation.criteriaMet}/{evaluation.criteriaMet + evaluation.criteriaFailed})
          </div>
        )}
      </div>

      <div className="log-filters">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Events ({events.length})</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>
              {type} ({events.filter(e => e.type === type).length})
            </option>
          ))}
        </select>
      </div>

      <div className="log-container" ref={logContainerRef}>
        {filteredEvents.map((event, index) => {
          const isExpanded = expandedLogs.has(index);
          const isCurrent = event.timestamp <= currentTimestamp && 
            (index === filteredEvents.length - 1 || filteredEvents[index + 1].timestamp > currentTimestamp);
          
          return (
            <div 
              key={`${event.timestamp}-${index}`}
              data-index={index}
              className={`log-entry ${isCurrent ? 'current' : ''}`}
              style={{ borderLeftColor: getEventColor(event.type) }}
            >
              <div 
                className="log-summary"
                onClick={() => toggleLogExpansion(index)}
              >
                <span className="log-icon">{getEventIcon(event.type)}</span>
                <span className="log-timestamp">{formatTimestamp(event.timestamp)}</span>
                <span className="log-type" style={{ color: getEventColor(event.type) }}>
                  {event.type}
                </span>
                {event.selector && <span className="log-selector">{event.selector}</span>}
                {event.key && <span className="log-key">Key: {event.key}</span>}
                {(event.x !== undefined && event.y !== undefined) && 
                  <span className="log-position">({event.x}, {event.y})</span>
                }
                <span className="log-expand">{isExpanded ? '▼' : '▶'}</span>
              </div>
              
              {isExpanded && (
                <div className="log-details">
                  <pre dangerouslySetInnerHTML={{ 
                    __html: syntaxHighlight(JSON.stringify(event, null, 2))
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="log-stats">
        Total Events: {events.length} | 
        Duration: {events.length > 0 ? formatTimestamp(events[events.length - 1].timestamp) : '0:00.000'}
      </div>
    </div>
  );
};

export default LogViewer;