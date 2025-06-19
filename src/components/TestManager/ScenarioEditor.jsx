import React, { useState, useEffect } from 'react';
import ScenarioService from '../../services/ScenarioService';
import ScenarioValidationService from '../../services/ScenarioValidationService';

const ScenarioEditor = ({ scenarioId, onSave, onCancel }) => {
  const [scenario, setScenario] = useState({
    id: '',
    name: '',
    description: '',
    agentPrompt: '',
    expectedResult: '',
    pims: ['cornerstone', 'avimark', 'easyvet', 'intravet', 'covetrus'],
    successCriteria: [],
    enabled: true,
    tags: []
  });
  const [errors, setErrors] = useState([]);
  const [validationIssues, setValidationIssues] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (scenarioId) {
      loadScenario();
    } else {
      // Generate new ID for new scenarios
      setScenario(prev => ({
        ...prev,
        id: `scenario-${Date.now()}`
      }));
    }
  }, [scenarioId]);

  const loadScenario = async () => {
    try {
      const loaded = await ScenarioService.getScenario(scenarioId);
      if (loaded) {
        setScenario(loaded);
      }
    } catch (err) {
      console.error('Failed to load scenario:', err);
      setErrors(['Failed to load scenario']);
    }
  };

  const handleChange = (field, value) => {
    const updated = {
      ...scenario,
      [field]: value
    };
    setScenario(updated);
    setErrors([]); // Clear errors on change
    
    // Run validation
    const issues = ScenarioValidationService.validateScenario(updated);
    setValidationIssues(issues);
  };

  const handlePimsChange = (pims) => {
    const checked = scenario.pims.includes(pims);
    if (checked) {
      handleChange('pims', scenario.pims.filter(p => p !== pims));
    } else {
      handleChange('pims', [...scenario.pims, pims]);
    }
  };

  const handleCriteriaAdd = () => {
    handleChange('successCriteria', [
      ...scenario.successCriteria,
      { type: 'url-contains', value: '' }
    ]);
  };

  const handleCriteriaUpdate = (index, field, value) => {
    const updated = [...scenario.successCriteria];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('successCriteria', updated);
  };

  const handleCriteriaRemove = (index) => {
    handleChange('successCriteria', scenario.successCriteria.filter((_, i) => i !== index));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    handleChange('tags', tags);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors([]);
      
      // Check for validation errors
      const issues = ScenarioValidationService.validateScenario(scenario);
      const errors = issues.filter(i => i.type === 'error');
      if (errors.length > 0) {
        setErrors(errors.map(e => e.message));
        setSaving(false);
        return;
      }
      
      // Add timestamps
      const toSave = {
        ...scenario,
        updatedAt: new Date().toISOString(),
        createdAt: scenario.createdAt || new Date().toISOString()
      };
      
      await ScenarioService.saveScenario(toSave);
      onSave(toSave);
    } catch (err) {
      console.error('Failed to save scenario:', err);
      if (err.message.includes('validation')) {
        setErrors([err.message]);
      } else {
        setErrors(['Failed to save scenario']);
      }
    } finally {
      setSaving(false);
    }
  };

  const pimsOptions = [
    { id: 'cornerstone', name: 'Cornerstone' },
    { id: 'avimark', name: 'Avimark' },
    { id: 'easyvet', name: 'EasyVet' },
    { id: 'intravet', name: 'IntraVet' },
    { id: 'covetrus', name: 'Covetrus Pulse' }
  ];

  return (
    <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
      <h3>{scenarioId ? 'Edit Scenario' : 'Create New Scenario'}</h3>
      
      {errors.length > 0 && (
        <div style={{ background: '#fee', border: '1px solid #c00', padding: 10, marginBottom: 16, borderRadius: 4 }}>
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}
      
      {validationIssues.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {validationIssues.filter(i => i.type === 'warning').length > 0 && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', padding: 10, marginBottom: 8, borderRadius: 4 }}>
              <strong>Warnings:</strong>
              {validationIssues.filter(i => i.type === 'warning').map((issue, i) => (
                <div key={i} style={{ marginTop: 4 }}>• {issue.message}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          Scenario Name *
        </label>
        <input
          type="text"
          value={scenario.name}
          onChange={e => handleChange('name', e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          placeholder="e.g., New Client Registration"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          Description *
        </label>
        <input
          type="text"
          value={scenario.description}
          onChange={e => handleChange('description', e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          placeholder="e.g., Register a new client and add their pets"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          Agent Prompt *
        </label>
        <textarea
          value={scenario.agentPrompt}
          onChange={e => handleChange('agentPrompt', e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, minHeight: 100, resize: 'vertical' }}
          placeholder="e.g., Hello Mero, please register a new client named Sarah Johnson..."
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          Expected Result *
        </label>
        <input
          type="text"
          value={scenario.expectedResult}
          onChange={e => handleChange('expectedResult', e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          placeholder="e.g., Client and patients successfully created in the system"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Compatible PIMS
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {pimsOptions.map(pims => (
            <label key={pims.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={scenario.pims.includes(pims.id)}
                onChange={() => handlePimsChange(pims.id)}
                style={{ marginRight: 4 }}
              />
              {pims.name}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Success Criteria
        </label>
        {scenario.successCriteria.map((criteria, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select
              value={criteria.type}
              onChange={e => handleCriteriaUpdate(index, 'type', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4 }}
            >
              <option value="url-contains">URL Contains</option>
              <option value="selector">Element Selector</option>
            </select>
            {criteria.type === 'url-contains' ? (
              <input
                type="text"
                value={criteria.value || ''}
                onChange={e => handleCriteriaUpdate(index, 'value', e.target.value)}
                placeholder="e.g., /create-client"
                style={{ flex: 1, padding: 6, border: '1px solid #ddd', borderRadius: 4 }}
              />
            ) : (
              <>
                <input
                  type="text"
                  value={criteria.selector || ''}
                  onChange={e => handleCriteriaUpdate(index, 'selector', e.target.value)}
                  placeholder="e.g., button.submit"
                  style={{ flex: 1, padding: 6, border: '1px solid #ddd', borderRadius: 4 }}
                />
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={criteria.mustExist !== false}
                    onChange={e => handleCriteriaUpdate(index, 'mustExist', e.target.checked)}
                    style={{ marginRight: 4 }}
                  />
                  Must exist
                </label>
              </>
            )}
            <button
              onClick={() => handleCriteriaRemove(index)}
              style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleCriteriaAdd}
          style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Add Criteria
        </button>
        <div style={{ marginTop: 8, padding: 8, background: '#e7f3ff', borderRadius: 4, fontSize: 12 }}>
          <strong>Available screens:</strong> {ScenarioValidationService.getAvailableScreens().join(', ')}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={scenario.tags?.join(', ') || ''}
          onChange={e => handleTagsChange(e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          placeholder="e.g., registration, client-management"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={scenario.enabled}
            onChange={e => handleChange('enabled', e.target.checked)}
            style={{ marginRight: 8 }}
          />
          <strong>Enabled</strong> (scenario will appear in test selector)
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1
          }}
        >
          {saving ? 'Saving...' : 'Save Scenario'}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ScenarioEditor;