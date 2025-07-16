import React from 'react';
import { PatientDemographicProvider } from './PatientDemographicContext';
import { PatientClinicalProvider } from './PatientClinicalContext';
import { PatientVisitProvider } from './PatientVisitContext';

export const CombinedPatientProvider = ({ children }) => {
  return (
    <PatientDemographicProvider>
      <PatientClinicalProvider>
        <PatientVisitProvider>
          {children}
        </PatientVisitProvider>
      </PatientClinicalProvider>
    </PatientDemographicProvider>
  );
};