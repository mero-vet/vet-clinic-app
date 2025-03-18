import React, { createContext, useContext, useState } from 'react';

const PatientContext = createContext();

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState({
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
    additionalNotes: '',
    alertNotes: '',

    // Visit Info
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

  // Function to set mock data for testing/demo
  const setMockPatientData = () => {
    setPatientData({
      clientId: 'C1001',
      clientFirstName: 'Remy',
      clientLastName: 'Olson',
      clientEmail: 'remy@joinmero.com',
      emailDeclined: false,
      phoneHome: '(415) 200-6597',
      phoneExt: '',
      phoneDeclined: false,

      balanceDue: '250.00',
      address: '4317 SE Clinton St',
      city: 'Portland',
      stateProv: 'OR',
      postalCode: '97206',

      patientId: 'P2001',
      patientName: 'Wilson',
      species: 'Canine',
      sex: 'Male',
      breed: 'German Shepherd mix',
      birthDate: '2021-02-12',
      ageYears: '3',
      ageMonths: '11',
      ageDays: '20',
      weightDate: '2024-12-15',
      weight: '69.5',
      additionalNotes: 'Friendly, good with other dogs',
      alertNotes: 'Bad response to rimadyl',

      primaryReason: 'Annual Checkup',
      secondaryReason: 'Vaccine Update',
      room: 'Exam 3',
      visitType: 'Outpatient',
      status: 'Checked In',
      ward: '',
      cage: '',
      rdvmName: 'Dr. Williams',
      referralRecheck: false,

      staffId: 'S101',
      checkedInBy: 'Jessica Smith',
      checkInDate: '2024-03-18T09:00',
      checkOutDate: '',
    });
  };

  return (
    <PatientContext.Provider value={{ patientData, setPatientData, setMockPatientData }}>
      {children}
    </PatientContext.Provider>
  );
};
