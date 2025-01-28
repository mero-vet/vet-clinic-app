import React from 'react';
import { InvoiceProvider } from '../context/InvoiceContext';
import InvoiceSearchBar from './Invoice/InvoiceSearchBar';
import InvoiceLineItems from './Invoice/InvoiceLineItems';
import InvoiceTotals from './Invoice/InvoiceTotals';
import InvoiceActions from './Invoice/InvoiceActions';

import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';

const InvoiceScreen = () => {
  return (
    <InvoiceProvider>
      <div className="windows-classic">
        <div className="window" style={{ margin: '0' }}>
          <div className="title-bar">
            <div className="title-bar-text">Invoice - Drafting</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>

          <div className="window-body" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <InvoiceSearchBar />
              <InvoiceLineItems />
              <InvoiceTotals />
              <InvoiceActions />
            </div>
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
};

export default InvoiceScreen;