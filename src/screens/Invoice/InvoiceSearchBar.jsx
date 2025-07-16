import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceSearchBar = () => {
  const { addLineItem, updateClientId, updatePatientId } = useInvoice();
  const [searchData, setSearchData] = useState({
    clientId: '',
    patientId: '',
    itemDescription: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update client and patient IDs in context
    if (name === 'clientId') {
      updateClientId(value);
    } else if (name === 'patientId') {
      updatePatientId(value);
    }
  };

  const handleAddItem = () => {
    if (searchData.itemDescription.trim()) {
      const newItem = {
        description: searchData.itemDescription.trim()
      };
      addLineItem(newItem);
      // Only clear the item description, keep the client and patient IDs
      setSearchData(prev => ({
        ...prev,
        itemDescription: ''
      }));
    }
  };

  return (
    <fieldset>
      <legend>Invoice Details</legend>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div>
          <label htmlFor="invoice-client-id">Client ID:&nbsp;</label>
          <input
            id="invoice-client-id"
            type="text"
            name="clientId"
            value={searchData.clientId}
            onChange={handleChange}
            required
            data-testid="invoice-client-id-input"
            aria-label="Client ID for invoice"
            aria-required="true"
            style={{ width: '120px' }}
          />
        </div>
        <div>
          <label htmlFor="invoice-patient-id">Patient ID:&nbsp;</label>
          <input
            id="invoice-patient-id"
            type="text"
            name="patientId"
            value={searchData.patientId}
            onChange={handleChange}
            required
            data-testid="invoice-patient-id-input"
            aria-label="Patient ID for invoice"
            aria-required="true"
            style={{ width: '120px' }}
          />
        </div>
        <div>
          <label htmlFor="invoice-item-description">Item Description:&nbsp;</label>
          <input
            id="invoice-item-description"
            type="text"
            name="itemDescription"
            value={searchData.itemDescription}
            onChange={handleChange}
            data-testid="invoice-item-description-input"
            aria-label="Description of item to add to invoice"
            placeholder="Enter item description"
            style={{ width: '200px' }}
          />
        </div>
        <div>
          <label htmlFor="invoice-date">Date:&nbsp;</label>
          <input
            id="invoice-date"
            type="date"
            name="date"
            value={searchData.date}
            onChange={handleChange}
            data-testid="invoice-date-input"
            aria-label="Invoice date"
          />
        </div>
      </div>
      <button
        id="invoice-add-item-button"
        className="windows-button"
        onClick={handleAddItem}
        disabled={!searchData.clientId || !searchData.patientId || !searchData.itemDescription}
        data-testid="invoice-add-item-button"
        aria-label="Add item to invoice"
        aria-disabled={!searchData.clientId || !searchData.patientId || !searchData.itemDescription}
      >
        Add Item
      </button>
    </fieldset>
  );
};

export default InvoiceSearchBar;