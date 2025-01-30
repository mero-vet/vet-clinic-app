import React, { createContext, useState, useContext } from 'react';

/**
 * InvoiceContext
 * Manages line items, totals, and any invoice-related data for the Invoicing feature.
 */

const InvoiceContext = createContext();

const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const InvoiceProvider = ({ children }) => {
  const [lineItems, setLineItems] = useState([]);
  const [clientId, setClientId] = useState('');
  const [patientId, setPatientId] = useState('');

  // Example structure for line items:
  // {
  //   id: '123456',           // random 6-digit string
  //   description: 'Item description',
  //   qty: 1,
  //   price: 53.05,
  //   discount: 0,
  //   tax: 0,                // percentage
  // }

  const addLineItem = (item) => {
    const newItem = {
      ...item,
      id: generateRandomId(),
      qty: 1,
      price: 50.00,
      discount: 0,
      tax: 0
    };
    setLineItems((prev) => [...prev, newItem]);
  };

  const removeLineItem = (itemId) => {
    setLineItems((prev) => prev.filter((li) => li.id !== itemId));
  };

  const updateLineItem = (updatedItem) => {
    setLineItems((prev) =>
      prev.map((li) => (li.id === updatedItem.id ? updatedItem : li))
    );
  };

  const updateClientId = (id) => {
    setClientId(id);
  };

  const updatePatientId = (id) => {
    setPatientId(id);
  };

  // Simple derived totals
  const subtotal = lineItems.reduce((acc, item) => {
    const lineTotal = item.qty * item.price;
    return acc + lineTotal;
  }, 0);

  const totalDiscount = lineItems.reduce((acc, item) => {
    return acc + (item.discount || 0);
  }, 0);

  const taxableTotal = lineItems.reduce((acc, item) => {
    const lineTotal = item.qty * item.price - (item.discount || 0);
    return item.tax ? acc + (lineTotal * item.tax / 100) : acc;
  }, 0);

  const grandTotal = subtotal - totalDiscount + taxableTotal;

  const value = {
    lineItems,
    clientId,
    patientId,
    addLineItem,
    removeLineItem,
    updateLineItem,
    updateClientId,
    updatePatientId,
    subtotal,
    totalDiscount,
    taxAmount: taxableTotal,
    grandTotal
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};