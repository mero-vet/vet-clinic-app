import React from 'react';

function ClientCreationSuccessScreen({ client, patients, onNavigateToCheckin, onAddMorePatients, onClose }) {
  const getSexDisplay = (sex) => {
    const sexMap = {
      'M': 'Male (Intact)',
      'MN': 'Male (Neutered)',
      'F': 'Female (Intact)',
      'FS': 'Female (Spayed)'
    };
    return sexMap[sex] || sex;
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 2) {
      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
      return age === 0 ? `${months} months` : `${age} year${age > 1 ? 's' : ''} ${months} months`;
    }
    
    return `${age} years`;
  };

  return (
    <div style={{ 
      marginTop: '20px', 
      border: '2px solid #000', 
      padding: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          fontSize: '3rem', 
          color: '#28a745',
          marginBottom: '1rem'
        }}>
          ✓
        </div>
        <h2 style={{ color: '#28a745' }}>Registration Complete!</h2>
      </div>

      {client && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Client Information</h3>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '1rem', 
            border: '1px solid #ccc',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>Client ID:</strong> {client.clientId}
              </div>
              <div>
                <strong>Name:</strong> {client.firstName} {client.lastName}
              </div>
              <div>
                <strong>Email:</strong> {client.email}
              </div>
              <div>
                <strong>Phone:</strong> {client.phone}
              </div>
              <div>
                <strong>Address:</strong><br />
                {client.street}<br />
                {client.city}, {client.state} {client.zip}
              </div>
              <div>
                <strong>Preferred Contact:</strong> {client.preferredContact}
                {client.notes && (
                  <>
                    <br />
                    <strong>Notes:</strong> {client.notes}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {patients && patients.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Registered Patients</h3>
          {patients.map((patient, index) => (
            <div 
              key={index}
              style={{ 
                backgroundColor: '#fff', 
                padding: '1rem', 
                border: '1px solid #ccc',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>Patient ID:</strong> {patient.patientId}
                </div>
                <div>
                  <strong>Name:</strong> {patient.name}
                </div>
                <div>
                  <strong>Species:</strong> {patient.species.charAt(0).toUpperCase() + patient.species.slice(1)}
                </div>
                <div>
                  <strong>Breed:</strong> {patient.breed}
                </div>
                <div>
                  <strong>Sex:</strong> {getSexDisplay(patient.sex)}
                </div>
                <div>
                  <strong>Age:</strong> {calculateAge(patient.dateOfBirth)}
                </div>
                {patient.microchip && (
                  <div>
                    <strong>Microchip:</strong> {patient.microchip}
                  </div>
                )}
                {patient.alerts && patient.alerts.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Alerts:</strong> {patient.alerts.join(', ')}
                  </div>
                )}
              </div>
              
              {patient.reminders && patient.reminders.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                  <strong>Generated Reminders:</strong>
                  <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    {patient.reminders.slice(0, 3).map((reminder, rIndex) => (
                      <li key={rIndex}>
                        {reminder.name} - Due: {new Date(reminder.dueDate).toLocaleDateString()}
                      </li>
                    ))}
                    {patient.reminders.length > 3 && (
                      <li style={{ fontStyle: 'italic' }}>
                        ...and {patient.reminders.length - 3} more reminders
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#e9ecef',
        border: '1px solid #dee2e6',
        borderRadius: '4px'
      }}>
        <h4>Next Steps</h4>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Client and patient records have been created</li>
          <li>Initial vaccination reminders have been scheduled</li>
          <li>Client will receive welcome communication based on their preference</li>
          {patients.length === 0 && <li>Remember to add patient information when they bring in their pet</li>}
        </ul>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '2rem',
        justifyContent: 'center'
      }}>
        {patients.length > 0 && (
          <button
            onClick={onNavigateToCheckin}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#000080',
              color: '#fff',
              border: '2px solid #000',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Patient Check-In
          </button>
        )}
        
        <button
          onClick={onAddMorePatients}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#fff',
            color: '#000',
            border: '2px solid #000',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Add More Patients
        </button>
        
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#fff',
            color: '#666',
            border: '2px solid #666',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default ClientCreationSuccessScreen;