import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceSearchBar = () => {
  const { addLineItem } = useInvoice();
  const [searchData, setSearchData] = useState({
    clientId: '',
    patientId: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    if (searchData.clientId.trim() && searchData.patientId.trim()) {
      // In real scenario, you'd fetch or lookup item data
      // Here we'll just add a placeholder item
      const newItem = {
        id: searchData.clientId.trim(),
        patientId: searchData.patientId.trim(),
        description: `Item ${searchData.clientId.trim()}`,
        qty: 1,
        price: 50.0,
        discount: 0,
        tax: false
      };
      addLineItem(newItem);
      setSearchData({
        clientId: '',
        patientId: '',
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0]
      });
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
          <label>Item:&nbsp;</label>
          <input
            type="text"
            name="invoiceNumber"
            value={searchData.invoiceNumber}
            onChange={handleChange}
            style={{ width: '120px' }}
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
      <button className="windows-button" onClick={handleAddItem}>
        Add
      </button>
    </fieldset>
  );
};

export default InvoiceSearchBar;