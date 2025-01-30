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
          <label>Client ID:&nbsp;</label>
          <input
            type="text"
            name="clientId"
            value={searchData.clientId}
            onChange={handleChange}
            required
            style={{ width: '120px' }}
          />
        </div>
        <div>
          <label>Patient ID:&nbsp;</label>
          <input
            type="text"
            name="patientId"
            value={searchData.patientId}
            onChange={handleChange}
            required
            style={{ width: '120px' }}
          />
        </div>
        <div>
          <label>Item Description:&nbsp;</label>
          <input
            type="text"
            name="itemDescription"
            value={searchData.itemDescription}
            onChange={handleChange}
            style={{ width: '200px' }}
          />
        </div>
        <div>
          <label>Date:&nbsp;</label>
          <input
            type="date"
            name="date"
            value={searchData.date}
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        className="windows-button"
        onClick={handleAddItem}
        disabled={!searchData.clientId || !searchData.patientId || !searchData.itemDescription}
      >
        Add Item
      </button>
    </fieldset>
  );
};

export default InvoiceSearchBar;