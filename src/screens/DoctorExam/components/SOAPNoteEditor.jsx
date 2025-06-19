import React, { useState } from 'react';
import MedicalRecordsService from '../../../services/MedicalRecordsService';
import './SOAPNoteEditor.css';

const SOAPNoteEditor = ({ soap, onChange, disabled }) => {
  const [expandAbbr, setExpandAbbr] = useState(false);

  const handleTextChange = (section, value) => {
    onChange(section, value);
  };

  const handleExpandAbbreviations = (section) => {
    const expandedText = MedicalRecordsService.expandAbbreviation(soap[section]);
    onChange(section, expandedText);
  };

  const sections = [
    {
      key: 'subjective',
      title: 'Subjective',
      placeholder: 'Patient history, owner observations, symptoms...',
      helpText: 'What the owner reports and patient history'
    },
    {
      key: 'objective',
      title: 'Objective',
      placeholder: 'Physical exam findings, vital signs, lab results...',
      helpText: 'What you observe and measure'
    },
    {
      key: 'assessment',
      title: 'Assessment',
      placeholder: 'Differential diagnoses, clinical impressions...',
      helpText: 'Your professional assessment and diagnoses'
    },
    {
      key: 'plan',
      title: 'Plan',
      placeholder: 'Treatment plan, medications, follow-up instructions...',
      helpText: 'Treatment and follow-up recommendations'
    }
  ];

  return (
    <div className="soap-note-editor">
      <div className="editor-header">
        <h2>SOAP Notes</h2>
        <label className="expand-abbr-toggle">
          <input
            type="checkbox"
            checked={expandAbbr}
            onChange={(e) => setExpandAbbr(e.target.checked)}
            disabled={disabled}
          />
          Auto-expand abbreviations
        </label>
      </div>

      {sections.map(section => (
        <div key={section.key} className="soap-section">
          <div className="section-header">
            <h3>{section.title}</h3>
            <span className="help-text">{section.helpText}</span>
            {expandAbbr && (
              <button
                className="expand-btn"
                onClick={() => handleExpandAbbreviations(section.key)}
                disabled={disabled}
              >
                Expand Abbreviations
              </button>
            )}
          </div>
          
          <textarea
            className="soap-textarea"
            value={soap[section.key] || ''}
            onChange={(e) => handleTextChange(section.key, e.target.value)}
            placeholder={section.placeholder}
            disabled={disabled}
            rows={section.key === 'objective' ? 8 : 6}
          />
          
          <div className="character-count">
            {soap[section.key]?.length || 0} characters
          </div>
        </div>
      ))}

      <div className="editor-tips">
        <h4>Quick Tips:</h4>
        <ul>
          <li>Use standard medical abbreviations for efficiency</li>
          <li>Be specific about locations (e.g., "left front paw")</li>
          <li>Include all abnormal findings in Objective section</li>
          <li>List differential diagnoses in order of likelihood</li>
          <li>Include client education in Plan section</li>
        </ul>
      </div>
    </div>
  );
};

export default SOAPNoteEditor;