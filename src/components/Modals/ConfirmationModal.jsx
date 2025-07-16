import React, { useState } from 'react';

function ConfirmationModal({ appointment, onConfirm, onCancel }) {
  const [method, setMethod] = useState('email');

  const handleConfirm = () => {
    onConfirm(appointment.id, method);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{ marginTop: 0 }}>Send Appointment Confirmation</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <p>Send confirmation for:</p>
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <strong>{appointment.patient}</strong><br />
            {appointment.date} at {appointment.time}<br />
            with {appointment.staff}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Select confirmation method:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value="email"
                checked={method === 'email'}
                onChange={(e) => setMethod(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              Email
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value="sms"
                checked={method === 'sms'}
                onChange={(e) => setMethod(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              SMS/Text Message
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value="both"
                checked={method === 'both'}
                onChange={(e) => setMethod(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              Both Email and SMS
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;