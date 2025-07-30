import React, { useState, useEffect } from 'react';
import ScenarioService from '../../services/ScenarioService';

const ScenarioSelector = ({ value, onChange, disabled, onAddScenario }) => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const enabledScenarios = await ScenarioService.getEnabledScenarios();
      setScenarios(enabledScenarios);

      // If current value is not in the list, select the first one
      if (enabledScenarios.length > 0 && !enabledScenarios.find(s => s.id === value)) {
        onChange(enabledScenarios[0].id);
      }
    } catch (err) {
      console.error('Failed to load scenarios:', err);
      setError('Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Scenario:
          <div style={{ marginTop: 4, color: '#666' }}>Loading scenarios...</div>
        </label>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Scenario:
          <div style={{ marginTop: 4, color: '#c00' }}>{error}</div>
        </label>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: 'block', marginBottom: 4 }}>
        Scenario:
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          <select
            style={{ flex: 1 }}
            className="note-dropdown"
            disabled={disabled}
            value={value}
            onChange={e => onChange(e.target.value)}
          >
            {scenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
          {onAddScenario && (
            <button
              style={{ padding: '2px 8px' }}
              onClick={onAddScenario}
              disabled={disabled}
              title="Add new scenario"
            >
              +
            </button>
          )}
        </div>
      </label>
    </div>
  );
};

export default ScenarioSelector;