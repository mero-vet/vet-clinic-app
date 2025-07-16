import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/PatientForms.css';
import { usePatient } from '../context/PatientContext';
import { usePIMS } from '../context/PIMSContext';
import PIMSScreenWrapper from '../components/PIMSScreenWrapper';
import PatientSearchBar from '../components/PatientSearchBar';

import ClientInfo from './PatientCheckin/components/ClientInfo';
import PatientInfo from './PatientCheckin/components/PatientInfo';
import ReasonForVisit from './PatientCheckin/components/ReasonForVisit';
import DocumentsList from './PatientCheckin/components/DocumentsList';
import RemindersAppointments from './PatientCheckin/components/RemindersAppointments';
import CheckInOutButtons from './PatientCheckin/components/CheckInOutButtons';

const PatientCheckinScreen = () => {
  const { patientData, setPatientData, setMockPatientData } = usePatient();
  const { config, currentPIMS } = usePIMS();
  const location = useLocation();
  const dataInitialized = useRef(false);

  useEffect(() => {
    // Only set mock data once when the component first mounts
    if (!dataInitialized.current) {
      setMockPatientData();
      dataInitialized.current = true;
    }
  }, [setMockPatientData]);

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

  // Get PIMS-specific patient check-in styling
  const getPIMSSpecificStyles = () => {
    const pimsName = config.name.toLowerCase();

    switch (pimsName) {
      case 'cornerstone':
        return {
          grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            height: '100%',
          },
          column: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          },
          fieldset: {
            marginBottom: '15px',
            padding: '8px',
            border: '2px inset #d0d0d0',
          },
          legend: {
            fontSize: '12px',
            fontWeight: 'bold',
          },
          formRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
          },
          input: {
            border: '2px inset #d0d0d0',
            padding: '3px',
            fontSize: '12px',
          },
          button: {
            backgroundColor: '#c0c0c0',
            border: '2px outset #ffffff',
            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff',
            padding: '3px 10px',
            fontSize: '12px',
            cursor: 'pointer',
          }
        };

      case 'avimark':
        return {
          grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            height: '100%',
          },
          column: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          },
          fieldset: {
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #cccccc',
            borderRadius: '2px',
          },
          legend: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#A70000',
          },
          formRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
          },
          input: {
            border: '1px solid #cccccc',
            padding: '5px',
            fontSize: '13px',
            borderRadius: '2px',
          },
          button: {
            backgroundColor: '#A70000',
            color: 'white',
            border: 'none',
            padding: '5px 12px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '2px',
          }
        };

      case 'easyvet':
        return {
          grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px',
            height: '100%',
          },
          column: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          },
          fieldset: {
            marginBottom: '24px',
            padding: '16px',
            border: '1px solid #E0E0E0',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          },
          legend: {
            fontSize: '16px',
            fontWeight: '500',
            color: '#4CAF50',
            padding: '0 8px',
          },
          formRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          },
          input: {
            border: '1px solid #E0E0E0',
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '4px',
          },
          button: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }
        };

      case 'intravet':
        return {
          grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            height: '100%',
          },
          column: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          },
          fieldset: {
            marginBottom: '20px',
            padding: '15px',
            border: '1px solid #BBBBBB',
            borderRadius: '3px',
          },
          legend: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1565C0',
            padding: '0 5px',
          },
          formRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          },
          input: {
            border: '1px solid #BBBBBB',
            padding: '6px 10px',
            fontSize: '13px',
            borderRadius: '3px',
          },
          button: {
            background: 'linear-gradient(to bottom, #2196F3, #1565C0)',
            color: 'white',
            border: 'none',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '3px',
          }
        };

      case 'covetrus pulse':
        return {
          grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
            height: '100%',
          },
          column: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          },
          fieldset: {
            marginBottom: '28px',
            padding: '20px',
            border: '1px solid #E0E0E0',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          },
          legend: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#6200EA',
            padding: '0 10px',
          },
          formRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          },
          input: {
            border: '1px solid #E0E0E0',
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: '8px',
          },
          button: {
            backgroundColor: '#6200EA',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '8px',
            boxShadow: '0 3px 8px rgba(98, 0, 234, 0.2)',
          }
        };

      default:
        return {
          grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            height: '100%',
          },
          column: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          },
          fieldset: {
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ccc',
          },
          legend: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
          formRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          },
          input: {
            border: '1px solid #ccc',
            padding: '5px',
            fontSize: '14px',
          },
          button: {
            padding: '5px 10px',
            fontSize: '14px',
            cursor: 'pointer',
          }
        };
    }
  };

  const styles = getPIMSSpecificStyles();

  return (
    <PIMSScreenWrapper title={config.screenLabels.checkin}>
      <PatientSearchBar />
      <div className="patient-checkin-grid">
        {/* Left Column */}
        <div className="patient-checkin-column">
          <ClientInfo
            formData={patientData}
            handleInputChange={handleInputChange}
            styles={styles}
          />
          <PatientInfo
            formData={patientData}
            handleInputChange={handleInputChange}
            styles={styles}
          />
        </div>

        {/* Middle Column */}
        <div className="patient-checkin-column middle-column">
          <CheckInOutButtons
            formData={patientData}
            handleInputChange={handleInputChange}
            styles={styles}
          />
          <ReasonForVisit
            formData={patientData}
            handleInputChange={handleInputChange}
            styles={styles}
          />
        </div>

        {/* Right Column */}
        <div className="patient-checkin-column right-column">
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Billing & Contact</legend>
            <div style={styles.formRow}>
              <label htmlFor="balance-due-input">Balance due:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  id="balance-due-input"
                  type="text"
                  name="balanceDue"
                  value={patientData.balanceDue}
                  onChange={handleInputChange}
                  data-testid="balance-due-field"
                  aria-label="Balance due amount"
                  style={{ width: '80px', ...styles.input }}
                />
                <button
                  id="view-balance-button"
                  style={{ minWidth: '50px', ...styles.button }}
                  type="button"
                  data-testid="view-balance-button"
                  aria-label="View balance details"
                >
                  View
                </button>
              </div>
            </div>
            <div style={styles.formRow}>
              <label htmlFor="address-input">Address:</label>
              <input
                id="address-input"
                type="text"
                name="address"
                value={patientData.address}
                onChange={handleInputChange}
                data-testid="address-field"
                aria-label="Client street address"
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <label htmlFor="city-input">City:</label>
              <input
                id="city-input"
                type="text"
                name="city"
                value={patientData.city}
                onChange={handleInputChange}
                data-testid="city-field"
                aria-label="Client city"
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <label htmlFor="state-prov-input">State/prov:</label>
              <input
                id="state-prov-input"
                type="text"
                name="stateProv"
                value={patientData.stateProv}
                onChange={handleInputChange}
                data-testid="state-prov-field"
                aria-label="State or province"
                style={{ ...styles.input, width: '60px' }}
              />
              <label htmlFor="postal-code-input" style={{ marginLeft: '5px' }}>Postal code:</label>
              <input
                id="postal-code-input"
                type="text"
                name="postalCode"
                value={patientData.postalCode}
                onChange={handleInputChange}
                data-testid="postal-code-field"
                aria-label="Postal or zip code"
                style={{ ...styles.input, width: '80px' }}
              />
            </div>
          </fieldset>
          <RemindersAppointments styles={styles} />
          <DocumentsList styles={styles} />
        </div>
      </div>
    </PIMSScreenWrapper>
  );
};

export default PatientCheckinScreen;