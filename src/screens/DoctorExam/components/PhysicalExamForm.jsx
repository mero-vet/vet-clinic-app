import React, { useState } from 'react';
import MedicalRecordsService from '../../../services/MedicalRecordsService';
import './PhysicalExamForm.css';

const PhysicalExamForm = ({ findings, onChange, disabled }) => {
  const [expandedSystems, setExpandedSystems] = useState({});
  
  const examSystems = MedicalRecordsService.physicalExamSystems;

  const toggleSystem = (systemName) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemName]: !prev[systemName]
    }));
  };

  const handleFindingToggle = (system, finding, isNormal) => {
    const currentFindings = findings[system]?.findings || {
      normal: [],
      abnormal: [],
      notes: ''
    };

    const updatedFindings = { ...currentFindings };
    
    if (isNormal) {
      if (updatedFindings.normal.includes(finding)) {
        updatedFindings.normal = updatedFindings.normal.filter(f => f !== finding);
      } else {
        updatedFindings.normal.push(finding);
        // Remove from abnormal if present
        updatedFindings.abnormal = updatedFindings.abnormal.filter(f => f !== finding);
      }
    } else {
      if (updatedFindings.abnormal.includes(finding)) {
        updatedFindings.abnormal = updatedFindings.abnormal.filter(f => f !== finding);
      } else {
        updatedFindings.abnormal.push(finding);
        // Remove from normal if present
        updatedFindings.normal = updatedFindings.normal.filter(f => f !== finding);
      }
    }

    onChange(system, updatedFindings);
  };

  const handleNotesChange = (system, notes) => {
    const currentFindings = findings[system]?.findings || {
      normal: [],
      abnormal: [],
      notes: ''
    };

    onChange(system, { ...currentFindings, notes });
  };

  const getSystemStatus = (system) => {
    const systemFindings = findings[system]?.findings;
    if (!systemFindings) return 'not-examined';
    if (systemFindings.abnormal.length > 0) return 'abnormal';
    if (systemFindings.normal.length > 0) return 'normal';
    return 'not-examined';
  };

  return (
    <div className="physical-exam-form">
      <h2>Physical Examination</h2>
      
      <div className="exam-legend">
        <span className="legend-item normal">✓ Normal</span>
        <span className="legend-item abnormal">⚠ Abnormal</span>
        <span className="legend-item not-examined">- Not Examined</span>
      </div>

      <div className="exam-systems">
        {examSystems.map(examSystem => {
          const systemFindings = findings[examSystem.system]?.findings || {
            normal: [],
            abnormal: [],
            notes: ''
          };
          const isExpanded = expandedSystems[examSystem.system];
          const status = getSystemStatus(examSystem.system);

          return (
            <div key={examSystem.system} className={`exam-system ${status}`}>
              <div 
                className="system-header"
                onClick={() => toggleSystem(examSystem.system)}
              >
                <span className="system-name">{examSystem.system}</span>
                <span className="system-status">
                  {status === 'normal' && '✓ Normal'}
                  {status === 'abnormal' && '⚠ Abnormal'}
                  {status === 'not-examined' && '- Not examined'}
                </span>
                <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
              </div>

              {isExpanded && (
                <div className="system-content">
                  <div className="findings-section">
                    <h4>Normal Findings</h4>
                    <div className="findings-grid">
                      {examSystem.normalFindings.map(finding => (
                        <label key={finding} className="finding-checkbox">
                          <input
                            type="checkbox"
                            checked={systemFindings.normal.includes(finding)}
                            onChange={() => handleFindingToggle(examSystem.system, finding, true)}
                            disabled={disabled}
                          />
                          <span>{finding}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="findings-section">
                    <h4>Abnormal Findings</h4>
                    <div className="findings-grid">
                      {examSystem.abnormalFindings.map(finding => (
                        <label key={finding} className="finding-checkbox abnormal">
                          <input
                            type="checkbox"
                            checked={systemFindings.abnormal.includes(finding)}
                            onChange={() => handleFindingToggle(examSystem.system, finding, false)}
                            disabled={disabled}
                          />
                          <span>{finding}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="findings-notes">
                    <label>Additional Notes</label>
                    <textarea
                      value={systemFindings.notes}
                      onChange={(e) => handleNotesChange(examSystem.system, e.target.value)}
                      placeholder="Describe any additional findings..."
                      disabled={disabled}
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="exam-summary">
        <h3>Examination Summary</h3>
        <div className="summary-content">
          {Object.entries(findings).map(([system, data]) => {
            const systemFindings = data?.findings;
            if (!systemFindings || (systemFindings.normal.length === 0 && systemFindings.abnormal.length === 0)) {
              return null;
            }

            return (
              <div key={system} className="summary-item">
                <strong>{system}:</strong>
                {systemFindings.normal.length > 0 && (
                  <span className="normal"> {systemFindings.normal.join(', ')}</span>
                )}
                {systemFindings.abnormal.length > 0 && (
                  <span className="abnormal"> ABNORMAL: {systemFindings.abnormal.join(', ')}</span>
                )}
                {systemFindings.notes && (
                  <span className="notes"> - {systemFindings.notes}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhysicalExamForm;