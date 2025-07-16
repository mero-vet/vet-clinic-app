import React from 'react';

const InvoiceActions = () => {
  const handleSaveDraft = () => {
    alert('Invoice draft saved (placeholder)');
  };

  const handlePrint = () => {
    alert('Printing invoice (placeholder)');
  };

  const handleCancel = () => {
    alert('Cancelling invoice (placeholder)');
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button 
        id="invoice-save-draft-button"
        className="windows-button" 
        onClick={handleSaveDraft}
        data-testid="invoice-save-draft-button"
        aria-label="Save invoice as draft"
      >
        Save Draft
      </button>
      <button 
        id="invoice-print-button"
        className="windows-button" 
        onClick={handlePrint}
        data-testid="invoice-print-button"
        aria-label="Print invoice"
      >
        Print
      </button>
      <button 
        id="invoice-cancel-button"
        className="windows-button" 
        onClick={handleCancel}
        data-testid="invoice-cancel-button"
        aria-label="Cancel invoice creation"
      >
        Cancel
      </button>
    </div>
  );
};

export default InvoiceActions;