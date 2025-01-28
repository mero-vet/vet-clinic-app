import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceTotals = () => {
  const { subtotal, totalDiscount, taxAmount, grandTotal } = useInvoice();

  return (
    <fieldset>
      <legend>Totals</legend>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div>
          <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
        </div>
        <div>
          <strong>Discounts:</strong> -${totalDiscount.toFixed(2)}
        </div>
        <div>
          <strong>Tax:</strong> +${taxAmount.toFixed(2)}
        </div>
        <hr />
        <div>
          <strong>Grand Total:</strong> ${grandTotal.toFixed(2)}
        </div>
      </div>
    </fieldset>
  );
};

export default InvoiceTotals;