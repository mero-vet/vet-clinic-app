import React, { useState } from 'react';
import './ProblemList.css';

const ProblemList = ({ problems, onAdd, disabled }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProblem, setNewProblem] = useState({
    description: '',
    status: 'active',
    priority: 'medium'
  });

  const handleAddProblem = () => {
    if (newProblem.description.trim()) {
      onAdd(newProblem);
      setNewProblem({
        description: '',
        status: 'active',
        priority: 'medium'
      });
      setShowAddForm(false);
    }
  };

  const priorityColors = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#28a745'
  };

  const statusIcons = {
    active: '●',
    chronic: '◐',
    resolved: '✓',
    monitoring: '👁'
  };

  return (
    <div className="problem-list">
      <div className="problem-header">
        <h2>Problem List</h2>
        <button
          className="add-problem-btn"
          onClick={() => setShowAddForm(true)}
          disabled={disabled}
        >
          + Add Problem
        </button>
      </div>

      {showAddForm && (
        <div className="add-problem-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Problem description"
              value={newProblem.description}
              onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
              autoFocus
            />
          </div>
          
          <div className="form-row">
            <select
              value={newProblem.status}
              onChange={(e) => setNewProblem({ ...newProblem, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="chronic">Chronic</option>
              <option value="resolved">Resolved</option>
              <option value="monitoring">Monitoring</option>
            </select>
            
            <select
              value={newProblem.priority}
              onChange={(e) => setNewProblem({ ...newProblem, priority: e.target.value })}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button className="save-btn" onClick={handleAddProblem}>Save</button>
            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="problems-container">
        {problems.length === 0 ? (
          <div className="no-problems">No problems identified</div>
        ) : (
          <div className="problems-grid">
            {problems.map(problem => (
              <div key={problem.id} className={`problem-item ${problem.status}`}>
                <div className="problem-header-row">
                  <span className="status-icon">{statusIcons[problem.status]}</span>
                  <span 
                    className="priority-indicator"
                    style={{ color: priorityColors[problem.priority] }}
                  >
                    {problem.priority.toUpperCase()}
                  </span>
                </div>
                <div className="problem-description">
                  {problem.description}
                </div>
                <div className="problem-meta">
                  <span className="problem-status">{problem.status}</span>
                  <span className="problem-date">
                    Added: {new Date(problem.addedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="problem-legend">
        <h4>Status Legend:</h4>
        <div className="legend-items">
          <span><span className="status-icon">●</span> Active - Requires treatment</span>
          <span><span className="status-icon">◐</span> Chronic - Ongoing management</span>
          <span><span className="status-icon">✓</span> Resolved - No longer active</span>
          <span><span className="status-icon">👁</span> Monitoring - Watch for changes</span>
        </div>
      </div>
    </div>
  );
};

export default ProblemList;