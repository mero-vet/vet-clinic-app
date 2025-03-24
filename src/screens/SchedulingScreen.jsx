import React, { useState, useMemo } from 'react';
import { useScheduling } from '../context/SchedulingContext';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';

/**
 * SchedulingScreen
 * Displays a weekly calendar starting from current week.
 * Past dates and weekends are grayed out.
 * Allows viewing up to 5 weeks in the future.
 */
function SchedulingScreen() {
  const { appointments, addAppointment, removeAppointment, clearAppointments } = useScheduling();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    patient: '',
    clientId: '',
    patientId: '',
    staff: '',
  });

  // Generate the days for the current week based on the offset
  const days = useMemo(() => {
    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the most recent Monday (or today if it's Monday)
    const currentMonday = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days, otherwise find last Monday
    currentMonday.setDate(today.getDate() + diff);

    // Add the week offset to get to the requested week
    const baseDate = new Date(currentMonday);
    baseDate.setDate(baseDate.getDate() + (currentWeekOffset * 7));

    // Generate days for the week (all 7 days)
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + index);
      const dateString = date.toISOString().split('T')[0];
      return dateString;
    });
  }, [currentWeekOffset]);

  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Helper to check if a date is a weekend
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0 is Sunday, 6 is Saturday
    return day === 0 || day === 6;
  };

  // Helper to check if a date is in the past or today
  const isPastDate = (dateString) => {
    const today = new Date();
    // Set today to start of day for comparison
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateString);
    // Set the date to start of day for fair comparison
    date.setHours(0, 0, 0, 0);

    // Return true if the date is strictly less than tomorrow
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  };

  const handleSlotClick = (day, time) => {
    // Don't allow booking on weekends or past dates
    if (isWeekend(day) || isPastDate(day)) {
      return;
    }

    const existingAppt = appointments.find(
      (appt) => appt.date === day && appt.time === time
    );
    if (existingAppt) {
      setSelectedAppointment(existingAppt);
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ day, time });
      setSelectedAppointment(null);
      setFormData({ date: day, time: time, reason: '', patient: '', clientId: '', patientId: '', staff: '' });
    }
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

  const handleCancelAppointment = () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      removeAppointment(selectedAppointment.id);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="windows-classic">
      <div className="window" style={{ margin: '0' }}>
        <div className="title-bar">
          <div className="title-bar-text">Scheduling</div>
          <div className="title-bar-controls">
            <button className="title-bar-button" aria-label="Minimize"></button>
            <button className="title-bar-button" aria-label="Maximize"></button>
            <button className="title-bar-button" aria-label="Close"></button>
          </div>
        </div>

        <div className="window-body" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p>Click on an open slot to schedule a new appointment. Past dates and weekends are unavailable.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  clearAppointments();
                  setCurrentWeekOffset(0);
                  setSelectedSlot(null);
                  setSelectedAppointment(null);
                }}
                style={{
                  backgroundColor: '#808080',
                  color: '#ffffff',
                  border: '1px solid #404040',
                  padding: '0 8px'
                }}
              >
                Reset Calendar
              </button>
              <button
                onClick={() => setCurrentWeekOffset(prev => Math.max(0, prev - 1))}
                disabled={currentWeekOffset === 0}
                style={{
                  width: '32px',
                  cursor: currentWeekOffset === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor: '#808080',
                  color: '#ffffff',
                  border: '1px solid #404040'
                }}
              >
                ←
              </button>
              <button
                onClick={() => setCurrentWeekOffset(prev => prev < 5 ? prev + 1 : prev)}
                disabled={currentWeekOffset >= 5}
                style={{
                  width: '32px',
                  cursor: currentWeekOffset >= 5 ? 'not-allowed' : 'pointer',
                  backgroundColor: '#808080',
                  color: '#ffffff',
                  border: '1px solid #404040'
                }}
              >
                →
              </button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', width: '80px' }}>Time</th>
                {days.map((day) => {
                  // Format date to show day of week and month/day
                  const date = new Date(day);
                  const options = { weekday: 'short', month: 'short', day: 'numeric' };
                  const formattedDate = date.toLocaleDateString('en-US', options);
                  const weekend = isWeekend(day);
                  const pastDate = isPastDate(day);

                  return (
                    <th
                      key={day}
                      style={{
                        border: '1px solid #ccc',
                        backgroundColor: weekend || pastDate ? '#e0e0e0' : 'transparent'
                      }}
                    >
                      {formattedDate}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {times.map((timeStr) => (
                <tr key={timeStr}>
                  <td style={{ border: '1px solid #ccc', padding: '4px', whiteSpace: 'nowrap' }}>{timeStr}</td>
                  {days.map((day) => {
                    const weekend = isWeekend(day);
                    const pastDate = isPastDate(day);
                    const foundAppt = appointments.find(
                      (appt) => appt.date === day && appt.time === timeStr
                    );

                    return (
                      <td
                        key={day + timeStr}
                        style={{
                          border: '1px solid #ccc',
                          padding: '4px',
                          backgroundColor: weekend || pastDate
                            ? '#e0e0e0'
                            : foundAppt ? '#ffd9d9' : '#d9ffd9',
                          cursor: weekend || pastDate ? 'not-allowed' : 'pointer',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          minHeight: '40px',
                          height: '40px',
                          verticalAlign: 'top',
                          overflow: 'hidden',
                          maxWidth: '0',
                          width: '14.28%' // 1/7 of the table width
                        }}
                        onClick={() => handleSlotClick(day, timeStr)}
                      >
                        <div style={{
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          width: '100%'
                        }}>
                          {weekend
                            ? 'Weekend - Closed'
                            : pastDate
                              ? 'Past Date - Unavailable'
                              : foundAppt
                                ? `${foundAppt.reason} - ${foundAppt.patient}`
                                : 'Available'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {selectedAppointment && (
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '8px' }}>
              <h3>Appointment Details for {selectedAppointment.date} at {selectedAppointment.time}</h3>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                <div>
                  <label style={{ display: 'inline-block', width: '80px', fontWeight: 'bold' }}>Client ID:</label>
                  <span>{selectedAppointment.clientId}</span>
                </div>
                <div>
                  <label style={{ display: 'inline-block', width: '80px', fontWeight: 'bold' }}>Patient ID:</label>
                  <span>{selectedAppointment.patientId}</span>
                </div>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'inline-block', width: '80px', fontWeight: 'bold' }}>Reason:</label>
                <span>{selectedAppointment.reason}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'inline-block', width: '80px', fontWeight: 'bold' }}>Patient:</label>
                <span>{selectedAppointment.patient}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'inline-block', width: '80px', fontWeight: 'bold' }}>Staff:</label>
                <span>{selectedAppointment.staff}</span>
              </div>
              <button
                onClick={handleCancelAppointment}
                style={{
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                  padding: '4px 10px',
                  color: '#000000'
                }}
              >
                Cancel Appointment
              </button>
            </div>
          )}

          {selectedSlot && (
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '8px' }}>
              <h3>Book New Appointment for {selectedSlot.day} at {selectedSlot.time}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'inline-block', width: '80px' }}>Client ID:</label>
                  <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                  />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'inline-block', width: '80px' }}>Patient ID:</label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                  />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'inline-block', width: '80px' }}>Reason:</label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
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
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                    padding: '4px 10px',
                    color: '#000000'
                  }}
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  style={{
                    marginLeft: '10px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                    padding: '4px 10px',
                    color: '#000000'
                  }}
                  onClick={() => setSelectedSlot(null)}
                >
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