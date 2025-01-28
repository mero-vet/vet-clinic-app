import React from 'react';
import { useScheduling } from './SchedulingContext';

// Renders a list of appointments from SchedulingContext
function AppointmentList() {
  const { appointments, removeAppointment } = useScheduling();

  if (appointments.length === 0) {
    return <div>No scheduled appointments.</div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Upcoming Appointments</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {appointments.map((appt) => (
          <li
            key={appt.id}
            style={{
              border: '1px solid #ccc',
              marginBottom: '8px',
              padding: '8px',
            }}
          >
            <div><strong>Appointment ID:</strong> {appt.id}</div>
            <div><strong>Date/Time:</strong> {appt.dateTime}</div>
            <div><strong>Reason:</strong> {appt.reason}</div>
            <button
              onClick={() => removeAppointment(appt.id)}
              style={{
                marginTop: '5px',
                padding: '4px 8px',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentList;