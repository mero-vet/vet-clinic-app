import React from 'react';

/**
 * OrdersHistory
 * 
 * Displays past and/or current service orders for easy reference.
 * In a real app, this might fetch or subscribe to data from a context or server.
 */
function OrdersHistory() {
  // Example placeholder data
  const orders = [
    { id: 'ORD-1001', type: 'Lab Test', description: 'CBC (Complete Blood Count)', date: '2025-01-10' },
    { id: 'ORD-1002', type: 'Vaccine', description: 'Rabies Booster', date: '2025-01-12' },
  ];

  return (
    <fieldset style={{ margin: '10px' }}>
      <legend>Orders History</legend>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Order ID</th>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Type</th>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{order.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{order.type}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{order.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </fieldset>
  );
}

export default OrdersHistory;