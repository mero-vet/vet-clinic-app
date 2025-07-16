import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const PatientDemographicContext = createContext();

export const usePatientDemographic = () => {
  const context = useContext(PatientDemographicContext);
  if (!context) {
    throw new Error('usePatientDemographic must be used within a PatientDemographicProvider');
  }
  return context;
};

export const PatientDemographicProvider = ({ children }) => {
  const [demographicData, setDemographicData] = useState({
    patientId: '',
    patientName: '',
    species: '',
    sex: '',
    breed: '',
    birthDate: '',
    ageYears: '',
    ageMonths: '',
    ageDays: '',
    clientId: '',
    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    emailDeclined: false,
    phoneHome: '',
    phoneExt: '',
    phoneDeclined: false,
    address: '',
    city: '',
    stateProv: '',
    postalCode: '',
    additionalNotes: '',
    alertNotes: ''
  });

  const updateDemographicData = useCallback((updates) => {
    setDemographicData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetDemographicData = useCallback(() => {
    setDemographicData({
      patientId: '',
      patientName: '',
      species: '',
      sex: '',
      breed: '',
      birthDate: '',
      ageYears: '',
      ageMonths: '',
      ageDays: '',
      clientId: '',
      clientFirstName: '',
      clientLastName: '',
      clientEmail: '',
      emailDeclined: false,
      phoneHome: '',
      phoneExt: '',
      phoneDeclined: false,
      address: '',
      city: '',
      stateProv: '',
      postalCode: '',
      additionalNotes: '',
      alertNotes: ''
    });
  }, []);

  const value = useMemo(() => ({
    demographicData,
    updateDemographicData,
    resetDemographicData
  }), [demographicData, updateDemographicData, resetDemographicData]);

  return (
    <PatientDemographicContext.Provider value={value}>
      {children}
    </PatientDemographicContext.Provider>
  );
};