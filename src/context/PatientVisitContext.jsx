import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const PatientVisitContext = createContext();

export const usePatientVisit = () => {
  const context = useContext(PatientVisitContext);
  if (!context) {
    throw new Error('usePatientVisit must be used within a PatientVisitProvider');
  }
  return context;
};

export const PatientVisitProvider = ({ children }) => {
  const [visitData, setVisitData] = useState({
    visitId: '',
    primaryReason: '',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: '',
    referralRecheck: false,
    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',
    appointmentTime: '',
    visitNotes: [],
    visitCharges: [],
    followUpDate: '',
    triageLevel: '',
    waitTime: 0
  });

  const [visitHistory, setVisitHistory] = useState([]);

  const updateVisitData = useCallback((updates) => {
    setVisitData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const checkInPatient = useCallback((checkInData) => {
    const now = new Date().toISOString();
    setVisitData(prev => ({
      ...prev,
      status: 'Checked In',
      checkInDate: now,
      ...checkInData
    }));
  }, []);

  const checkOutPatient = useCallback(() => {
    const now = new Date().toISOString();
    setVisitData(prev => ({
      ...prev,
      status: 'Checked Out',
      checkOutDate: now
    }));
  }, []);

  const addVisitNote = useCallback((note) => {
    setVisitData(prev => ({
      ...prev,
      visitNotes: [...prev.visitNotes, {
        ...note,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }]
    }));
  }, []);

  const completeVisit = useCallback(() => {
    const completedVisit = {
      ...visitData,
      completedDate: new Date().toISOString()
    };
    setVisitHistory(prev => [...prev, completedVisit]);
    resetVisitData();
  }, [visitData]);

  const resetVisitData = useCallback(() => {
    setVisitData({
      visitId: '',
      primaryReason: '',
      secondaryReason: '',
      room: '',
      visitType: 'Outpatient',
      status: '',
      ward: '',
      cage: '',
      rdvmName: '',
      referralRecheck: false,
      staffId: '',
      checkedInBy: '',
      checkInDate: '',
      checkOutDate: '',
      appointmentTime: '',
      visitNotes: [],
      visitCharges: [],
      followUpDate: '',
      triageLevel: '',
      waitTime: 0
    });
  }, []);

  const value = useMemo(() => ({
    visitData,
    visitHistory,
    updateVisitData,
    checkInPatient,
    checkOutPatient,
    addVisitNote,
    completeVisit,
    resetVisitData
  }), [visitData, visitHistory, updateVisitData, checkInPatient, checkOutPatient, addVisitNote, completeVisit, resetVisitData]);

  return (
    <PatientVisitContext.Provider value={value}>
      {children}
    </PatientVisitContext.Provider>
  );
};