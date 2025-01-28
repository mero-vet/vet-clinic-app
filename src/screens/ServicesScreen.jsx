import React from 'react';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';
import ServicesCatalog from './Services/ServicesCatalog';
import LabTestOrderForm from './Services/LabTestOrderForm';
import VaccineOrderForm from './Services/VaccineOrderForm';
import OrdersHistory from './Services/OrdersHistory';

function ServicesScreen() {
  return (
    <div className="windows-classic" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="window" style={{ margin: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="title-bar">
          <div className="title-bar-text">Order Services</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body" style={{ padding: '12px', height: 'calc(100% - 32px)', overflowY: 'auto' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>ServicesScreen</strong> - Use the forms below to order lab tests, vaccines, or view the services catalog.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            height: 'calc(100% - 32px)',
            alignItems: 'start'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
              gap: '8px',
              height: '100%'
            }}>
              <LabTestOrderForm />
              <OrdersHistory />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
              gap: '8px',
              height: '100%'
            }}>
              <VaccineOrderForm />
              <ServicesCatalog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesScreen;