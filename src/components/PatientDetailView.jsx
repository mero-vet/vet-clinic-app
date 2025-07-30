import React, { useState, useEffect } from 'react';
import { MdPets } from 'react-icons/md';
import ExportSelectionView from './ExportSelectionView';

const PatientDetailView = () => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [activeTab, setActiveTab] = useState('Reminders');
  const [activeSecondaryTab, setActiveSecondaryTab] = useState(null);

  // Sample patient data
  const patient = {
    id: '#3',
    name: 'Marcus Chen',
    lastName: 'Chen',
    firstName: 'Marcus',
    spouseName: 'Sarah Thompson',
    address: '2847 Willow Creek Drive',
    city: 'Virginia Beach, VA',
    homePhone: '(757) 555-4892',
    workPhone: '(757) 555-0156 ext: 204',
    cellPhone: '(757) 442-7391',
    email: 'marcus.chen@oceanviewtech.com',
    lastVisit: '7/18/2025',
    photo: '/api/placeholder/80/80'
  };

  const tabs = [
    'Reminders', 'Weight History', 'Images', 'Diagnosis', 'Problems', 'RX'
  ];

  const secondaryTabs = [
    'Files', 'Clinic Census', 'Medical Records', 'Scheduler', 'Episodes Of Care',
    'Lab Integrations', 'Patient Processing', 'Reports'
  ];

  const reportTypes = [
    'Accounts Receivable Reports',
    'Boarding Reports',
    'Census Reports',
    'Employee Reports',
    'Financial Reports',
    'Inventory Reports',
    'Log Reports',
    'Medical Record Reports',
    'Process Management Reports',
    'Product Letter Reports',
    'Product Reports',
    'Recheck Reports',
    'Scheduler Reports',
    'Setup Reports',
    'Time Management Reports'
  ];

  const handleReportToggle = (report) => {
    setSelectedReports(prev =>
      prev.includes(report)
        ? prev.filter(r => r !== report)
        : [...prev, report]
    );
  };

  // Listen for Export Selection button click from toolbar
  useEffect(() => {
    const handleOpenExportSelection = () => {
      setActiveSecondaryTab('Export Selection');
    };

    const handleCloseExportSelection = () => {
      setActiveSecondaryTab(null);
    };

    window.addEventListener('openExportSelection', handleOpenExportSelection);
    window.addEventListener('closeExportSelection', handleCloseExportSelection);

    return () => {
      window.removeEventListener('openExportSelection', handleOpenExportSelection);
      window.removeEventListener('closeExportSelection', handleCloseExportSelection);
    };
  }, []);

  return (
    <div className="patient-detail-view">
      {/* Patient Info Card */}
      <div className="patient-info-card">
        <div className="patient-photo">
          <MdPets size={40} />
        </div>
        <div className="patient-name">{patient.name} {patient.id}</div>

        <div className="patient-details">
          <div className="detail-row total-balance">
            <span className="label">Total A/R Balance</span>
            <span className="value">$84.50</span>
          </div>
          <div className="detail-row">
            <span className="label">Last Name</span>
            <span className="value">{patient.lastName}</span>
          </div>
          <div className="detail-row">
            <span className="label">First Name</span>
            <span className="value">{patient.firstName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Spouse Full Name</span>
            <span className="value">{patient.spouseName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Street Address</span>
            <span className="value">{patient.address}</span>
          </div>
          <div className="detail-row">
            <span className="label">City, State</span>
            <span className="value">{patient.city}</span>
          </div>
          <div className="detail-row">
            <span className="label">Home Phone</span>
            <span className="value">{patient.homePhone}</span>
          </div>
          <div className="detail-row">
            <span className="label">Work Phone</span>
            <span className="value">{patient.workPhone}</span>
          </div>
          <div className="detail-row">
            <span className="label">Cell Phone Number</span>
            <span className="value">{patient.cellPhone}</span>
          </div>
          <div className="detail-row">
            <span className="label">Email Address</span>
            <span className="value">{patient.email}</span>
          </div>
          <div className="detail-row">
            <span className="label">Latest Visit Date</span>
            <span className="value">{patient.lastVisit}</span>
          </div>
          <div className="detail-row">
            <span className="label">Comment</span>
            <span className="value"></span>
          </div>
        </div>

        <div className="patient-banner">
          <MdPets size={24} />
          <span>{patient.name} {patient.id}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Primary Tabs */}
        <div className="primary-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Secondary Tabs */}
        <div className="secondary-tabs">
          {secondaryTabs.map(tab => (
            <button
              key={tab}
              className={`secondary-tab ${activeSecondaryTab === tab ? 'active' : ''}`}
              onClick={() => setActiveSecondaryTab(activeSecondaryTab === tab ? null : tab)}
            >
              {tab}
              <span
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSecondaryTab(null);
                }}
              >×</span>
            </button>
          ))}
        </div>

        {/* Content Area - Show Export Selection or Reports */}
        {activeSecondaryTab === 'Export Selection' ? (
          <ExportSelectionView />
        ) : (
          <div className="reports-section">
            <div className="reports-header">
              <label>Report List Name</label>
              <select className="report-dropdown">
                <option>None</option>
              </select>
            </div>

            <div className="reports-grid">
              {reportTypes.map(report => (
                <div key={report} className="report-item">
                  <input
                    type="checkbox"
                    id={report}
                    checked={selectedReports.includes(report)}
                    onChange={() => handleReportToggle(report)}
                  />
                  <label htmlFor={report}>{report}</label>
                </div>
              ))}
            </div>

            <div className="reports-actions">
              <button className="action-btn">Select All Items</button>
              <button className="action-btn">Clear Selection</button>
              <div className="reports-options">
                <label>
                  <input type="checkbox" />
                  Print All Reports Landscaped
                </label>
                <label>
                  <input type="checkbox" />
                  Print with Defaults
                </label>
                <button className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel Actions */}
        <div className="right-actions">
          <button className="setup-btn">Setup Lists</button>
          <button className="setup-btn">Setup Printers</button>
          <button className="setup-btn">Security</button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
