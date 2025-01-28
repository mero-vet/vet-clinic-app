import React from 'react';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';
import ServicesCatalog from './Services/ServicesCatalog';
import LabTestOrderForm from './Services/LabTestOrderForm';
import VaccineOrderForm from './Services/VaccineOrderForm';
import OrdersHistory from './Services/OrdersHistory';

function ServicesScreen() {
  return (
    <div className="windows-classic">
      <div className="window" style={{ margin: '0' }}>
        <div className="title-bar">
          <div className="title-bar-text">Order Services</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body" style={{ padding: '16px' }}>
          <p><strong>ServicesScreen</strong> - Use the forms below to order lab tests, vaccines, or view the services catalog.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
            <div>
              <ServicesCatalog />
              <LabTestOrderForm />
            </div>
            <div>
              <VaccineOrderForm />
              <OrdersHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesScreen;