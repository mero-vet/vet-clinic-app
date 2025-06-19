import React from 'react';
import DiagnosticsService from '../../services/DiagnosticsService';
import './TestCatalog.css';

const TestCatalog = ({ searchQuery, filterCategory, selectedTests, onTestSelect }) => {
  const allTests = DiagnosticsService.getTestCatalog();
  
  // Filter tests based on search and category
  const filteredTests = allTests.filter(test => {
    const matchesSearch = !searchQuery || 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.aliases && test.aliases.some(alias => 
        alias.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    const matchesCategory = filterCategory === 'all' || test.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group tests by category
  const groupedTests = filteredTests.reduce((groups, test) => {
    if (!groups[test.category]) {
      groups[test.category] = [];
    }
    groups[test.category].push(test);
    return groups;
  }, {});

  return (
    <div className="test-catalog">
      {Object.entries(groupedTests).map(([category, tests]) => (
        <div key={category} className="test-category">
          <h3 className="category-header">{category}</h3>
          <div className="tests-grid">
            {tests.map(test => {
              const isSelected = selectedTests.some(t => t.id === test.id);
              
              return (
                <div 
                  key={test.id} 
                  className={`test-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onTestSelect(test)}
                >
                  <div className="test-header">
                    <h4>{test.name}</h4>
                    <span className={`test-type ${test.type}`}>
                      {test.type === 'in-house' ? 'In-House' : 'Send Out'}
                    </span>
                  </div>
                  
                  <div className="test-details">
                    <div className="detail-row">
                      <span className="label">Sample:</span>
                      <span className="value">{test.sampleType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Volume:</span>
                      <span className="value">{test.sampleVolume}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">TAT:</span>
                      <span className="value">{test.turnaroundTime}</span>
                    </div>
                    <div className="detail-row price">
                      <span className="label">Price:</span>
                      <span className="value">${test.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {test.components && (
                    <div className="test-components">
                      <span className="components-label">Includes:</span>
                      <span className="components-list">
                        {test.components.slice(0, 3).join(', ')}
                        {test.components.length > 3 && ` +${test.components.length - 3} more`}
                      </span>
                    </div>
                  )}

                  {test.speciesSpecific && (
                    <div className="species-badge">
                      {test.species.join(', ')} only
                    </div>
                  )}

                  <div className="selection-indicator">
                    {isSelected ? '✓ Selected' : 'Click to select'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredTests.length === 0 && (
        <div className="no-tests">
          <p>No tests found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TestCatalog;