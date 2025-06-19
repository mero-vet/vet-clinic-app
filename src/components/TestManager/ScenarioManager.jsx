import React, { useState, useEffect } from 'react';
import ScenarioService from '../../services/ScenarioService';
import ScenarioEditor from './ScenarioEditor';

const ScenarioManager = ({ onClose }) => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const all = await ScenarioService.getAllScenarios();
      setScenarios(all);
    } catch (err) {
      console.error('Failed to load scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (scenario) => {
    try {
      const updated = { ...scenario, enabled: !scenario.enabled };
      await ScenarioService.saveScenario(updated);
      await loadScenarios();
    } catch (err) {
      console.error('Failed to toggle scenario:', err);
    }
  };

  const handleEdit = (scenario) => {
    setEditingId(scenario.id);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setShowEditor(true);
  };

  const handleSave = async () => {
    setShowEditor(false);
    setEditingId(null);
    await loadScenarios();
  };

  const handleDelete = async (scenario) => {
    if (window.confirm(`Are you sure you want to delete "${scenario.name}"?`)) {
      try {
        await ScenarioService.deleteScenario(scenario.id);
        await loadScenarios();
      } catch (err) {
        console.error('Failed to delete scenario:', err);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Scenario Manager</h2>
        <p>Loading scenarios...</p>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Scenario Manager</h2>
        <ScenarioEditor
          scenarioId={editingId}
          onSave={handleSave}
          onCancel={() => setShowEditor(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Scenario Manager</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleNew}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            + New Scenario
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Description</th>
              <th style={{ padding: 12, textAlign: 'center' }}>PIMS</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Enabled</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario, index) => (
              <tr
                key={scenario.id}
                style={{
                  borderBottom: '1px solid #dee2e6',
                  background: index % 2 === 0 ? 'white' : '#f8f9fa',
                  opacity: scenario.enabled ? 1 : 0.6
                }}
              >
                <td style={{ padding: 12 }}>
                  <strong>{scenario.name}</strong>
                  {scenario.tags?.length > 0 && (
                    <div style={{ fontSize: 12, color: '#6c757d', marginTop: 4 }}>
                      {scenario.tags.join(', ')}
                    </div>
                  )}
                </td>
                <td style={{ padding: 12, fontSize: 14 }}>{scenario.description}</td>
                <td style={{ padding: 12, textAlign: 'center', fontSize: 12 }}>
                  {scenario.pims?.join(', ') || 'All'}
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={scenario.enabled}
                      onChange={() => handleToggleEnabled(scenario)}
                      style={{ marginRight: 4 }}
                    />
                    {scenario.enabled ? 'Yes' : 'No'}
                  </label>
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(scenario)}
                    style={{
                      padding: '4px 8px',
                      marginRight: 4,
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(scenario)}
                    style={{
                      padding: '4px 8px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, padding: 16, background: '#e7f3ff', borderRadius: 8, fontSize: 14 }}>
        <strong>Tips:</strong>
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
          <li>Scenarios must have at least one success criteria to be valid</li>
          <li>Disabled scenarios won't appear in the test selector</li>
          <li>Use tags to organize scenarios by feature area or complexity</li>
          <li>PIMS selection determines which practice management systems support the scenario</li>
        </ul>
      </div>
    </div>
  );
};

export default ScenarioManager;