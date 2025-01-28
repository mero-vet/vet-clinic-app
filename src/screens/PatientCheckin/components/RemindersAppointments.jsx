import React from 'react';

function RemindersAppointments() {
  // In a real app, these might come from props or context
  const reminders = [
    { date: '3/31/2024', description: 'IDEXX Ova and Parasites' },
    { date: '5/3/2024', description: 'SNAP 4DX IN HOUSE HWT' },
  ];

  const futureAppointments = [
    { date: '6/28/2025', time: '08:00', reason: 'Dental' },
  ];

  return (
    <div style={{ marginTop: '10px' }}>
      <fieldset>
        <legend>Reminders &amp; Future Appointments</legend>
        <div style={{ marginBottom: '8px' }}>
          <strong>Reminders:</strong>
          <ul>
            {reminders.length === 0 && <li>No reminders</li>}
            {reminders.map((r, idx) => (
              <li key={idx}>
                {r.date} &nbsp; {r.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Future Appointments:</strong>
          <ul>
            {futureAppointments.length === 0 && <li>No future appointments</li>}
            {futureAppointments.map((fa, idx) => (
              <li key={idx}>
                {fa.date} &nbsp; {fa.time} &nbsp; {fa.reason}
              </li>
            ))}
          </ul>
        </div>
      </fieldset>
    </div>
  );
}

export default RemindersAppointments;