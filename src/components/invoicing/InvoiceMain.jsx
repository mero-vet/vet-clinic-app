import React from 'react';
import { InvoiceProvider } from '../../context/InvoiceContext';
import InvoiceSearchBar from './InvoiceSearchBar';
import InvoiceLineItems from './InvoiceLineItems';
import InvoiceTotals from './InvoiceTotals';
import InvoiceActions from './InvoiceActions';

import '../../styles/WindowsClassic.css';
import '../../styles/PatientForms.css';

/**
 * InvoiceMain
 * A single window-like container that brings together the invoice search, line items, totals, and actions.
 */
const InvoiceMain = () => {
  return (
    <InvoiceProvider>
      <div className="windows-classic">
        <div className="window">
          <div className="title-bar">
            <div className="title-bar-text">Invoice - Drafting</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>

          <div className="window-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Search bar to add new line items */}
              <InvoiceSearchBar />

              {/* Table of line items */}
              <InvoiceLineItems />

              {/* Totals section */}
              <InvoiceTotals />

              {/* Actions (Save, Print, Cancel, etc.) */}
              <InvoiceActions />
            </div>
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
};

export default InvoiceMain;