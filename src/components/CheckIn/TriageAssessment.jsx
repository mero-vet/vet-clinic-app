import React, { useState } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import './TriageAssessment.css';

const TriageAssessment = ({ checkInId, onComplete }) => {
  const { updatePriority, addClinicalInfo, TRIAGE_PRIORITY } = useCheckIn();
  const [assessment, setAssessment] = useState({
    priority: TRIAGE_PRIORITY.NORMAL,
    symptoms: [],
    vitals: {
      temperature: '',
      pulse: '',
      respiration: ''
    },
    pain: 0,
    consciousness: 'alert',
    breathing: 'normal',
    circulation: 'normal',
    triageNotes: ''
  });

  const symptomOptions = [
    { id: 'vomiting', label: 'Vomiting', severity: 'moderate' },
    { id: 'diarrhea', label: 'Diarrhea', severity: 'moderate' },
    { id: 'lethargy', label: 'Lethargy', severity: 'mild' },
    { id: 'not-eating', label: 'Not Eating', severity: 'moderate' },
    { id: 'difficulty-breathing', label: 'Difficulty Breathing', severity: 'severe' },
    { id: 'seizures', label: 'Seizures', severity: 'severe' },
    { id: 'bleeding', label: 'Bleeding', severity: 'severe' },
    { id: 'trauma', label: 'Trauma/Injury', severity: 'severe' },
    { id: 'pain', label: 'Signs of Pain', severity: 'moderate' },
    { id: 'collapse', label: 'Collapse', severity: 'severe' },
    { id: 'toxin-ingestion', label: 'Toxin Ingestion', severity: 'severe' },
    { id: 'urinary-blockage', label: 'Urinary Blockage', severity: 'severe' }
  ];

  const handleSymptomToggle = (symptom) => {
    setAssessment(prev => {
      const symptoms = prev.symptoms.some(s => s.id === symptom.id)
        ? prev.symptoms.filter(s => s.id !== symptom.id)
        : [...prev.symptoms, symptom];
      
      // Auto-update priority based on symptoms
      const hasSevere = symptoms.some(s => s.severity === 'severe');
      const hasModerate = symptoms.some(s => s.severity === 'moderate');
      
      let priority = TRIAGE_PRIORITY.NORMAL;
      if (hasSevere) {
        priority = TRIAGE_PRIORITY.EMERGENCY;
      } else if (hasModerate && symptoms.length >= 2) {
        priority = TRIAGE_PRIORITY.URGENT;
      } else if (hasModerate) {
        priority = TRIAGE_PRIORITY.NORMAL;
      } else {
        priority = TRIAGE_PRIORITY.ROUTINE;
      }
      
      return { ...prev, symptoms, priority };
    });
  };

  const handleVitalChange = (vital, value) => {
    setAssessment(prev => ({
      ...prev,
      vitals: { ...prev.vitals, [vital]: value }
    }));
  };

  const getPainDescription = (level) => {
    if (level === 0) return 'No pain';
    if (level <= 2) return 'Mild discomfort';
    if (level <= 4) return 'Moderate pain';
    if (level <= 6) return 'Significant pain';
    if (level <= 8) return 'Severe pain';
    return 'Extreme pain';
  };

  const handleSubmit = () => {
    try {
      // Update priority
      updatePriority(checkInId, assessment.priority, assessment.triageNotes);
      
      // Add clinical information
      addClinicalInfo(checkInId, {
        symptoms: assessment.symptoms,
        vitals: assessment.vitals,
        triageAssessment: {
          pain: assessment.pain,
          consciousness: assessment.consciousness,
          breathing: assessment.breathing,
          circulation: assessment.circulation,
          notes: assessment.triageNotes
        }
      });
      
      onComplete?.(assessment);
    } catch (err) {
      console.error('Failed to save triage assessment:', err);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case TRIAGE_PRIORITY.EMERGENCY:
        return 'priority-emergency';
      case TRIAGE_PRIORITY.URGENT:
        return 'priority-urgent';
      case TRIAGE_PRIORITY.NORMAL:
        return 'priority-normal';
      case TRIAGE_PRIORITY.ROUTINE:
        return 'priority-routine';
      default:
        return '';
    }
  };

  return (
    <div className="triage-assessment">
      <h3>Triage Assessment</h3>
      
      <div className={`current-priority ${getPriorityClass(assessment.priority)}`}>
        <span>Current Priority:</span>
        <strong>{assessment.priority.toUpperCase()}</strong>
      </div>

      <div className="assessment-section">
        <h4>Presenting Symptoms</h4>
        <div className="symptoms-grid">
          {symptomOptions.map(symptom => (
            <label key={symptom.id} className="symptom-checkbox">
              <input
                type="checkbox"
                checked={assessment.symptoms.some(s => s.id === symptom.id)}
                onChange={() => handleSymptomToggle(symptom)}
              />
              <span className={`symptom-label severity-${symptom.severity}`}>
                {symptom.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="assessment-section">
        <h4>Vital Signs</h4>
        <div className="vitals-grid">
          <div className="vital-input">
            <label>Temperature (°F)</label>
            <input
              type="text"
              value={assessment.vitals.temperature}
              onChange={(e) => handleVitalChange('temperature', e.target.value)}
              placeholder="101.5"
            />
          </div>
          <div className="vital-input">
            <label>Pulse (bpm)</label>
            <input
              type="text"
              value={assessment.vitals.pulse}
              onChange={(e) => handleVitalChange('pulse', e.target.value)}
              placeholder="120"
            />
          </div>
          <div className="vital-input">
            <label>Respiration (rpm)</label>
            <input
              type="text"
              value={assessment.vitals.respiration}
              onChange={(e) => handleVitalChange('respiration', e.target.value)}
              placeholder="30"
            />
          </div>
        </div>
      </div>

      <div className="assessment-section">
        <h4>Pain Assessment</h4>
        <div className="pain-scale">
          <input
            type="range"
            min="0"
            max="10"
            value={assessment.pain}
            onChange={(e) => setAssessment(prev => ({ ...prev, pain: parseInt(e.target.value) }))}
            className="pain-slider"
          />
          <div className="pain-labels">
            <span>0</span>
            <span className="pain-value">{assessment.pain}</span>
            <span>10</span>
          </div>
          <div className="pain-description">
            {getPainDescription(assessment.pain)}
          </div>
        </div>
      </div>

      <div className="assessment-section">
        <h4>Quick Assessment</h4>
        <div className="quick-assessment-grid">
          <div className="assessment-item">
            <label>Consciousness</label>
            <select
              value={assessment.consciousness}
              onChange={(e) => setAssessment(prev => ({ ...prev, consciousness: e.target.value }))}
            >
              <option value="alert">Alert</option>
              <option value="depressed">Depressed</option>
              <option value="obtunded">Obtunded</option>
              <option value="stuporous">Stuporous</option>
              <option value="comatose">Comatose</option>
            </select>
          </div>
          <div className="assessment-item">
            <label>Breathing</label>
            <select
              value={assessment.breathing}
              onChange={(e) => setAssessment(prev => ({ ...prev, breathing: e.target.value }))}
            >
              <option value="normal">Normal</option>
              <option value="increased">Increased</option>
              <option value="labored">Labored</option>
              <option value="distressed">Distressed</option>
            </select>
          </div>
          <div className="assessment-item">
            <label>Circulation</label>
            <select
              value={assessment.circulation}
              onChange={(e) => setAssessment(prev => ({ ...prev, circulation: e.target.value }))}
            >
              <option value="normal">Normal</option>
              <option value="pale">Pale</option>
              <option value="cyanotic">Cyanotic</option>
              <option value="shock">Shock</option>
            </select>
          </div>
        </div>
      </div>

      <div className="assessment-section">
        <h4>Triage Notes</h4>
        <textarea
          value={assessment.triageNotes}
          onChange={(e) => setAssessment(prev => ({ ...prev, triageNotes: e.target.value }))}
          placeholder="Additional observations or concerns..."
          rows={3}
        />
      </div>

      <div className="triage-actions">
        <div className="priority-override">
          <label>Manual Priority Override:</label>
          <select
            value={assessment.priority}
            onChange={(e) => setAssessment(prev => ({ ...prev, priority: e.target.value }))}
            className={getPriorityClass(assessment.priority)}
          >
            <option value={TRIAGE_PRIORITY.EMERGENCY}>Emergency</option>
            <option value={TRIAGE_PRIORITY.URGENT}>Urgent</option>
            <option value={TRIAGE_PRIORITY.NORMAL}>Normal</option>
            <option value={TRIAGE_PRIORITY.ROUTINE}>Routine</option>
          </select>
        </div>
        
        <button 
          className="btn-primary"
          onClick={handleSubmit}
        >
          Complete Triage
        </button>
      </div>
    </div>
  );
};

export default TriageAssessment;