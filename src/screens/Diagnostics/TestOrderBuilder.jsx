import React, { useState } from 'react';
import './TestOrderBuilder.css';

const TestOrderBuilder = ({ 
  selectedTests, 
  priority, 
  onPriorityChange, 
  onRemoveTest, 
  onSubmit, 
  totalCost 
}) => {
  const [notes, setNotes] = useState('');
  const [fastingRequired, setFastingRequired] = useState(false);

  // Group tests by sample type for collection efficiency
  const testsBySample = selectedTests.reduce((groups, test) => {
    if (!groups[test.sampleType]) {
      groups[test.sampleType] = [];
    }
    groups[test.sampleType].push(test);
    return groups;
  }, {});

  // Calculate total sample volume needed
  const sampleVolumes = Object.entries(testsBySample).map(([sampleType, tests]) => {
    const totalVolume = tests.reduce((sum, test) => {
      const volume = parseFloat(test.sampleVolume) || 0;
      return sum + volume;
    }, 0);
    
    return { sampleType, count: tests.length, totalVolume };
  });

  const handleSubmit = () => {
    if (selectedTests.length === 0) return;
    
    // In real app, would include notes and other metadata
    onSubmit();
  };

  return (
    <div className="test-order-builder">
      <h2>Order Summary</h2>
      
      {selectedTests.length === 0 ? (
        <div className="empty-order">
          <p>No tests selected</p>
          <p className="help-text">Select tests from the catalog to build your order</p>
        </div>
      ) : (
        <>
          <div className="order-priority">
            <label>Priority:</label>
            <div className="priority-options">
              <label className={`priority-option ${priority === 'routine' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="routine"
                  checked={priority === 'routine'}
                  onChange={(e) => onPriorityChange(e.target.value)}
                />
                <span>Routine</span>
              </label>
              <label className={`priority-option ${priority === 'urgent' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="urgent"
                  checked={priority === 'urgent'}
                  onChange={(e) => onPriorityChange(e.target.value)}
                />
                <span>Urgent</span>
              </label>
              <label className={`priority-option ${priority === 'stat' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="stat"
                  checked={priority === 'stat'}
                  onChange={(e) => onPriorityChange(e.target.value)}
                />
                <span>STAT</span>
              </label>
            </div>
          </div>

          <div className="selected-tests">
            <h3>Selected Tests ({selectedTests.length})</h3>
            <div className="test-list">
              {selectedTests.map(test => (
                <div key={test.id} className="test-item">
                  <div className="test-info">
                    <span className="test-name">{test.name}</span>
                    <span className="test-meta">
                      {test.type === 'in-house' ? 'In-House' : 'Send Out'} • 
                      {test.turnaroundTime}
                    </span>
                  </div>
                  <div className="test-actions">
                    <span className="test-price">${test.price.toFixed(2)}</span>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveTest(test.id)}
                      title="Remove test"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sample-requirements">
            <h3>Sample Requirements</h3>
            <div className="sample-list">
              {sampleVolumes.map(({ sampleType, count, totalVolume }) => (
                <div key={sampleType} className="sample-item">
                  <span className="sample-type">{sampleType}</span>
                  <span className="sample-details">
                    {count} test{count > 1 ? 's' : ''} • 
                    {totalVolume > 0 ? ` ${totalVolume} mL total` : ' Volume varies'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-options">
            <label className="fasting-option">
              <input
                type="checkbox"
                checked={fastingRequired}
                onChange={(e) => setFastingRequired(e.target.checked)}
              />
              <span>Fasting required (12 hours)</span>
            </label>
          </div>

          <div className="order-notes">
            <label>Clinical Notes (Optional):</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant clinical information..."
              rows={3}
            />
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
            <div className="total-row estimate">
              <span>Estimated Total:</span>
              <span className="total-amount">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-actions">
            <button 
              className="submit-order-btn"
              onClick={handleSubmit}
            >
              Submit Order
            </button>
            <button 
              className="save-draft-btn"
              onClick={() => console.log('Save as draft')}
            >
              Save as Draft
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TestOrderBuilder;