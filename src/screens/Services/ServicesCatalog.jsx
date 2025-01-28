import React from 'react';

function ServicesCatalog() {
  // Comprehensive list of veterinary services
  const availableServices = [
    // Laboratory Tests
    { id: 'LAB001', name: 'Blood Test - CBC (Complete Blood Count)' },
    { id: 'LAB002', name: 'Chemistry Panel' },
    { id: 'LAB003', name: 'Thyroid Testing (T4)' },
    { id: 'LAB004', name: 'Fecal Examination' },
    { id: 'LAB005', name: 'Urinalysis' },
    { id: 'LAB006', name: 'Heartworm Test' },
    { id: 'LAB007', name: 'FeLV/FIV Test' },

    // Vaccinations
    { id: 'VAC001', name: 'Rabies Vaccine' },
    { id: 'VAC002', name: 'DHPP (Distemper/Parvo) Vaccine' },
    { id: 'VAC003', name: 'Bordetella Vaccine' },
    { id: 'VAC004', name: 'Leptospirosis Vaccine' },
    { id: 'VAC005', name: 'FVRCP (Feline Distemper) Vaccine' },
    { id: 'VAC006', name: 'FeLV (Feline Leukemia) Vaccine' },

    // Preventive Care
    { id: 'PRV001', name: 'Annual Wellness Exam' },
    { id: 'PRV002', name: 'Dental Cleaning' },
    { id: 'PRV003', name: 'Microchipping' },
    { id: 'PRV004', name: 'Parasite Prevention Consultation' },

    // Diagnostic Imaging
    { id: 'IMG001', name: 'Digital X-Ray' },
    { id: 'IMG002', name: 'Ultrasound' },
    { id: 'IMG003', name: 'Dental X-Ray' },

    // Surgical Services
    { id: 'SRG001', name: 'Spay/Neuter Surgery' },
    { id: 'SRG002', name: 'Mass Removal' },
    { id: 'SRG003', name: 'Dental Extractions' }
  ];

  return (
    <fieldset style={{ margin: '10px' }}>
      <legend>Available Services</legend>
      <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '4px', position: 'sticky', top: 0 }}>Service ID</th>
              <th style={{ border: '1px solid #ccc', padding: '4px', position: 'sticky', top: 0 }}>Name</th>
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
      </div>
    </fieldset>
  );
}

export default ServicesCatalog;