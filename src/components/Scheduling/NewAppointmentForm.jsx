import React, { useState } from 'react';
import { useScheduling } from './SchedulingContext';

// Simple form for adding new appointments
function NewAppointmentForm() {
  const { addAppointment } = useScheduling();
  const [dateTime, setDateTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateTime || !reason) return;

    const newAppt = {
      id: Math.random().toString(36).substr(2, 9), // simple random ID
      dateTime,
      reason,
    };
    addAppointment(newAppt);

    // Reset fields
    setDateTime('');
    setReason('');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Schedule a New Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="dateTime">
            Date/Time:
            <input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              style={{ marginLeft: '8px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="reason">
            Reason:
            <input
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ marginLeft: '8px' }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Add Appointment
        </button>
      </form>
    </div>
  );
}

export default NewAppointmentForm;