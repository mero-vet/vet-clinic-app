import React, { useState } from 'react';
import MedicalRecordsService from '../../../services/MedicalRecordsService';
import './ExamTemplates.css';

const ExamTemplates = ({ species, onApply, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  
  const templates = MedicalRecordsService.getTemplatesForSpecies(species);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Initialize variables with empty values
    const initialVars = {};
    if (template.variables) {
      Object.keys(template.variables).forEach(key => {
        initialVars[key] = '';
      });
    }
    setVariables(initialVars);
  };

  const handleVariableChange = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onApply(selectedTemplate.id);
    }
  };

  const getVariablePlaceholder = (key) => {
    const placeholders = {
      weight: 'e.g., 65.5',
      temperature: 'e.g., 101.2',
      heartRate: 'e.g., 80',
      respiratoryRate: 'e.g., 20',
      bcs: 'e.g., 5',
      ownerConcerns: 'e.g., no concerns',
      appetite: 'e.g., normal',
      waterIntake: 'e.g., normal',
      chiefComplaint: 'e.g., vomiting',
      duration: 'e.g., 2 days',
      symptoms: 'e.g., lethargy, decreased appetite'
    };
    return placeholders[key] || '';
  };

  return (
    <div className="exam-templates-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Exam Templates</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="templates-container">
          <div className="template-list">
            <h3>Available Templates</h3>
            {templates.map(template => (
              <div
                key={template.id}
                className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <h4>{template.name}</h4>
                <span className="template-species">{template.species}</span>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="template-preview">
              <h3>Template Preview</h3>
              
              {selectedTemplate.variables && Object.keys(selectedTemplate.variables).length > 0 && (
                <div className="template-variables">
                  <h4>Fill in Variables:</h4>
                  {Object.keys(selectedTemplate.variables).map(key => (
                    <div key={key} className="variable-input">
                      <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                      <input
                        type="text"
                        value={variables[key] || ''}
                        onChange={(e) => handleVariableChange(key, e.target.value)}
                        placeholder={getVariablePlaceholder(key)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="template-sections">
                {Object.entries(selectedTemplate.sections).map(([section, content]) => (
                  <div key={section} className="template-section">
                    <h4>{section.charAt(0).toUpperCase() + section.slice(1)}</h4>
                    <pre>{content}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="apply-btn" 
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate}
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamTemplates;