import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceLineItems = () => {
  const { lineItems, removeLineItem, updateLineItem, clientId, patientId } = useInvoice();

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleQtyChange = (id, newQty) => {
    const parsedQty = parseFloat(newQty) || 1;
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, qty: parsedQty };
      updateLineItem(updatedItem);
    }
  };

  const handleDescriptionChange = (id, newDescription) => {
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, description: newDescription };
      updateLineItem(updatedItem);
    }
  };

  const handleDiscountChange = (id, newDiscount) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = newDiscount.replace(/[^\d]/g, '');
    const parsedDiscount = (parseFloat(numericValue) || 0) / 100;
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, discount: parsedDiscount };
      updateLineItem(updatedItem);
    }
  };

  const handleTaxChange = (id, newTax) => {
    const parsedTax = parseFloat(newTax) || 0;
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, tax: parsedTax };
      updateLineItem(updatedItem);
    }
  };

  const handlePriceChange = (id, newPrice) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = newPrice.replace(/[^\d]/g, '');
    const parsedPrice = (parseFloat(numericValue) || 5000) / 100;
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, price: parsedPrice };
      updateLineItem(updatedItem);
    }
  };

  const numberInputStyle = {
    width: '60px',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'textfield',
    appearance: 'textfield',
  };

  const formatDollarAmount = (value) => {
    return (value || 0).toFixed(2);
  };

  return (
    <fieldset>
      <legend>Line Items</legend>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div><strong>Client ID:</strong> {clientId || 'Not selected'}</div>
          <div><strong>Patient ID:</strong> {patientId || 'Not selected'}</div>
        </div>
      </div>
      <table className="services-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Tax %</th>
            <th>Line Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>
                No items in invoice
              </td>
            </tr>
          ) : (
            lineItems.map((item) => {
              const lineTotal = (item.qty * item.price) - (item.discount || 0);
              const taxAmount = lineTotal * (item.tax || 0) / 100;
              const totalWithTax = lineTotal + taxAmount;
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                      onFocus={handleFocus}
                      style={{ width: '200px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      onFocus={handleFocus}
                      style={numberInputStyle}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={formatDollarAmount(item.price)}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      onFocus={handleFocus}
                      style={numberInputStyle}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={formatDollarAmount(item.discount)}
                      onChange={(e) => handleDiscountChange(item.id, e.target.value)}
                      onFocus={handleFocus}
                      style={numberInputStyle}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.tax || 0}
                      onChange={(e) => handleTaxChange(item.id, e.target.value)}
                      onFocus={handleFocus}
                      style={numberInputStyle}
                    />
                  </td>
                  <td>${totalWithTax.toFixed(2)}</td>
                  <td>
                    <button
                      className="windows-button"
                      onClick={() => removeLineItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </fieldset>
  );
};

export default InvoiceLineItems;