import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { withScreenErrorBoundary } from './components/ErrorBoundary/withErrorBoundary';

// Import screens
import PatientCheckinScreenBase from './screens/PatientCheckinScreen';
import PatientCheckinScreenEnhancedBase from './screens/PatientCheckinScreenEnhanced';
import ServicesScreenBase from './screens/ServicesScreen';
import CreateNewClientScreenBase from './screens/CreateNewClientScreen';
import InvoiceScreenBase from './screens/InvoiceScreen';
import NoteScreenBase from './screens/NoteScreen';
import SchedulingScreenBase from './screens/SchedulingScreen';
import MedicalRecordsScreenBase from './screens/MedicalRecordsScreen';
import InventoryScreenBase from './screens/InventoryScreen';
import CommunicationsScreenBase from './screens/CommunicationsScreen';
import PharmacyScreenBase from './screens/PharmacyScreen';
import ReportsScreenBase from './screens/ReportsScreen';
import FeatureNotEnabledScreenBase from './screens/FeatureNotEnabledScreen';
import DoctorExamScreenBase from './screens/DoctorExam/DoctorExamScreen';
import DiagnosticsScreenBase from './screens/DiagnosticsScreen';
import ReplayViewerBase from './components/ReplayViewer';

// Covetrus XP pages
import Dashboard from './pages/Dashboard';
import PatientChart from './pages/PatientChart';
import RecordNoteEditor from './pages/RecordNoteEditor';
import PrintRecord from './pages/PrintRecord';

// Wrap all screens with error boundaries for PRD-20 Phase 2A
const PatientCheckinScreen = withScreenErrorBoundary(PatientCheckinScreenBase);
const PatientCheckinScreenEnhanced = withScreenErrorBoundary(PatientCheckinScreenEnhancedBase);
const ServicesScreen = withScreenErrorBoundary(ServicesScreenBase);
const CreateNewClientScreen = withScreenErrorBoundary(CreateNewClientScreenBase);
const InvoiceScreen = withScreenErrorBoundary(InvoiceScreenBase);
const NoteScreen = withScreenErrorBoundary(NoteScreenBase);
const SchedulingScreen = withScreenErrorBoundary(SchedulingScreenBase);
const MedicalRecordsScreen = withScreenErrorBoundary(MedicalRecordsScreenBase);
const InventoryScreen = withScreenErrorBoundary(InventoryScreenBase);
const CommunicationsScreen = withScreenErrorBoundary(CommunicationsScreenBase);
const PharmacyScreen = withScreenErrorBoundary(PharmacyScreenBase);
const ReportsScreen = withScreenErrorBoundary(ReportsScreenBase);
const FeatureNotEnabledScreen = withScreenErrorBoundary(FeatureNotEnabledScreenBase);
const DoctorExamScreen = withScreenErrorBoundary(DoctorExamScreenBase);
const DiagnosticsScreen = withScreenErrorBoundary(DiagnosticsScreenBase);
const ReplayViewer = withScreenErrorBoundary(ReplayViewerBase);

// Import Layout Manager
import LayoutManagerBase from './components/LayoutManager';
const LayoutManager = withScreenErrorBoundary(LayoutManagerBase, {
  componentName: 'LayoutManager',
  errorTitle: 'Layout Error',
  errorMessage: 'The application layout encountered an error. Please refresh the page.',
});

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
              {/* Covetrus overrides root to Dashboard */}
              {pims === 'covetrus' ? (
                <Route path={`/${pims}`} element={<Dashboard key={`${pims}-dashboard`} />} />
              ) : (
                <Route path={`/${pims}`} element={<PatientCheckinScreenEnhanced key={`${pims}-checkin`} />} />
              )}
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
              {/* Covetrus additional routes */}
              {pims === 'covetrus' && (
                <>
                  <Route path="/covetrus/patient/:id" element={<PatientChart />} />
                  <Route path="/covetrus/patient/:id/record/new" element={<RecordNoteEditor />} />
                  <Route path="/covetrus/record/:noteId" element={<RecordNoteEditor />} />
                  <Route path="/covetrus/print/record/:noteId" element={<PrintRecord />} />
                </>
              )}
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