import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceLineItems = () => {
  const { lineItems, removeLineItem, updateLineItem } = useInvoice();

  const handleQtyChange = (id, newQty) => {
    const parsedQty = parseFloat(newQty) || 0;
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, qty: parsedQty };
      updateLineItem(updatedItem);
    }
  };

  const handleDiscountChange = (id, newDiscount) => {
    const parsedDiscount = parseFloat(newDiscount) || 0;
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, discount: parsedDiscount };
      updateLineItem(updatedItem);
    }
  };

  const handleTaxChange = (id, checked) => {
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, tax: checked };
      updateLineItem(updatedItem);
    }
  };

  const handlePriceChange = (id, newPrice) => {
    const parsedPrice = parseFloat(newPrice) || 0;
    const existingItem = lineItems.find((li) => li.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem, price: parsedPrice };
      updateLineItem(updatedItem);
    }
  };

  return (
    <fieldset>
      <legend>Line Items</legend>
      <table className="services-table">
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Patient ID</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Line Total</th>
            <th>Remove</th>
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
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) =>
                        handleDiscountChange(item.id, e.target.value)
                      }
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.tax}
                      onChange={(e) => handleTaxChange(item.id, e.target.checked)}
                    />
                  </td>
                  <td>${lineTotal.toFixed(2)}</td>
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