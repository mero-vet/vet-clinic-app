import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import screens
import PatientCheckinScreen from './screens/PatientCheckinScreen';
import PatientCheckinScreenEnhanced from './screens/PatientCheckinScreenEnhanced';
import ServicesScreen from './screens/ServicesScreen';
import CreateNewClientScreen from './screens/CreateNewClientScreen';
import InvoiceScreen from './screens/InvoiceScreen';
import NoteScreen from './screens/NoteScreen';
import SchedulingScreen from './screens/SchedulingScreen';
import MedicalRecordsScreen from './screens/MedicalRecordsScreen';
import InventoryScreen from './screens/InventoryScreen';
import CommunicationsScreen from './screens/CommunicationsScreen';
import PharmacyScreen from './screens/PharmacyScreen';
import ReportsScreen from './screens/ReportsScreen';
import FeatureNotEnabledScreen from './screens/FeatureNotEnabledScreen';
import DoctorExamScreen from './screens/DoctorExam/DoctorExamScreen';
import DiagnosticsScreen from './screens/DiagnosticsScreen';
import ReplayViewer from './components/ReplayViewer';

// Import Layout Manager
import LayoutManager from './components/LayoutManager';

// Import CSS
import './styles/PatientForms.css';
import './styles/WindowsClassic.css';
import './styles/PatientCheckinEnhanced.css';
import './App.css';

// Create a component wrapper that forces re-render on route change but not on PIMS change
const RouteChangeWrapper = ({ children }) => {
  const location = useLocation();

  // Extract just the route part (after the PIMS name)
  const currentRoute = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';
  }, [location.pathname]);

  return <React.Fragment key={currentRoute}>{children}</React.Fragment>;
};

function App() {
  const location = useLocation();

  // Extract the PIMS and route parts separately for more targeted updates
  const { pims, route } = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return {
      pims: pathSegments[0] || 'cornerstone',
      route: pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '',
    };
  }, [location.pathname]);

  return (
    <RouteChangeWrapper>
      <LayoutManager>
        <Routes key={`${pims}-${route}`}>
          {/* Root redirect to default PIMS */}
          <Route path="/" element={<Navigate to="/cornerstone" replace />} />

          {/* PIMS-specific routes */}
          {['cornerstone', 'avimark', 'easyvet', 'intravet', 'covetrus'].map(pims => (
            <React.Fragment key={pims}>
              <Route path={`/${pims}`} element={<PatientCheckinScreenEnhanced key={`${pims}-checkin`} />} />
              <Route path={`/${pims}/patient-checkin/:patientId`} element={<PatientCheckinScreenEnhanced key={`${pims}-checkin-patient`} />} />
              <Route path={`/${pims}/exam/:patientId`} element={<DoctorExamScreen key={`${pims}-exam`} />} />
              <Route path={`/${pims}/services`} element={<ServicesScreen key={`${pims}-services`} />} />
              <Route path={`/${pims}/services/:patientId`} element={<DiagnosticsScreen key={`${pims}-diagnostics-patient`} />} />
              <Route path={`/${pims}/create-client`} element={<CreateNewClientScreen key={`${pims}-create-client`} />} />
              <Route path={`/${pims}/invoices`} element={<InvoiceScreen key={`${pims}-invoices`} />} />
              <Route path={`/${pims}/invoices/:patientId`} element={<InvoiceScreen key={`${pims}-invoices-patient`} />} />
              <Route path={`/${pims}/notes`} element={<NoteScreen key={`${pims}-notes`} />} />
              <Route path={`/${pims}/scheduler`} element={<SchedulingScreen key={`${pims}-scheduler`} />} />
              <Route path={`/${pims}/records`} element={<MedicalRecordsScreen key={`${pims}-records`} />} />
              <Route path={`/${pims}/inventory`} element={<InventoryScreen key={`${pims}-inventory`} />} />
              <Route path={`/${pims}/communications`} element={<CommunicationsScreen key={`${pims}-communications`} />} />
              <Route path={`/${pims}/pharmacy`} element={<PharmacyScreen key={`${pims}-pharmacy`} />} />
              <Route path={`/${pims}/pharmacy/:patientId`} element={<PharmacyScreen key={`${pims}-pharmacy-patient`} />} />
              <Route path={`/${pims}/reports`} element={<ReportsScreen key={`${pims}-reports`} />} />
            </React.Fragment>
          ))}

          {/* Special routes */}
          <Route path="/replay" element={<ReplayViewer />} />

          {/* Catch-all route for non-implemented features */}
          <Route path="*" element={<FeatureNotEnabledScreen />} />
        </Routes>
      </LayoutManager>
    </RouteChangeWrapper>
  );
}

export default App;