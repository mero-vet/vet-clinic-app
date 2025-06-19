import React, { useState, useEffect } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import './WeightCapture.css';

const WeightCapture = ({ checkInId, patientId, onComplete }) => {
  const { currentCheckIn, updateWeight } = useCheckIn();
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [error, setError] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  
  // Mock weight history - in real app, this would come from patient records
  const [weightHistory] = useState([
    { date: new Date('2024-10-15'), weight: 65, unit: 'lbs' },
    { date: new Date('2024-07-20'), weight: 63, unit: 'lbs' },
    { date: new Date('2024-04-10'), weight: 62, unit: 'lbs' },
    { date: new Date('2024-01-05'), weight: 61, unit: 'lbs' }
  ]);

  const previousWeight = currentCheckIn?.weight?.previousValue || weightHistory[0]?.weight;

  useEffect(() => {
    if (currentCheckIn?.weight?.value) {
      setWeight(currentCheckIn.weight.value.toString());
      setUnit(currentCheckIn.weight.unit);
    }
  }, [currentCheckIn]);

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value);
      setError('');
    }
  };

  const handleSubmit = () => {
    const weightValue = parseFloat(weight);
    
    if (!weight || isNaN(weightValue)) {
      setError('Please enter a valid weight');
      return;
    }

    if (weightValue <= 0) {
      setError('Weight must be greater than 0');
      return;
    }

    if (weightValue > 500) {
      setError('Please verify weight - seems unusually high');
      return;
    }

    try {
      updateWeight(checkInId, weightValue, unit);
      onComplete?.();
    } catch (err) {
      setError('Failed to update weight');
    }
  };

  const calculateChange = () => {
    if (!previousWeight || !weight) return null;
    
    const currentWeight = parseFloat(weight);
    const change = ((currentWeight - previousWeight) / previousWeight) * 100;
    
    return {
      amount: Math.abs(currentWeight - previousWeight),
      percentage: change,
      direction: change > 0 ? 'gain' : 'loss'
    };
  };

  const change = calculateChange();

  const getChangeClass = () => {
    if (!change) return '';
    
    if (Math.abs(change.percentage) > 20) return 'change-critical';
    if (Math.abs(change.percentage) > 10) return 'change-warning';
    if (Math.abs(change.percentage) > 5) return 'change-notable';
    return 'change-normal';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="weight-capture">
      <h3>Weight Check</h3>
      
      <div className="weight-input-section">
        <div className="weight-input-group">
          <label>Current Weight</label>
          <div className="weight-input-wrapper">
            <input
              type="text"
              value={weight}
              onChange={handleWeightChange}
              placeholder="0.0"
              className={error ? 'error' : ''}
              autoFocus
            />
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
          {error && <span className="error-message">{error}</span>}
        </div>

        {previousWeight && (
          <div className="previous-weight">
            <label>Previous Weight</label>
            <div className="previous-value">
              {previousWeight} {unit}
              <span className="previous-date">
                ({formatDate(weightHistory[0].date)})
              </span>
            </div>
          </div>
        )}
      </div>

      {weight && previousWeight && change && (
        <div className={`weight-comparison ${getChangeClass()}`}>
          <div className="change-indicator">
            <span className="change-direction">
              {change.direction === 'gain' ? '▲' : '▼'}
            </span>
            <span className="change-amount">
              {change.amount.toFixed(1)} {unit}
            </span>
            <span className="change-percentage">
              ({change.percentage > 0 ? '+' : ''}{change.percentage.toFixed(1)}%)
            </span>
          </div>
          
          {Math.abs(change.percentage) > 10 && (
            <div className="change-alert">
              <strong>Significant weight {change.direction}</strong>
              <p>Please verify and note any relevant health changes</p>
            </div>
          )}
        </div>
      )}

      <div className="weight-actions">
        <button 
          className="btn-secondary"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Show'} History
        </button>
        <button 
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!weight || !!error}
        >
          Save Weight
        </button>
      </div>

      {showComparison && (
        <div className="weight-history">
          <h4>Weight History</h4>
          <div className="history-chart">
            {weightHistory.map((entry, index) => (
              <div key={index} className="history-entry">
                <span className="history-date">{formatDate(entry.date)}</span>
                <span className="history-weight">{entry.weight} {entry.unit}</span>
                {index < weightHistory.length - 1 && (
                  <span className="history-change">
                    {entry.weight > weightHistory[index + 1].weight ? '▲' : '▼'}
                    {Math.abs(entry.weight - weightHistory[index + 1].weight).toFixed(1)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightCapture;