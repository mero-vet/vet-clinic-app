import React, { useEffect } from 'react';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';
import { usePatient } from '../context/PatientContext';

import ClientInfo from './PatientCheckin/components/ClientInfo';
import PatientInfo from './PatientCheckin/components/PatientInfo';
import ReasonForVisit from './PatientCheckin/components/ReasonForVisit';
import DocumentsList from './PatientCheckin/components/DocumentsList';
import RemindersAppointments from './PatientCheckin/components/RemindersAppointments';
import CheckInOutButtons from './PatientCheckin/components/CheckInOutButtons';

const PatientCheckinScreen = () => {
  const { patientData, setPatientData, setMockPatientData } = usePatient();

  useEffect(() => {
    // For demo purposes, set mock data when the component mounts
    // In a real app, this would be replaced with actual patient data fetching
    setMockPatientData();
  }, []);

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === 'checkbox') {
      setPatientData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setPatientData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="windows-classic" style={{ minHeight: '100vh' }}>
      <div className="window" style={{ margin: '0', display: 'flex', flexDirection: 'column' }}>
        <div className="title-bar">
          <div className="title-bar-text">Patient Check-in/out</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        <div className="window-body" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div className="patient-checkin-grid">
            {/* Left Column */}
            <div className="patient-checkin-column">
              <ClientInfo formData={patientData} handleInputChange={handleInputChange} />
              <PatientInfo formData={patientData} handleInputChange={handleInputChange} />
            </div>

            {/* Middle Column */}
            <div className="patient-checkin-column middle-column">
              <CheckInOutButtons formData={patientData} handleInputChange={handleInputChange} />
              <ReasonForVisit formData={patientData} handleInputChange={handleInputChange} />
            </div>

            {/* Right Column */}
            <div className="patient-checkin-column right-column">
              <fieldset>
                <legend>Billing & Contact</legend>
                <div className="form-row">
                  <label>Balance due:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="text"
                      name="balanceDue"
                      value={patientData.balanceDue}
                      onChange={handleInputChange}
                      style={{ width: '80px' }}
                    />
                    <button
                      style={{ minWidth: '50px' }}
                      className="windows-button"
                      type="button"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={patientData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    value={patientData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <label>State/prov:</label>
                  <input
                    type="text"
                    name="stateProv"
                    value={patientData.stateProv}
                    onChange={handleInputChange}
                  />
                  <label>Postal code:</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={patientData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </fieldset>
              <RemindersAppointments />
              <DocumentsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCheckinScreen;