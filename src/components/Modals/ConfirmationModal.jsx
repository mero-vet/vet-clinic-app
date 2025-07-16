import React, { useState, useRef, useEffect } from 'react';

function ConfirmationModal({ appointment, onConfirm, onCancel }) {
  const [method, setMethod] = useState('email');
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Implement focus trap
  useEffect(() => {
    // Store current focus
    previousFocusRef.current = document.activeElement;

    // Focus the modal
    if (modalRef.current) {
      const firstFocusable = modalRef.current.querySelector('input[type="radio"]');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [onCancel]);

  const handleConfirm = () => {
    onConfirm(appointment.id, method);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
      data-testid="confirmation-modal-overlay"
      style={{
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
      <div 
        ref={modalRef}
        data-testid="confirmation-modal-content"
        style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 
          id="confirmation-modal-title"
          style={{ marginTop: 0 }}
        >
          Send Appointment Confirmation
        </h3>
        
        <div 
          id="confirmation-modal-description"
          style={{ marginBottom: '15px' }}
        >
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
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend 
              id="confirmation-method-legend"
              style={{ display: 'block', marginBottom: '10px', padding: 0 }}
            >
              Select confirmation method:
            </legend>
            <div 
              role="radiogroup"
              aria-labelledby="confirmation-method-legend"
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <label 
                htmlFor="confirmation-method-email"
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <input
                  id="confirmation-method-email"
                  type="radio"
                  name="confirmation-method"
                  value="email"
                  checked={method === 'email'}
                  onChange={(e) => setMethod(e.target.value)}
                  data-testid="confirmation-method-email"
                  aria-describedby="email-description"
                  style={{ marginRight: '8px' }}
                />
                <span id="email-description">Email</span>
              </label>
              <label 
                htmlFor="confirmation-method-sms"
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <input
                  id="confirmation-method-sms"
                  type="radio"
                  name="confirmation-method"
                  value="sms"
                  checked={method === 'sms'}
                  onChange={(e) => setMethod(e.target.value)}
                  data-testid="confirmation-method-sms"
                  aria-describedby="sms-description"
                  style={{ marginRight: '8px' }}
                />
                <span id="sms-description">SMS/Text Message</span>
              </label>
              <label 
                htmlFor="confirmation-method-both"
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <input
                  id="confirmation-method-both"
                  type="radio"
                  name="confirmation-method"
                  value="both"
                  checked={method === 'both'}
                  onChange={(e) => setMethod(e.target.value)}
                  data-testid="confirmation-method-both"
                  aria-describedby="both-description"
                  style={{ marginRight: '8px' }}
                />
                <span id="both-description">Both Email and SMS</span>
              </label>
            </div>
          </fieldset>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            id="confirmation-modal-cancel"
            onClick={onCancel}
            data-testid="confirmation-modal-cancel-button"
            aria-label="Cancel sending confirmation"
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
            id="confirmation-modal-send"
            onClick={handleConfirm}
            data-testid="confirmation-modal-send-button"
            aria-label="Send appointment confirmation"
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