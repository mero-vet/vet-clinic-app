import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const PatientClinicalContext = createContext();

export const usePatientClinical = () => {
  const context = useContext(PatientClinicalContext);
  if (!context) {
    throw new Error('usePatientClinical must be used within a PatientClinicalProvider');
  }
  return context;
};

export const PatientClinicalProvider = ({ children }) => {
  const [clinicalData, setClinicalData] = useState({
    weightDate: '',
    weight: '',
    balanceDue: '0.00',
    medicalHistory: [],
    medications: [],
    allergies: [],
    vaccinations: [],
    labResults: [],
    vitalSigns: {
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      bloodPressure: ''
    },
    diagnosticImages: [],
    treatmentPlans: [],
    prescriptions: []
  });

  const updateClinicalData = useCallback((updates) => {
    setClinicalData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const addMedicalHistoryEntry = useCallback((entry) => {
    setClinicalData(prev => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, {
        ...entry,
        id: Date.now().toString(),
        date: new Date().toISOString()
      }]
    }));
  }, []);

  const updateVitalSigns = useCallback((vitals) => {
    setClinicalData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        ...vitals
      }
    }));
  }, []);

  const addPrescription = useCallback((prescription) => {
    setClinicalData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, {
        ...prescription,
        id: Date.now().toString(),
        prescribedDate: new Date().toISOString()
      }]
    }));
  }, []);

  const resetClinicalData = useCallback(() => {
    setClinicalData({
      weightDate: '',
      weight: '',
      balanceDue: '0.00',
      medicalHistory: [],
      medications: [],
      allergies: [],
      vaccinations: [],
      labResults: [],
      vitalSigns: {
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        bloodPressure: ''
      },
      diagnosticImages: [],
      treatmentPlans: [],
      prescriptions: []
    });
  }, []);

  const value = useMemo(() => ({
    clinicalData,
    updateClinicalData,
    addMedicalHistoryEntry,
    updateVitalSigns,
    addPrescription,
    resetClinicalData
  }), [clinicalData, updateClinicalData, addMedicalHistoryEntry, updateVitalSigns, addPrescription, resetClinicalData]);

  return (
    <PatientClinicalContext.Provider value={value}>
      {children}
    </PatientClinicalContext.Provider>
  );
};