import React from 'react';

function ServicesCatalog() {
  // Example placeholder data
  const availableServices = [
    { id: 'LAB001', name: 'Blood Test - CBC' },
    { id: 'LAB002', name: 'Fecal Exam' },
    { id: 'VACC001', name: 'Rabies Vaccine' },
    { id: 'VACC002', name: 'Distemper/Parvo Vaccine' },
  ];

  return (
    <fieldset style={{ margin: '10px' }}>
      <legend>Available Services</legend>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Service ID</th>
            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Name</th>
          </tr>
        </thead>
        <tbody>
          {availableServices.map((service) => (
            <tr key={service.id}>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{service.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{service.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </fieldset>
  );
}

export default ServicesCatalog;