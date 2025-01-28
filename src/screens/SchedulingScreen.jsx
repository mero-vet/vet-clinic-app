import React, { useState } from 'react';
import { useScheduling } from '../context/SchedulingContext';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';

/**
 * SchedulingScreen
 * Displays a simple weekly calendar (Mon-Fri, 8am-5pm).
 * Allows booking a slot if it's not taken.
 */
function SchedulingScreen() {
  const { appointments, addAppointment } = useScheduling();

  // We'll define a small array of times and days
  const days = ['2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31'];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    patient: '',
    staff: '',
  });

  const handleSlotClick = (day, time) => {
    // Check if slot is already occupied
    const existingAppt = appointments.find(
      (appt) => appt.date === day && appt.time === time
    );
    if (existingAppt) {
      alert('Slot already taken: ' + existingAppt.reason);
      return;
    }
    // Otherwise open the "booking form"
    setSelectedSlot({ day, time });
    setFormData({ date: day, time: time, reason: '', patient: '', staff: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAppointment(formData);
    setSelectedSlot(null);
    alert('Appointment scheduled!');
  };

  return (
    <div className="windows-classic">
      <div className="window" style={{ margin: '0' }}>
        <div className="title-bar">
          <div className="title-bar-text">Scheduling</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        <div className="window-body" style={{ padding: '16px' }}>
          <h2>Weekly Calendar</h2>
          <p>Click on an open slot to schedule a new appointment.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc' }}>Time</th>
                {days.map((day) => (
                  <th key={day} style={{ border: '1px solid #ccc' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((timeStr) => (
                <tr key={timeStr}>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{timeStr}</td>
                  {days.map((day) => {
                    const foundAppt = appointments.find(
                      (appt) => appt.date === day && appt.time === timeStr
                    );
                    return (
                      <td
                        key={day + timeStr}
                        style={{
                          border: '1px solid #ccc',
                          padding: '4px',
                          backgroundColor: foundAppt ? '#ffd9d9' : '#d9ffd9',
                          cursor: foundAppt ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => handleSlotClick(day, timeStr)}
                      >
                        {foundAppt
                          ? `${foundAppt.reason} - ${foundAppt.patient}`
                          : 'Available'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {selectedSlot && (
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '8px' }}>
              <h3>Schedule Appointment for {selectedSlot.day} at {selectedSlot.time}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'inline-block', width: '80px' }}>Reason:</label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                  />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'inline-block', width: '80px' }}>Patient:</label>
                  <input
                    type="text"
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                  />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'inline-block', width: '80px' }}>Staff:</label>
                  <input
                    type="text"
                    name="staff"
                    value={formData.staff}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit">Book Appointment</button>
                <button type="button" style={{ marginLeft: '10px' }} onClick={() => setSelectedSlot(null)}>
                  Cancel
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default SchedulingScreen;