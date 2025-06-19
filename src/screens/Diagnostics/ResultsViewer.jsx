import React, { useState } from 'react';
import DiagnosticsService from '../../services/DiagnosticsService';
import './ResultsViewer.css';

const ResultsViewer = ({ orders, patientSpecies }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('summary'); // summary or detailed

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTestResult = (test, testDetails) => {
    if (!test.result) {
      return <div className="no-results">Results pending</div>;
    }

    const { values, interpretation, verifiedBy } = test.result;
    
    return (
      <div className="test-result">
        <div className="result-header">
          <h4>{test.name}</h4>
          <span className="result-time">{formatDate(test.resultTime)}</span>
        </div>

        {test.criticalValues && test.criticalValues.length > 0 && (
          <div className="critical-alert">
            <strong>⚠️ Critical Values Detected</strong>
            {test.criticalValues.map((critical, idx) => (
              <div key={idx} className="critical-value">
                {critical.component}: {critical.value} {critical.flag} 
                (Range: {critical.range})
              </div>
            ))}
          </div>
        )}

        {viewMode === 'summary' ? (
          <div className="result-summary">
            {Object.entries(values).map(([component, value]) => {
              const ranges = testDetails?.referenceRanges?.[patientSpecies]?.[component];
              const isAbnormal = ranges && (value < ranges.min || value > ranges.max);
              
              return (
                <div key={component} className={`result-row ${isAbnormal ? 'abnormal' : ''}`}>
                  <span className="component-name">{component}</span>
                  <span className="component-value">
                    {value} {ranges?.unit || ''}
                    {isAbnormal && (
                      <span className="flag">{value < ranges.min ? 'L' : 'H'}</span>
                    )}
                  </span>
                  {ranges && (
                    <span className="reference-range">
                      ({ranges.min}-{ranges.max})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="result-detailed">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Value</th>
                  <th>Reference Range</th>
                  <th>Flag</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(values).map(([component, value]) => {
                  const ranges = testDetails?.referenceRanges?.[patientSpecies]?.[component];
                  const isLow = ranges && value < ranges.min;
                  const isHigh = ranges && value > ranges.max;
                  
                  return (
                    <tr key={component} className={isLow || isHigh ? 'abnormal' : ''}>
                      <td>{component}</td>
                      <td>
                        {value} {ranges?.unit || ''}
                      </td>
                      <td>
                        {ranges ? `${ranges.min}-${ranges.max}` : 'N/A'}
                      </td>
                      <td>
                        {isLow && <span className="flag low">L</span>}
                        {isHigh && <span className="flag high">H</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {interpretation && (
          <div className="interpretation">
            <h5>Interpretation:</h5>
            <p>{interpretation}</p>
          </div>
        )}

        {verifiedBy && (
          <div className="verification">
            Verified by: {verifiedBy}
          </div>
        )}
      </div>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="no-results-available">
        <p>No completed diagnostic results available</p>
      </div>
    );
  }

  return (
    <div className="results-viewer">
      <div className="results-sidebar">
        <h3>Completed Orders</h3>
        <div className="order-list">
          {orders.map(order => (
            <div
              key={order.id}
              className={`order-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="order-date">{formatDate(order.orderDate)}</div>
              <div className="order-tests">{order.tests.length} tests</div>
              {order.tests.some(t => t.criticalValues?.length > 0) && (
                <span className="critical-indicator">⚠️</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="results-content">
        {selectedOrder ? (
          <>
            <div className="results-header">
              <h2>Diagnostic Results</h2>
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'summary' ? 'active' : ''}`}
                  onClick={() => setViewMode('summary')}
                >
                  Summary View
                </button>
                <button
                  className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
                  onClick={() => setViewMode('detailed')}
                >
                  Detailed View
                </button>
                <button className="print-btn">
                  Print Results
                </button>
              </div>
            </div>

            <div className="order-info">
              <span>Order #{selectedOrder.id}</span>
              <span>Completed: {formatDate(selectedOrder.completedAt)}</span>
            </div>

            <div className="test-results">
              {selectedOrder.tests.map(test => {
                const testDetails = DiagnosticsService.testCatalog.find(
                  t => t.id === test.testId
                );
                return (
                  <div key={test.testId} className="test-section">
                    {renderTestResult(test, testDetails)}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="no-selection">
            <p>Select an order to view results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsViewer;