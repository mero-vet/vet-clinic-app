import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { useMedicalRecords } from '../../context/MedicalRecordsContext';
import { useCheckIn } from '../../context/CheckInContext';
import MedicalRecordsService from '../../services/MedicalRecordsService';
import SOAPNoteEditor from './components/SOAPNoteEditor';
import PhysicalExamForm from './components/PhysicalExamForm';
import VitalSignsForm from './components/VitalSignsForm';
import ProblemList from './components/ProblemList';
import ExamTemplates from './components/ExamTemplates';
import './DoctorExamScreen.css';

const DoctorExamScreen = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentPatient } = usePatient();
  const { addVisit } = useMedicalRecords();
  const { checkedInPatients } = useCheckIn();
  
  const [activeTab, setActiveTab] = useState('soap');
  const [examData, setExamData] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Get check-in data for this patient
  const checkInData = checkedInPatients.find(p => p.patientId === patientId);

  useEffect(() => {
    // Initialize new exam
    if (patientId && !examData) {
      const newExam = MedicalRecordsService.startNewExam(patientId, checkInData?.visitType || 'wellness');
      
      // Pre-populate subjective from check-in
      if (checkInData?.reasonForVisit) {
        newExam.soap.subjective = `Chief Complaint: ${checkInData.reasonForVisit}\n`;
      }
      
      setExamData(newExam);
    }

    // Auto-save notification
    const autoSaveInterval = setInterval(() => {
      if (examData && !isFinalized) {
        setAutoSaveStatus('Auto-saving...');
        setTimeout(() => setAutoSaveStatus('Auto-saved'), 1000);
      }
    }, 30000);

    return () => {
      clearInterval(autoSaveInterval);
      if (!isFinalized) {
        MedicalRecordsService.stopAutoSave();
      }
    };
  }, [patientId, examData, checkInData, isFinalized]);

  const handleSOAPUpdate = (section, content) => {
    MedicalRecordsService.updateSOAPSection(section, content);
    setExamData({ ...MedicalRecordsService.currentExam });
  };

  const handleVitalsUpdate = (vitals) => {
    MedicalRecordsService.recordVitalSigns(vitals);
    setExamData({ ...MedicalRecordsService.currentExam });
  };

  const handlePhysicalExamUpdate = (system, findings) => {
    MedicalRecordsService.recordPhysicalExam(system, findings);
    setExamData({ ...MedicalRecordsService.currentExam });
  };

  const handleProblemAdd = (problem) => {
    MedicalRecordsService.addProblem(problem);
    setExamData({ ...MedicalRecordsService.currentExam });
  };

  const handleTemplateApply = (templateId) => {
    const template = MedicalRecordsService.loadTemplate(templateId);
    if (template) {
      setExamData({ ...MedicalRecordsService.currentExam });
      setShowTemplates(false);
    }
  };

  const handleSaveExam = () => {
    MedicalRecordsService.saveExam();
    setAutoSaveStatus('Saved');
  };

  const handleFinalizeExam = () => {
    const finalizedExam = MedicalRecordsService.finalizeExam();
    
    // Add to visit history
    addVisit({
      id: finalizedExam.id,
      date: new Date().toISOString().split('T')[0],
      reason: checkInData?.reasonForVisit || examData.visitType,
      doctor: 'Dr. Patterson', // In real app, get from auth context
      diagnoses: finalizedExam.problemList.map(p => p.description),
      notes: finalizedExam.soap.plan,
      followupNeeded: false,
      followupDate: ''
    });

    setIsFinalized(true);
    
    // Navigate to next workflow
    setTimeout(() => {
      navigate(`/services/${patientId}`);
    }, 2000);
  };

  const handleOrderDiagnostics = () => {
    // Save current exam state before navigating
    MedicalRecordsService.saveExam();
    navigate(`/services/${patientId}?returnTo=exam`);
  };

  if (!currentPatient) {
    return <div className="loading">Loading patient data...</div>;
  }

  return (
    <div className="doctor-exam-screen">
      <div className="exam-header">
        <div className="patient-info">
          <h1>Medical Examination</h1>
          <div className="patient-details">
            <span className="patient-name">{currentPatient.name}</span>
            <span className="patient-meta">
              {currentPatient.species} • {currentPatient.breed} • {currentPatient.age}
            </span>
            {checkInData && (
              <span className="visit-type">Visit Type: {checkInData.visitType}</span>
            )}
          </div>
        </div>
        
        <div className="exam-actions">
          {autoSaveStatus && (
            <span className="auto-save-status">{autoSaveStatus}</span>
          )}
          <button 
            className="template-btn"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            Templates
          </button>
          <button 
            className="save-btn"
            onClick={handleSaveExam}
            disabled={isFinalized}
          >
            Save Progress
          </button>
          <button 
            className="finalize-btn"
            onClick={handleFinalizeExam}
            disabled={isFinalized}
          >
            {isFinalized ? 'Finalized ✓' : 'Finalize Exam'}
          </button>
        </div>
      </div>

      <div className="exam-tabs">
        <button 
          className={`tab ${activeTab === 'soap' ? 'active' : ''}`}
          onClick={() => setActiveTab('soap')}
        >
          SOAP Notes
        </button>
        <button 
          className={`tab ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          Vital Signs
        </button>
        <button 
          className={`tab ${activeTab === 'physical' ? 'active' : ''}`}
          onClick={() => setActiveTab('physical')}
        >
          Physical Exam
        </button>
        <button 
          className={`tab ${activeTab === 'problems' ? 'active' : ''}`}
          onClick={() => setActiveTab('problems')}
        >
          Problem List
        </button>
      </div>

      <div className="exam-content">
        {showTemplates && (
          <ExamTemplates
            species={currentPatient.species}
            onApply={handleTemplateApply}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {activeTab === 'soap' && examData && (
          <SOAPNoteEditor
            soap={examData.soap}
            onChange={handleSOAPUpdate}
            disabled={isFinalized}
          />
        )}

        {activeTab === 'vitals' && examData && (
          <VitalSignsForm
            vitals={examData.vitalSigns}
            species={currentPatient.species}
            onChange={handleVitalsUpdate}
            disabled={isFinalized}
          />
        )}

        {activeTab === 'physical' && examData && (
          <PhysicalExamForm
            findings={examData.physicalExam}
            onChange={handlePhysicalExamUpdate}
            disabled={isFinalized}
          />
        )}

        {activeTab === 'problems' && examData && (
          <ProblemList
            problems={examData.problemList}
            onAdd={handleProblemAdd}
            disabled={isFinalized}
          />
        )}
      </div>

      <div className="exam-footer">
        <button 
          className="order-diagnostics-btn"
          onClick={handleOrderDiagnostics}
          disabled={isFinalized}
        >
          Order Diagnostics
        </button>
        <div className="navigation-buttons">
          <button 
            className="back-btn"
            onClick={() => navigate(`/patient-checkin/${patientId}`)}
          >
            Back to Check-in
          </button>
          <button 
            className="next-btn"
            onClick={() => navigate(`/services/${patientId}`)}
            disabled={!isFinalized}
          >
            Continue to Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorExamScreen;