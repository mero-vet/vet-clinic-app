import React, { useState } from 'react';

function CancelModal({ appointment, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(appointment.id, reason);
    }
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
        <h3 style={{ marginTop: 0 }}>Cancel Appointment</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <p>Are you sure you want to cancel the appointment for:</p>
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
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Cancellation Reason:
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '80px',
              resize: 'vertical'
            }}
            autoFocus
          />
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
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: reason.trim() ? '#dc3545' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: reason.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;