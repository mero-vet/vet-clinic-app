import React, { useState } from 'react';

const PatientVisitList = () => {
  const [services, setServices] = useState([
    {
      id: 'WP1002',
      description: 'WP Exam - Annual Wellness',
      qty: 1.00,
      amount: 53.05,
      disc: 'No',
      tax: 'No',
      staff: 1,
      date: '10/22/2020'
    },
    // Add other services
  ]);

  return (
    <div className="visit-list-container">
      <div className="patient-header">
        <div className="patient-info">
          <img src="dog-placeholder.jpg" alt="Patient" className="patient-image" />
          <div>
            <div>ID: 66927 VALENTINE</div>
            <div>Dachshund, Miniature | Female</div>
            <div>9 Yrs, 6 Mos. 12.00 pounds</div>
          </div>
        </div>
        
        <div className="owner-info">
          <div>Owner: Martin Johnson</div>
          <div>Credit code: Accept All Payments $0.00</div>
          <div>Payment: 4/1/2020 $78.71 American Express</div>
        </div>
      </div>

      <table className="services-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Disc</th>
            <th>Tax</th>
            <th>Staff</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.description}</td>
              <td>{service.qty}</td>
              <td>${service.amount}</td>
              <td>{service.disc}</td>
              <td>{service.tax}</td>
              <td>{service.staff}</td>
              <td>{service.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <div>Total: $543.51</div>
        <div>Discounts: $351.87</div>
        <div>Taxes: $2.60</div>
        <div>Total: $194.24</div>
      </div>

      <div className="action-buttons">
        <button>OK</button>
        <button>Cancel</button>
        <button>Perform</button>
        <button>Sort by Date</button>
        <button>Departing</button>
        <button>Pharmacy</button>
        <button>Special</button>
        <button>Travel Sheet</button>
        <button>Print</button>
        <button>Invoice</button>
        <button>Discount</button>
      </div>
    </div>
  );
};

export default PatientVisitList; 