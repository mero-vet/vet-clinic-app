import React, { useState, useMemo } from 'react';
import { useScheduling } from '../context/SchedulingContext';
import '../styles/WindowsClassic.css';
import '../styles/PatientForms.css';

/**
 * SchedulingScreen
 * Displays a simple weekly calendar (Mon-Fri, 8am-5pm).
 * Allows booking a slot if it's not taken and navigating forward in time.
 */
function SchedulingScreen() {
  const { appointments, addAppointment, removeAppointment } = useScheduling();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    patient: '',
    clientId: '',
    staff: '',
  });

  // Generate the days for the current week based on the offset
  const days = useMemo(() => {
    const startDate = new Date('2025-01-27'); // Your original start date
    startDate.setDate(startDate.getDate() + (currentWeekOffset * 7));

    return Array.from({ length: 5 }).map((_, index) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + index);
      return date.toISOString().split('T')[0];
    });
  }, [currentWeekOffset]);

  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSlotClick = (day, time) => {
    const existingAppt = appointments.find(
      (appt) => appt.date === day && appt.time === time
    );
    if (existingAppt) {
      setSelectedAppointment(existingAppt);
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ day, time });
      setSelectedAppointment(null);
      setFormData({ date: day, time: time, reason: '', patient: '', clientId: '', staff: '' });
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
          <h2>Weekly Calendar</h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p>Click on an open slot to schedule a new appointment.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
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
                onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                style={{
                  width: '32px',
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
                {days.map((day) => (
                  <th key={day} style={{ border: '1px solid #ccc' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((timeStr) => (
                <tr key={timeStr}>
                  <td style={{ border: '1px solid #ccc', padding: '4px', whiteSpace: 'nowrap' }}>{timeStr}</td>
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
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          minHeight: '40px',
                          height: '40px',
                          verticalAlign: 'top',
                          overflow: 'hidden',
                          maxWidth: '0',
                          width: '20%'
                        }}
                        onClick={() => handleSlotClick(day, timeStr)}
                      >
                        <div style={{
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          width: '100%'
                        }}>
                          {foundAppt
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
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'inline-block', width: '80px', fontWeight: 'bold' }}>Client ID:</label>
                <span>{selectedAppointment.clientId}</span>
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
                type="button"
                style={{
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                  padding: '4px 10px',
                  color: '#000000'
                }}
                onClick={handleCancelAppointment}
              >
                Cancel Appointment
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
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </button>
            </div>
          )}

          {selectedSlot && !selectedAppointment && (
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '8px' }}>
              <h3>Schedule Appointment for {selectedSlot.day} at {selectedSlot.time}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'inline-block', width: '80px' }}>Client ID:</label>
                  <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    required
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