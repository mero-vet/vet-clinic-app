import React, { useState } from 'react';
import FileExplorerModal from './FileExplorerModal';
import ExportProgressModal from './ExportProgressModal';

const ExportSelectionView = () => {
  const [templateName, setTemplateName] = useState('Alex_PowerBI');
  const [startingRecord, setStartingRecord] = useState(1);
  const [endingRecord, setEndingRecord] = useState(12774);
  const [selectedRows, setSelectedRows] = useState([0]); // First row selected by default
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const exportData = [
    {
      name: 'C-All Patients',
      userName: 'Betsy',
      selectionDate: 'Jul 26, 2025',
      recordsSelected: 12774,
      clients: 7762,
      patients: 12774
    },
    {
      name: 'C-Client Types',
      userName: 'brandy',
      selectionDate: 'May 23, 2025',
      recordsSelected: 395,
      clients: 395,
      patients: '-'
    }
  ];

  const templateOptions = [
    'Alex_PowerBI',
    'Alex_PowerBI_Clients',
    'Client Type Appointment Search',
    'E-Mail Template',
    'Mailing Template',
    'Pet Weight Distribution',
    'Reminder Template',
    'Revenue by Client and Address'
  ];

  const handleRowSelect = (index) => {
    setSelectedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleExport = () => {
    setShowFileExplorer(true);
  };

  const handleFileSave = (fileName, fileType) => {
    setShowFileExplorer(false);
    setShowProgress(true);
  };

  const handleCloseExport = () => {
    // Close the Export Selection tab
    window.dispatchEvent(new CustomEvent('closeExportSelection'));
  };

  return (
    <div className="export-selection-view">
      {/* Template and Record Range Controls */}
      <div className="export-controls">
        <div className="control-row">
          <div className="control-group">
            <label>Template Name:</label>
            <select 
              value={templateName} 
              onChange={(e) => setTemplateName(e.target.value)}
              className="template-dropdown"
            >
              {templateOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>Starting Record:</label>
            <input 
              type="number" 
              value={startingRecord}
              onChange={(e) => setStartingRecord(parseInt(e.target.value))}
              className="record-input"
            />
          </div>
          
          <div className="control-group">
            <label>Ending Record:</label>
            <input 
              type="number" 
              value={endingRecord}
              onChange={(e) => setEndingRecord(parseInt(e.target.value))}
              className="record-input"
            />
          </div>
        </div>
      </div>

      {/* Export Results Table */}
      <div className="export-table-container">
        <table className="export-table">
          <thead>
            <tr>
              <th style={{width: '30px'}}></th>
              <th>Name</th>
              <th>User Name</th>
              <th>Selection Date</th>
              <th>Records Selected</th>
              <th>Clients</th>
              <th>Patients</th>
            </tr>
          </thead>
          <tbody>
            {exportData.map((row, index) => (
              <tr 
                key={index} 
                className={selectedRows.includes(index) ? 'selected' : ''}
                onClick={() => handleRowSelect(index)}
              >
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleRowSelect(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="name-cell">{row.name}</td>
                <td>{row.userName}</td>
                <td>{row.selectionDate}</td>
                <td>{row.recordsSelected.toLocaleString()}</td>
                <td>{row.clients.toLocaleString()}</td>
                <td>{row.patients === '-' ? '-' : row.patients.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export/Close Buttons */}
      <div className="export-actions">
        <button className="export-btn" onClick={handleExport}>
          Export
        </button>
        <button className="close-export-btn" onClick={handleCloseExport}>
          Close
        </button>
      </div>

      {/* Modals */}
      <FileExplorerModal 
        isOpen={showFileExplorer}
        onClose={() => setShowFileExplorer(false)}
        onSave={handleFileSave}
      />
      
      <ExportProgressModal 
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
      />
    </div>
  );
};

export default ExportSelectionView;
