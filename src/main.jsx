import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PatientProvider } from './context/PatientContext'
import { SchedulingProvider } from './context/SchedulingContext'
import { MedicalRecordsProvider } from './context/MedicalRecordsContext'
import { InventoryProvider } from './context/InventoryContext'
import { CommunicationsProvider } from './context/CommunicationsContext'
import { PharmacyProvider } from './context/PharmacyContext'
import { ReportsProvider } from './context/ReportsContext'
import { PIMSProvider } from './context/PIMSContext'
import { CheckInProvider } from './context/CheckInContext'
import { TestLoggerProvider } from './context/TestLoggerContext'
import '98.css'
import './index.css'
import './styles/pimsThemes.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PIMSProvider>
        <TestLoggerProvider>
          <PatientProvider>
            <SchedulingProvider>
              <CheckInProvider>
                <MedicalRecordsProvider>
                  <InventoryProvider>
                    <CommunicationsProvider>
                      <PharmacyProvider>
                        <ReportsProvider>
                          <App />
                        </ReportsProvider>
                      </PharmacyProvider>
                    </CommunicationsProvider>
                  </InventoryProvider>
                </MedicalRecordsProvider>
              </CheckInProvider>
            </SchedulingProvider>
          </PatientProvider>
        </TestLoggerProvider>
      </PIMSProvider>
    </BrowserRouter>
  </React.StrictMode>
)