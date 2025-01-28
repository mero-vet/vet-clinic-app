import React, { createContext, useState, useContext } from 'react';

/**
 * InvoiceContext
 * Manages line items, totals, and any invoice-related data for the Invoicing feature.
 */

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [lineItems, setLineItems] = useState([]);
  
  // Example structure for line items:
  // {
  //   id: 'WP1002',
  //   description: 'Wellness Exam',
  //   qty: 1,
  //   price: 53.05,
  //   discount: 0,      // in currency or percentage
  //   tax: false,       // or taxRate
  // }

  const addLineItem = (item) => {
    setLineItems((prev) => [...prev, item]);
  };

  const removeLineItem = (itemId) => {
    setLineItems((prev) => prev.filter((li) => li.id !== itemId));
  };

  const updateLineItem = (updatedItem) => {
    setLineItems((prev) =>
      prev.map((li) => (li.id === updatedItem.id ? updatedItem : li))
    );
  };

  // Simple derived totals
  const subtotal = lineItems.reduce((acc, item) => {
    const lineTotal = item.qty * item.price;
    return acc + lineTotal;
  }, 0);

  const totalDiscount = lineItems.reduce((acc, item) => {
    // For demonstration, assume 'discount' is a currency amount
    return acc + (item.discount || 0);
  }, 0);

  const taxableTotal = lineItems.reduce((acc, item) => {
    const lineTotal = item.qty * item.price - (item.discount || 0);
    return item.tax ? acc + lineTotal : acc;
  }, 0);

  // Example tax rate of 8% for taxed items
  const taxAmount = taxableTotal * 0.08;

  const grandTotal = subtotal - totalDiscount + taxAmount;

  const value = {
    lineItems,
    addLineItem,
    removeLineItem,
    updateLineItem,
    subtotal,
    totalDiscount,
    taxAmount,
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