import React, { useState } from 'react';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';

import ClientInfo from './ClientInfo';
import PatientInfo from './PatientInfo';
import ReasonForVisit from './ReasonForVisit';
import DocumentsList from './DocumentsList';
import RemindersAppointments from './RemindersAppointments';
import CheckInOutButtons from './CheckInOutButtons';

const PatientCheckin = () => {
  const [formData, setFormData] = useState({
    // Client Info
    clientId: '',
    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    emailDeclined: false,
    phoneHome: '',
    phoneExt: '',
    phoneDeclined: false,

    // Billing & Contact
    balanceDue: '',
    address: '',
    city: '',
    stateProv: '',
    postalCode: '',

    // Patient Info
    patientId: '',
    patientName: '',
    species: '',
    sex: '',
    breed: '',
    birthDate: '',
    ageYears: '',
    ageMonths: '',
    ageDays: '',
    weightDate: '',
    weight: '',
    weightLbs: '',
    additionalNotes: '',
    alertNotes: '',

    // Reason for Visit
    primaryReason: '',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: '',
    referralRecheck: false,

    // Check-In / Staff Info
    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="windows-classic" style={{ padding: '4px' }}>
      <div className="window" style={{ margin: '0', padding: '4px' }}>
        <div className="title-bar">
          <div className="title-bar-text">Patient Check-in/out</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        <div className="window-body" style={{ padding: '6px' }}>
          {/* Adjusted columns for a snug fit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ClientInfo formData={formData} handleInputChange={handleInputChange} />
              <PatientInfo formData={formData} handleInputChange={handleInputChange} />
            </div>

            <fieldset>
              <legend>Billing & Contact</legend>
              <div className="form-row">
                <label>Balance due:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="text"
                    name="balanceDue"
                    value={formData.balanceDue}
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
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <label>State/prov:</label>
                <input
                  type="text"
                  name="stateProv"
                  value={formData.stateProv}
                  onChange={handleInputChange}
                />
                <label>Postal code:</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </fieldset>

            <CheckInOutButtons formData={formData} handleInputChange={handleInputChange} />
          </div>

          {/* Middle row: Patient docs (left) + Reason for Visit (right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
            <DocumentsList />
            <ReasonForVisit formData={formData} handleInputChange={handleInputChange} />
          </div>

          {/* Bottom row: Reminders & Future Appointments */}
          <RemindersAppointments />
        </div>
      </div>
    </div>
  );
};

export default PatientCheckin;