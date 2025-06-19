import React, { useState } from 'react';
import './VitalSignsForm.css';

const VitalSignsForm = ({ vitals, species, onChange, disabled }) => {
  const [formData, setFormData] = useState({
    temperature: vitals?.temperature || '',
    heartRate: vitals?.heartRate || '',
    respiratoryRate: vitals?.respiratoryRate || '',
    weight: vitals?.weight || '',
    bloodPressure: vitals?.bloodPressure || '',
    painScore: vitals?.painScore || '',
    bodyConditionScore: vitals?.bodyConditionScore || '',
    capillaryRefillTime: vitals?.capillaryRefillTime || '',
    mucousMembranes: vitals?.mucousMembranes || 'Pink and moist',
    ...vitals
  });

  // Normal ranges by species
  const normalRanges = {
    canine: {
      temperature: { min: 99.5, max: 102.5, unit: '°F' },
      heartRate: { min: 60, max: 140, unit: 'bpm' },
      respiratoryRate: { min: 10, max: 30, unit: 'brpm' }
    },
    feline: {
      temperature: { min: 100.5, max: 102.5, unit: '°F' },
      heartRate: { min: 140, max: 220, unit: 'bpm' },
      respiratoryRate: { min: 20, max: 30, unit: 'brpm' }
    }
  };

  const currentRanges = normalRanges[species?.toLowerCase()] || normalRanges.canine;

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const isOutOfRange = (field, value) => {
    if (!value || !currentRanges[field]) return false;
    const numValue = parseFloat(value);
    return numValue < currentRanges[field].min || numValue > currentRanges[field].max;
  };

  const painScoreDescriptions = {
    0: 'No pain',
    1: 'Mild discomfort',
    2: 'Mild pain',
    3: 'Moderate pain',
    4: 'Moderate to severe pain',
    5: 'Severe pain'
  };

  return (
    <div className="vital-signs-form">
      <h2>Vital Signs</h2>
      
      <div className="vitals-grid">
        <div className="vital-field">
          <label>Temperature</label>
          <div className="input-group">
            <input
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleChange('temperature', e.target.value)}
              disabled={disabled}
              className={isOutOfRange('temperature', formData.temperature) ? 'out-of-range' : ''}
            />
            <span className="unit">°F</span>
          </div>
          <span className="normal-range">
            Normal: {currentRanges.temperature.min}-{currentRanges.temperature.max}°F
          </span>
        </div>

        <div className="vital-field">
          <label>Heart Rate</label>
          <div className="input-group">
            <input
              type="number"
              value={formData.heartRate}
              onChange={(e) => handleChange('heartRate', e.target.value)}
              disabled={disabled}
              className={isOutOfRange('heartRate', formData.heartRate) ? 'out-of-range' : ''}
            />
            <span className="unit">bpm</span>
          </div>
          <span className="normal-range">
            Normal: {currentRanges.heartRate.min}-{currentRanges.heartRate.max} bpm
          </span>
        </div>

        <div className="vital-field">
          <label>Respiratory Rate</label>
          <div className="input-group">
            <input
              type="number"
              value={formData.respiratoryRate}
              onChange={(e) => handleChange('respiratoryRate', e.target.value)}
              disabled={disabled}
              className={isOutOfRange('respiratoryRate', formData.respiratoryRate) ? 'out-of-range' : ''}
            />
            <span className="unit">brpm</span>
          </div>
          <span className="normal-range">
            Normal: {currentRanges.respiratoryRate.min}-{currentRanges.respiratoryRate.max} brpm
          </span>
        </div>

        <div className="vital-field">
          <label>Weight</label>
          <div className="input-group">
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              disabled={disabled}
            />
            <span className="unit">lbs</span>
          </div>
        </div>

        <div className="vital-field">
          <label>Blood Pressure</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="120/80"
              value={formData.bloodPressure}
              onChange={(e) => handleChange('bloodPressure', e.target.value)}
              disabled={disabled}
            />
            <span className="unit">mmHg</span>
          </div>
        </div>

        <div className="vital-field">
          <label>Body Condition Score</label>
          <div className="bcs-selector">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(score => (
              <button
                key={score}
                className={`bcs-btn ${formData.bodyConditionScore === score ? 'selected' : ''}`}
                onClick={() => handleChange('bodyConditionScore', score)}
                disabled={disabled}
              >
                {score}
              </button>
            ))}
          </div>
          <span className="help-text">1 = Emaciated, 5 = Ideal, 9 = Obese</span>
        </div>

        <div className="vital-field">
          <label>Pain Score</label>
          <div className="pain-selector">
            {[0, 1, 2, 3, 4, 5].map(score => (
              <button
                key={score}
                className={`pain-btn ${formData.painScore === score ? 'selected' : ''}`}
                onClick={() => handleChange('painScore', score)}
                disabled={disabled}
              >
                {score}
              </button>
            ))}
          </div>
          <span className="help-text">
            {painScoreDescriptions[formData.painScore] || 'Select pain level'}
          </span>
        </div>

        <div className="vital-field">
          <label>Capillary Refill Time</label>
          <div className="input-group">
            <input
              type="number"
              step="0.1"
              value={formData.capillaryRefillTime}
              onChange={(e) => handleChange('capillaryRefillTime', e.target.value)}
              disabled={disabled}
            />
            <span className="unit">seconds</span>
          </div>
          <span className="normal-range">Normal: &lt;2 seconds</span>
        </div>

        <div className="vital-field">
          <label>Mucous Membranes</label>
          <select
            value={formData.mucousMembranes}
            onChange={(e) => handleChange('mucousMembranes', e.target.value)}
            disabled={disabled}
          >
            <option value="Pink and moist">Pink and moist</option>
            <option value="Pale">Pale</option>
            <option value="Bright red">Bright red</option>
            <option value="Cyanotic">Cyanotic</option>
            <option value="Jaundiced">Jaundiced</option>
            <option value="Tacky">Tacky</option>
          </select>
        </div>
      </div>

      <div className="vital-notes">
        <label>Additional Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional observations..."
          disabled={disabled}
          rows={3}
        />
      </div>
    </div>
  );
};

export default VitalSignsForm;