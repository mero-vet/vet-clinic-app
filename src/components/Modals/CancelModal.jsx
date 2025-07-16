import React, { useState, useRef, useEffect } from 'react';

function CancelModal({ appointment, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Implement focus trap
  useEffect(() => {
    // Store current focus
    previousFocusRef.current = document.activeElement;

    // Focus the textarea
    const textarea = document.getElementById('cancel-reason-textarea');
    if (textarea) {
      textarea.focus();
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
    if (reason.trim()) {
      onConfirm(appointment.id, reason);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      aria-describedby="cancel-modal-description"
      data-testid="cancel-modal-overlay"
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
        data-testid="cancel-modal-content"
        style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 
          id="cancel-modal-title"
          style={{ marginTop: 0 }}
        >
          Cancel Appointment
        </h3>
        
        <div 
          id="cancel-modal-description"
          style={{ marginBottom: '15px' }}
        >
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
          <label 
            htmlFor="cancel-reason-textarea"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Cancellation Reason:
          </label>
          <textarea
            id="cancel-reason-textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
            data-testid="cancel-reason-textarea"
            aria-required="true"
            aria-invalid={!reason.trim()}
            aria-describedby="cancel-reason-error"
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
          {!reason.trim() && (
            <span 
              id="cancel-reason-error" 
              className="sr-only"
              role="status"
              aria-live="polite"
            >
              Cancellation reason is required
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            id="cancel-modal-keep"
            onClick={onCancel}
            data-testid="cancel-modal-keep-button"
            aria-label="Keep the appointment and close dialog"
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
            id="cancel-modal-confirm"
            onClick={handleConfirm}
            disabled={!reason.trim()}
            data-testid="cancel-modal-confirm-button"
            aria-label="Confirm appointment cancellation"
            aria-disabled={!reason.trim()}
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