import React, { useState, useMemo } from 'react';
import { useScheduling } from '../context/SchedulingContext';
import { usePIMS } from '../context/PIMSContext';
import PIMSScreenWrapper from '../components/PIMSScreenWrapper';
import '../styles/PatientForms.css';

/**
 * SchedulingScreen
 * Displays a weekly calendar starting from current week.
 * Past dates and weekends are grayed out.
 * Allows viewing up to 5 weeks in the future.
 */
function SchedulingScreen() {
  const { appointments, addAppointment, removeAppointment, clearAppointments } = useScheduling();
  const { config, currentPIMS } = usePIMS();
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

  // Get PIMS-specific styles
  const getPIMSStyles = () => {
    const pimsName = config.name.toLowerCase();

    switch (pimsName) {
      case 'cornerstone':
        return {
          button: {
            backgroundColor: '#c0c0c0',
            border: '2px outset #ffffff',
            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff',
            padding: '3px 10px',
            fontSize: '12px',
            cursor: 'pointer',
          },
          input: {
            border: '2px inset #d0d0d0',
            padding: '3px',
            fontSize: '12px',
          },
          table: {
            border: '1px solid #808080',
          },
          cell: {
            border: '1px solid #808080',
            padding: '4px',
          }
        };

      case 'avimark':
        return {
          button: {
            backgroundColor: '#A70000',
            color: 'white',
            border: 'none',
            padding: '5px 12px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '2px',
          },
          input: {
            border: '1px solid #cccccc',
            padding: '5px',
            fontSize: '13px',
            borderRadius: '2px',
          },
          table: {
            border: '1px solid #cccccc',
            borderCollapse: 'collapse',
          },
          cell: {
            border: '1px solid #cccccc',
            padding: '6px',
          }
        };

      case 'easyvet':
        return {
          button: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          input: {
            border: '1px solid #E0E0E0',
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '4px',
          },
          table: {
            border: '1px solid #E0E0E0',
            borderRadius: '8px',
            overflow: 'hidden',
          },
          cell: {
            border: '1px solid #E0E0E0',
            padding: '8px',
          }
        };

      case 'intravet':
        return {
          button: {
            background: 'linear-gradient(to bottom, #2196F3, #1565C0)',
            color: 'white',
            border: 'none',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '3px',
          },
          input: {
            border: '1px solid #BBBBBB',
            padding: '6px 10px',
            fontSize: '13px',
            borderRadius: '3px',
          },
          table: {
            border: '1px solid #BBBBBB',
            borderCollapse: 'collapse',
          },
          cell: {
            border: '1px solid #BBBBBB',
            padding: '6px',
          }
        };

      case 'covetrus pulse':
        return {
          button: {
            backgroundColor: '#6200EA',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '8px',
            boxShadow: '0 3px 8px rgba(98, 0, 234, 0.2)',
          },
          input: {
            border: '1px solid #E0E0E0',
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: '8px',
          },
          table: {
            border: '1px solid #E0E0E0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          },
          cell: {
            border: '1px solid #E0E0E0',
            padding: '10px',
          }
        };

      default:
        return {
          button: {
            padding: '5px 10px',
            fontSize: '14px',
            cursor: 'pointer',
          },
          input: {
            border: '1px solid #ccc',
            padding: '5px',
            fontSize: '14px',
          },
          table: {
            border: '1px solid #ccc',
          },
          cell: {
            border: '1px solid #ccc',
            padding: '4px',
          }
        };
    }
  };

  const styles = getPIMSStyles();

  return (
    <PIMSScreenWrapper title={config.screenLabels.scheduler}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p>Click on an open slot to schedule a new appointment. Past dates and weekends are unavailable.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                clearAppointments();
                setCurrentWeekOffset(0);
                setSelectedSlot(null);
                setSelectedAppointment(null);
              }}
              style={styles.button}
            >
              Reset Calendar
            </button>
            <button
              onClick={() => setCurrentWeekOffset(prev => Math.max(0, prev - 1))}
              disabled={currentWeekOffset === 0}
              style={{
                ...styles.button,
                width: '32px',
                cursor: currentWeekOffset === 0 ? 'not-allowed' : 'pointer',
                opacity: currentWeekOffset === 0 ? 0.6 : 1
              }}
            >
              ←
            </button>
            <button
              onClick={() => setCurrentWeekOffset(prev => prev < 5 ? prev + 1 : prev)}
              disabled={currentWeekOffset >= 5}
              style={{
                ...styles.button,
                width: '32px',
                cursor: currentWeekOffset >= 5 ? 'not-allowed' : 'pointer',
                opacity: currentWeekOffset >= 5 ? 0.6 : 1
              }}
            >
              →
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            ...styles.table
          }}>
            <thead>
              <tr>
                <th style={{ ...styles.cell, width: '80px' }}>Time</th>
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
                        ...styles.cell,
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
                  <td style={{ ...styles.cell, whiteSpace: 'nowrap' }}>{timeStr}</td>
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
                          ...styles.cell,
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
        </div>

        {selectedSlot && (
          <div style={{ marginTop: '16px', padding: '12px', border: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <h3>Schedule Appointment</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div>
                  <label>Date: </label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    readOnly
                    style={styles.input}
                  />
                </div>
                <div>
                  <label>Time: </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    readOnly
                    style={styles.input}
                  />
                </div>
              </div>
              <div>
                <label>Reason: </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  style={{ ...styles.input, width: '300px' }}
                />
              </div>
              <div>
                <label>Patient: </label>
                <input
                  type="text"
                  name="patient"
                  value={formData.patient}
                  onChange={handleInputChange}
                  required
                  style={{ ...styles.input, width: '300px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div>
                  <label>Client ID: </label>
                  <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label>Patient ID: </label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>
              <div>
                <label>Staff: </label>
                <input
                  type="text"
                  name="staff"
                  value={formData.staff}
                  onChange={handleInputChange}
                  style={{ ...styles.input, width: '300px' }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <button type="submit" style={styles.button}>
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  style={{ ...styles.button, marginLeft: '10px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedAppointment && (
          <div style={{ marginTop: '16px', padding: '12px', border: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <h3>Appointment Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>Date: {selectedAppointment.date}</div>
              <div>Time: {selectedAppointment.time}</div>
              <div>Reason: {selectedAppointment.reason}</div>
              <div>Patient: {selectedAppointment.patient}</div>
              <div>Client ID: {selectedAppointment.clientId}</div>
              <div>Patient ID: {selectedAppointment.patientId}</div>
              <div>Staff: {selectedAppointment.staff}</div>
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={handleCancelAppointment}
                  style={styles.button}
                >
                  Cancel Appointment
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  style={{ ...styles.button, marginLeft: '10px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PIMSScreenWrapper>
  );
}

export default SchedulingScreen;