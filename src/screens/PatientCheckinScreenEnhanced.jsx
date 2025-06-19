import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/PatientForms.css';
import { usePatient } from '../context/PatientContext';
import { usePIMS } from '../context/PIMSContext';
import { useCheckIn } from '../context/CheckInContext';
import { useScheduling } from '../context/SchedulingContext';
import PIMSScreenWrapper from '../components/PIMSScreenWrapper';
import PatientSearchBar from '../components/PatientSearchBar';

// Original components
import ClientInfo from './PatientCheckin/components/ClientInfo';
import PatientInfo from './PatientCheckin/components/PatientInfo';
import ReasonForVisit from './PatientCheckin/components/ReasonForVisit';
import DocumentsList from './PatientCheckin/components/DocumentsList';
import RemindersAppointments from './PatientCheckin/components/RemindersAppointments';
import CheckInOutButtons from './PatientCheckin/components/CheckInOutButtons';

// New enhanced components
import CheckInQueue from '../components/CheckIn/CheckInQueue';
import WeightCapture from '../components/CheckIn/WeightCapture';
import InsuranceVerification from '../components/CheckIn/InsuranceVerification';
import RoomAssignment from '../components/CheckIn/RoomAssignment';
import TriageAssessment from '../components/CheckIn/TriageAssessment';

