import React, { useState } from 'react';
import { MdClose, MdAdd, MdRemove } from 'react-icons/md';
import NoteEntryForm from './NoteEntryForm';

const MedicalRecordsView = ({ patientData }) => {
  const [selectedDate, setSelectedDate] = useState('07/07/2025');
  const [activeTab, setActiveTab] = useState('All');
  const [showNoteForm, setShowNoteForm] = useState(false);

  // All medical records data
  const allMedicalRecords = [
    {
      date: '07/07/2025',
      type: 'Note',
      description: 'Cytopoint',
      provider: 'AF Alexis Franklin',
      details: 'Current Infection - Cytopoint injected given. Weight is 15.8 kg. Dose given in muscle was appropriate.',
      color: '#8B4B8A' // Purple
    },
    {
      date: '07/03/2025',
      type: 'Form',
      description: 'Prescription Refill Request',
      provider: 'EMM Dr Betsy Marshall',
      details: 'CYTOPOINT 31-40lb injection',
      cost: 'RX# 30922.00',
      color: '#8B4B8A' // Purple
    },
    {
      date: '06/20/2025',
      type: 'Problem #4',
      description: 'Apoquel 16mg',
      provider: 'EMM Dr Betsy Marshall',
      details: 'Hemangioma right side of face - excised',
      cost: 'RX# 29875.00',
      color: '#4B8B3B' // Green
    },
    {
      date: '06/19/2025',
      type: 'Lab Screen',
      description: 'Histopathology',
      provider: 'EMM Dr Betsy Marshall',
      cost: 'RX# 27499.00',
      color: '#4B8B3B' // Green
    },
    {
      date: '05/15/2025',
      type: 'Recheck',
      description: 'Fill Covers - Canine Bacon 7-14oz',
      provider: 'A A Edrington',
      details: 'Surgery Follow-up 1 Day - Completed',
      color: '#87CEEB' // Light Blue
    },
    {
      date: '05/14/2025',
      type: 'Recheck',
      description: 'Surgery Follow-up 4 Days',
      provider: 'A A Edrington',
      color: '#8B4B8A' // Purple
    },
    {
      date: '05/13/2025',
      type: 'Note',
      description: 'Update after Surgery',
      provider: 'A A Edrington',
      details: 'Anesthesia & Sedation Records',
      color: '#4B8B3B' // Green
    },
    {
      date: '05/13/2025',
      type: 'Link',
      description: 'Bionet Trend',
      provider: 'EMM Dr Betsy Marshall',
      color: '#87CEEB' // Light Blue
    }
  ];

  // Expanded note records data for "Note" tab
  const noteRecords = [
    { date: '07/07/2025', type: 'Note', description: 'Cytopoint', provider: 'AF Alexis Franklin', color: '#87CEEB' },
    { date: '05/14/2025', type: 'Note', description: 'Update after Surgery', provider: 'A A Edrington', color: '#87CEEB' },
    { date: '01/03/2025', type: 'Note', description: 'p is vomiting and not eating', provider: 'CS Camille Singleton, LVT', color: '#87CEEB' },
    { date: '12/10/2024', type: 'Note', description: 'Proheart12 - RIGHT, N/T, A/G', provider: 'EMM Dr Betsy Marshall', color: '#87CEEB' },
    { date: '06/24/2024', type: 'Note', description: 'Anal glands/nail trim', provider: 'JR Jahaira Reyes', color: '#87CEEB' },
    { date: '02/09/2024', type: 'Note', description: 'fecal results - NPS', provider: 'JO Jessica Ols, LVT', color: '#87CEEB' },
    { date: '11/28/2023', type: 'Note', description: 'VitusVet Connect Message - 11/28/2023 6:20:59 AM', provider: 'KF Dr. Kim Fidler', color: '#87CEEB' },
    { date: '11/17/2023', type: 'Note', description: 'Proheart 12 Inj- LEFT', provider: 'MN Melody Nelson, LVT', color: '#87CEEB' },
    { date: '10/23/2023', type: 'Note', description: 'incision check', provider: 'JO Jessica Ols, LVT', color: '#87CEEB' },
    { date: '09/01/2023', type: 'Note', description: 'Tech Appointment', provider: 'HF Heather Foster', color: '#87CEEB' },
    { date: '11/23/2022', type: 'Note', description: 'Proheart/AGE', provider: 'EMM Dr Betsy Marshall', color: '#87CEEB' },
    { date: '05/04/2022', type: 'Note', description: 'Express anal glands', provider: 'CS Camille Singleton, LVT', color: '#87CEEB' },
    { date: '05/02/2022', type: 'Note', description: 'Vomiting', provider: 'EMM Dr Betsy Marshall', color: '#87CEEB' },
    { date: '02/21/2022', type: 'Note', description: 'update on blood work - HT', provider: 'EMM Dr Betsy Marshall', color: '#87CEEB' },
    { date: '11/24/2021', type: 'Note', description: 'Proheart 12 + A/G', provider: 'EMM Dr Betsy Marshall', color: '#87CEEB' },
    { date: '02/17/2021', type: 'Note', description: 'EMOTIONAL HEALTH RECORD', provider: 'CS Camille Singleton', color: '#87CEEB' },
    { date: '11/25/2020', type: 'Note', description: 'Proheart + Express A/G', provider: 'EMM Dr Betsy Marshall', color: '#87CEEB' },
    { date: '05/10/2020', type: 'Note', description: 'Labwork', provider: 'JB Jen Batkin', color: '#87CEEB' },
    { date: '03/09/2020', type: 'Note', description: 'Labwork', provider: 'JB Jen Batkin', color: '#87CEEB' },
    { date: '03/03/2020', type: 'Note', description: 'ultrasound training', provider: 'CS Camille Singleton', color: '#87CEEB' },
    { date: '11/26/2019', type: 'Note', description: 'Anal Gland Expression -Proheart', provider: 'AR Amanda Rourke', color: '#87CEEB' }
  ];

  const reminderData = [
    { 
      definition: 'Fecal Flotation Test - Annual', 
      dueDate: '11/25/2025', 
      performed: '11/25/2024', 
      maySend: true, 
      declined: false, 
      deferred: false 
    },
    { 
      definition: 'Proheart12', 
      dueDate: '12/10/2025', 
      performed: '12/10/2024', 
      maySend: true, 
      declined: false, 
      deferred: false 
    },
    { 
      definition: 'Heartworm Test Annual', 
      dueDate: '1/3/2026', 
      performed: '1/3/2025', 
      maySend: true, 
      declined: false, 
      deferred: false 
    },
    { 
      definition: 'Annual Senior Bloodwork', 
      dueDate: '1/3/2026', 
      performed: '1/3/2025', 
      maySend: true, 
      declined: false, 
      deferred: false 
    },
    { 
      definition: 'Bordetella Vaccination', 
      dueDate: '2/4/2026', 
      performed: '2/4/2025', 
      maySend: false, 
      declined: true, 
      deferred: false 
    },
    { 
      definition: 'Annual Physical Exam', 
      dueDate: '2/7/2026', 
      performed: '2/7/2025', 
      maySend: true, 
      declined: false, 
      deferred: false 
    },
    { 
      definition: 'Leptospirosis Vaccination', 
      dueDate: '2/7/2026', 
      performed: '2/7/2025', 
      maySend: true, 
      declined: false, 
      deferred: false 
    }
  ];

  const tabs = ['All', 'Ctrl', 'Xray', 'DX', 'Form', 'Note', 'Image', 'Lab', 'Problem', 'SOAP', 'Surgery', 'Link', 'Case', 'Invoice', 'History', 'Trt', 'Recheck'];

  // Get records based on active tab
  const getFilteredRecords = () => {
    switch(activeTab) {
      case 'Note':
        return noteRecords;
      case 'All':
      default:
        return allMedicalRecords;
    }
  };

  const currentRecords = getFilteredRecords();
  const recordCount = activeTab === 'Note' ? '23 of 23' : '200 of 597';

  const handleAddItem = () => {
    setShowNoteForm(true);
  };

  const handleSaveNote = (noteData) => {
    console.log('Saving note:', noteData);
    // Add the new note to the records
    setShowNoteForm(false);
  };

  const handleCloseNoteForm = () => {
    setShowNoteForm(false);
  };

  return (
    <div className="medical-records-view">
      {/* Patient Header */}
      <div className="patient-header">
        <div className="patient-photo">
          <img src="/api/placeholder/60/60" alt="Bean #6A" />
        </div>
        <div className="patient-info-header">
          <div className="patient-name-header">Bean #6A</div>
          <div className="patient-details-grid">
            <div className="detail-item">
              <span className="label">Total A/R Balance</span>
              <span className="value balance">($161.00)</span>
            </div>
            <div className="detail-item">
              <span className="label">Name and ID</span>
              <span className="value">Bean # A</span>
            </div>
            <div className="detail-item">
              <span className="label">Medical Alert</span>
              <span className="value alert">Medical Alert</span>
            </div>
            <div className="detail-item">
              <span className="label">Birthdate</span>
              <span className="value">10/26/2014</span>
            </div>
            <div className="detail-item">
              <span className="label">Age</span>
              <span className="value">10 years and 9 months old</span>
            </div>
            <div className="detail-item">
              <span className="label">Species</span>
              <span className="value">Canine</span>
            </div>
            <div className="detail-item">
              <span className="label">Breed</span>
              <span className="value">Beagle Mix</span>
            </div>
            <div className="detail-item">
              <span className="label">Coat Color</span>
              <span className="value">Tri-Color</span>
            </div>
            <div className="detail-item">
              <span className="label">Weight</span>
              <span className="value">15.8 kg</span>
            </div>
            <div className="detail-item">
              <span className="label">Sex</span>
              <span className="value">MN</span>
            </div>
            <div className="detail-item">
              <span className="label">Rabies Tag Number</span>
              <span className="value">test</span>
            </div>
            <div className="detail-item">
              <span className="label">Microchip #</span>
              <span className="value">981020013124583</span>
            </div>
          </div>
        </div>

        {/* Reminder Section */}
        <div className="reminder-section">
          <div className="reminder-header">
            <span className="reminder-title">Reminder entries for Bean #6A</span>
            <button className="modify-btn">Modify</button>
          </div>
          <div className="reminder-table">
            <div className="reminder-table-header">
              <span>Reminder Definition</span>
              <span>Due Date</span>
              <span>Performed</span>
              <span>May Send</span>
              <span>Declined</span>
              <span>Deferred</span>
            </div>
            {reminderData.map((reminder, index) => (
              <div key={index} className="reminder-row">
                <span className="reminder-def">{reminder.definition}</span>
                <span className="due-date">{reminder.dueDate}</span>
                <span className="performed">{reminder.performed}</span>
                <span className="checkbox-cell">
                  <input type="checkbox" checked={reminder.maySend} readOnly />
                </span>
                <span className="checkbox-cell">
                  <input type="checkbox" checked={reminder.declined} readOnly />
                </span>
                <span className="checkbox-cell">
                  <input type="checkbox" checked={reminder.deferred} readOnly />
                </span>
              </div>
            ))}
          </div>
          <div className="reminder-tabs">
            <button className="tab-btn active">Reminders</button>
            <button className="tab-btn">Weight History</button>
            <button className="tab-btn">Images</button>
            <button className="tab-btn">Diagnosis</button>
            <button className="tab-btn">Problems</button>
            <button className="tab-btn">RX</button>
          </div>
        </div>
      </div>

      {/* Medical Records Section */}
      <div className="medical-records-section">
        <div className="records-header">
          <div className="records-tabs">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`records-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="records-info">
            <span>Bean Marshall: Records {recordCount}</span>
            <span>Page 1 of {activeTab === 'Note' ? '1' : '3'}</span>
            {activeTab === 'Note' ? (
              <span>Page 1</span>
            ) : (
              <span>Pages 1 2 3</span>
            )}
          </div>
        </div>

        {/* Additional controls for Note view */}
        {activeTab === 'Note' && (
          <div className="note-controls">
            <select className="note-dropdown">
              <option>Note</option>
            </select>
            <button className="control-btn" onClick={handleAddItem}>Add Item</button>
            <button className="control-btn">Charts</button>
            <button className="control-btn">Sheets</button>
            <button className="control-btn">Print</button>
            <button className="control-btn">DICOM Browser</button>
            <div className="note-info">
              <span>Vaccine History</span>
              <button className="arrow-btn">↓</button>
            </div>
          </div>
        )}

        <div className="records-list">
          {currentRecords.map((record, index) => (
            <div key={index} className="record-entry" style={{ backgroundColor: record.color }}>
              <div className="record-controls">
                <button className="expand-btn">
                  <MdAdd size={12} />
                </button>
              </div>
              <div className="record-date">{record.date}</div>
              <div className="record-type">{record.type}</div>
              <div className="record-description">{record.description}</div>
              <div className="record-provider">Provider: {record.provider}</div>
              {record.details && (
                <div className="record-details">{record.details}</div>
              )}
              {record.cost && (
                <div className="record-cost">{record.cost}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note Entry Form Overlay */}
      <NoteEntryForm 
        isVisible={showNoteForm}
        onClose={handleCloseNoteForm}
        onSave={handleSaveNote}
      />
    </div>
  );
};

export default MedicalRecordsView; 