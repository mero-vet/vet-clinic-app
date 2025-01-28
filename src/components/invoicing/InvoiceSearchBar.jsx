import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';

/**
 * InvoiceSearchBar
 * Mimics searching or adding an item to the invoice by ID or description.
 */
const InvoiceSearchBar = () => {
  const { addLineItem } = useInvoice();
  const [searchValue, setSearchValue] = useState('');

  const handleAddItem = () => {
    if (searchValue.trim()) {
      // In real scenario, you'd fetch or lookup item data
      // Here we'll just add a placeholder item
      const newItem = {
        id: searchValue.trim(),
        description: `Item ${searchValue.trim()}`,
        qty: 1,
        price: 50.0,
        discount: 0,
        tax: false
      };
      addLineItem(newItem);
      setSearchValue('');
    }
  };

  return (
    <fieldset>
      <legend>Add Item</legend>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Item ID or Description"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: '200px' }}
        />
        <button className="windows-button" onClick={handleAddItem}>
          Add
        </button>
      </div>
    </fieldset>
  );
};

export default InvoiceSearchBar;