const PatientCheckinScreenEnhanced = () => {
  const { patientData, setPatientData, setMockPatientData } = usePatient();
  const { config, currentPIMS } = usePIMS();
  const { 
    currentCheckIn, 
    createCheckIn, 
    updateCheckInStatus, 
    CHECK_IN_STATUS,
    notifications,
    dismissNotification 
  } = useCheckIn();
  const { appointments } = useScheduling();
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const dataInitialized = useRef(false);

  const [showQueue, setShowQueue] = useState(true);
  const [activeStep, setActiveStep] = useState('arrival');
  const [checkInData, setCheckInData] = useState({
    appointmentId: null,
    patientId: null,
    clientId: null,
    reasonForVisit: '',
    staffId: '',
    previousWeight: null
  });

  useEffect(() => {
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

  const handlePatientSelection = (checkIn) => {
    // Load patient data from check-in
    if (checkIn.patientId) {
      // In a real app, would load patient data from service
      setCheckInData({
        appointmentId: checkIn.appointmentId,
        patientId: checkIn.patientId,
        clientId: checkIn.clientId,
        reasonForVisit: checkIn.reasonForVisit,
        staffId: checkIn.checkInBy,
        previousWeight: checkIn.weight.previousValue
      });
      setActiveStep('weight');
      setShowQueue(false);
    }
  };

  const handleStartCheckIn = () => {
    // Find today's appointment for the selected patient
    const todayAppointment = appointments.find(apt => 
      apt.patientId === patientData.patientId && 
      new Date(apt.date).toDateString() === new Date().toDateString()
    );

    const checkInInfo = {
      appointmentId: todayAppointment?.id || `WALKIN-${Date.now()}`,
      patientId: patientData.patientId,
      clientId: patientData.clientId,
      reasonForVisit: patientData.reasonForVisit || todayAppointment?.reason || '',
      staffId: patientData.staffInitials || 'STAFF',
      previousWeight: patientData.weight ? parseFloat(patientData.weight) : null
    };

    const checkIn = createCheckIn(checkInInfo);
    setCheckInData(checkInInfo);
    setActiveStep('weight');
    setShowQueue(false);
  };

  const handleStepComplete = (step, data) => {
    switch (step) {
      case 'weight':
        updateCheckInStatus(currentCheckIn.checkInId, CHECK_IN_STATUS.VERIFICATION);
        setActiveStep('insurance');
        break;
      case 'insurance':
        updateCheckInStatus(currentCheckIn.checkInId, CHECK_IN_STATUS.CLINICAL_INFO);
        setActiveStep('triage');
        break;
      case 'triage':
        updateCheckInStatus(currentCheckIn.checkInId, CHECK_IN_STATUS.READY);
        setActiveStep('room');
        break;
      case 'room':
        setActiveStep('complete');
        break;
      default:
        break;
    }
  };

  const handleBackToQueue = () => {
    setShowQueue(true);
    setActiveStep('arrival');
  };

  // Get PIMS-specific styles (same as original)
  const getPIMSSpecificStyles = () => {
    const pimsName = config.name.toLowerCase();
    // ... (keeping the same style logic as original)
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
  };

  const styles = getPIMSSpecificStyles();

  return (
    <PIMSScreenWrapper title={config.screenLabels.checkin}>
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="check-in-notifications">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification ${notification.severity}`}
            >
              <span>{notification.message}</span>
              <button onClick={() => dismissNotification(notification.id)}>×</button>
            </div>
          ))}
        </div>
      )}

      {showQueue ? (
        <div className="check-in-container">
          <div className="check-in-header">
            <PatientSearchBar />
            <button 
              onClick={handleStartCheckIn}
              disabled={!patientData.patientId}
              className="start-checkin-btn"
              style={styles.button}
            >
              Start New Check-In
            </button>
          </div>
          <CheckInQueue onSelectPatient={handlePatientSelection} />
        </div>
      ) : (
        <div className="check-in-workflow">
          <div className="workflow-header">
            <button onClick={handleBackToQueue} style={styles.button}>
              ← Back to Queue
            </button>
            <div className="workflow-progress">
              <div className={`step ${activeStep === 'weight' ? 'active' : ''}`}>Weight</div>
              <div className={`step ${activeStep === 'insurance' ? 'active' : ''}`}>Insurance</div>
              <div className={`step ${activeStep === 'triage' ? 'active' : ''}`}>Triage</div>
              <div className={`step ${activeStep === 'room' ? 'active' : ''}`}>Room</div>
            </div>
          </div>

          <div className="workflow-content">
            {activeStep === 'weight' && currentCheckIn && (
              <WeightCapture 
                checkInId={currentCheckIn.checkInId}
                patientId={checkInData.patientId}
                onComplete={() => handleStepComplete('weight')}
              />
            )}
            
            {activeStep === 'insurance' && currentCheckIn && (
              <InsuranceVerification 
                checkInId={currentCheckIn.checkInId}
                clientId={checkInData.clientId}
                onComplete={() => handleStepComplete('insurance')}
              />
            )}
            
            {activeStep === 'triage' && currentCheckIn && (
              <TriageAssessment 
                checkInId={currentCheckIn.checkInId}
                onComplete={() => handleStepComplete('triage')}
              />
            )}
            
            {activeStep === 'room' && currentCheckIn && (
              <RoomAssignment 
                checkInId={currentCheckIn.checkInId}
                visitType={currentCheckIn.reasonForVisit}
                onComplete={() => handleStepComplete('room')}
              />
            )}
            
            {activeStep === 'complete' && (
              <div className="check-in-complete">
                <h2>Check-In Complete!</h2>
                <p>Patient has been checked in and assigned to a room.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={handleBackToQueue} style={styles.button}>
                    Return to Queue
                  </button>
                  <button 
                    onClick={() => navigate(`/${currentPIMS}/exam/${currentCheckIn.patientId}`)} 
                    style={{ ...styles.button, backgroundColor: '#28a745', color: 'white' }}
                  >
                    Start Exam
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Original patient info panels - shown alongside workflow */}
          <div className="patient-info-panels" style={{ marginTop: '20px' }}>
            <div className="patient-checkin-grid">
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

              <div className="patient-checkin-column right-column">
                <RemindersAppointments styles={styles} />
                <DocumentsList styles={styles} />
              </div>
            </div>
          </div>
        </div>
      )}
    </PIMSScreenWrapper>
  );
};

export default PatientCheckinScreenEnhanced;