import React, { useState, useMemo, useCallback } from 'react';
import { useScheduling } from '../context/SchedulingContext';
import { usePIMS } from '../context/PIMSContext';
import PIMSScreenWrapper from '../components/PIMSScreenWrapper';
import AppointmentForm from '../components/AppointmentScheduler/AppointmentForm';
import AvailabilityGrid from '../components/AppointmentScheduler/AvailabilityGrid';
import CancelModal from '../components/Modals/CancelModal';
import ConfirmationModal from '../components/Modals/ConfirmationModal';
import WaitlistManager from '../components/AppointmentScheduler/WaitlistManager';
import BlockScheduling from '../components/AppointmentScheduler/BlockScheduling';
import AppointmentConfirmation from '../components/AppointmentScheduler/AppointmentConfirmation';
import { FALLBACK_CONFIG, MOCK_PROVIDERS } from '../data/mockData';
import '../styles/PatientForms.css';

/**
 * Enhanced SchedulingScreen with full appointment management features
 * - Calendar view with day/week/month modes
 * - Drag-and-drop rescheduling
 * - Real-time availability checking
 * - Appointment confirmations and reminders
 * - Waitlist management
 */
function SchedulingScreen() {
  const { 
    appointments, 
    providers,
    selectedDate,
    selectedProvider,
    viewMode,
    confirmationDialog,
    setSelectedDate,
    setSelectedProvider,
    setViewMode,
    setConfirmationDialog,
    updateAppointmentStatus,
    cancelAppointment,
    sendConfirmation,
    clearAppointments
  } = useScheduling();
  
  const { config } = usePIMS();
  const safeConfig = config || FALLBACK_CONFIG;
  
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showAvailabilityGrid, setShowAvailabilityGrid] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [appointmentToConfirm, setAppointmentToConfirm] = useState(null);
  const [showWaitlistManager, setShowWaitlistManager] = useState(false);
  const [showBlockScheduling, setShowBlockScheduling] = useState(false);
  const [showAppointmentConfirmation, setShowAppointmentConfirmation] = useState(false);
  const [confirmationAppointment, setConfirmationAppointment] = useState(null);

  // Generate the days for the current week based on the offset
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (viewMode === 'day') {
      return [selectedDate];
    }

    // Find the most recent Monday
    const currentMonday = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentMonday.setDate(today.getDate() + diff);

    // Add the week offset
    const baseDate = new Date(currentMonday);
    baseDate.setDate(baseDate.getDate() + (currentWeekOffset * 7));

    // Generate days for the week
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + index);
      return date.toISOString().split('T')[0];
    });
  }, [currentWeekOffset, viewMode, selectedDate]);

  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Helper functions
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  };

  const handleSlotClick = useCallback((slotData) => {
    if (slotData.action === 'view' && slotData.appointment) {
      setSelectedAppointment(slotData.appointment);
      setShowAppointmentForm(false);
    } else if (slotData.time && slotData.date) {
      setSelectedSlot(slotData);
      setShowAppointmentForm(true);
      setSelectedAppointment(null);
    }
  }, []);

  const handleAppointmentAction = useCallback((action, appointmentId) => {
    switch (action) {
      case 'check-in':
        updateAppointmentStatus(appointmentId, 'arrived');
        break;
      case 'start':
        updateAppointmentStatus(appointmentId, 'in_progress');
        break;
      case 'complete':
        updateAppointmentStatus(appointmentId, 'completed');
        break;
      case 'no-show':
        updateAppointmentStatus(appointmentId, 'no_show');
        break;
      case 'cancel':
        const appointment = appointments.find(a => a.id === appointmentId);
        if (appointment) {
          setAppointmentToCancel(appointment);
          setShowCancelModal(true);
        }
        break;
      case 'reschedule':
        setShowAppointmentForm(true);
        break;
      case 'confirm':
        const appt = appointments.find(a => a.id === appointmentId);
        if (appt) {
          setAppointmentToConfirm(appt);
          setShowConfirmationModal(true);
        }
        break;
    }
  }, [updateAppointmentStatus, cancelAppointment, sendConfirmation, appointments]);

  const handleFormSuccess = useCallback((appointment) => {
    setShowAppointmentForm(false);
    setSelectedAppointment(null);
    setSelectedSlot(null);
    
    // Show appointment confirmation dialog
    if (appointment && appointment.id) {
      setConfirmationAppointment(appointment);
      setShowAppointmentConfirmation(true);
    }
  }, []);

  const handleCancelConfirm = useCallback((appointmentId, reason) => {
    cancelAppointment(appointmentId, reason);
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  }, [cancelAppointment]);

  const handleConfirmationSend = useCallback((appointmentId, method) => {
    const result = sendConfirmation(appointmentId, method);
    if (result.success) {
      // Show success toast or notification
      setConfirmationDialog({
        action: 'confirmation sent',
        appointment: appointmentToConfirm
      });
      setTimeout(() => setConfirmationDialog(null), 3000);
    }
    setShowConfirmationModal(false);
    setAppointmentToConfirm(null);
  }, [sendConfirmation, appointmentToConfirm, setConfirmationDialog]);

  // Get PIMS-specific styles
  const getPIMSStyles = () => {
    const pimsName = (safeConfig.name || 'default').toLowerCase();

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
          primaryButton: {
            backgroundColor: '#0066cc',
            color: 'white',
            border: '2px outset #0088ff',
            boxShadow: 'inset -1px -1px #004499, inset 1px 1px #0088ff',
            padding: '3px 10px',
            fontSize: '12px',
            cursor: 'pointer',
          }
        };

      case 'avimark':
        return {
          button: {
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: '1px solid #999',
            padding: '5px 12px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '2px',
          },
          primaryButton: {
            backgroundColor: '#A70000',
            color: 'white',
            border: 'none',
            padding: '5px 12px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '2px',
          }
        };

      case 'easyvet':
        return {
          button: {
            backgroundColor: 'white',
            color: '#333',
            border: '1px solid #E0E0E0',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          },
          primaryButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }
        };

      case 'intravet':
        return {
          button: {
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: '1px solid #BBBBBB',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '3px',
          },
          primaryButton: {
            background: 'linear-gradient(to bottom, #2196F3, #1565C0)',
            color: 'white',
            border: 'none',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '3px',
          }
        };

      case 'covetrus pulse':
        return {
          button: {
            backgroundColor: 'white',
            color: '#333',
            border: '1px solid #E0E0E0',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          },
          primaryButton: {
            backgroundColor: '#6200EA',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '8px',
            boxShadow: '0 3px 8px rgba(98, 0, 234, 0.2)',
          }
        };

      default:
        return {
          button: {
            padding: '5px 10px',
            fontSize: '14px',
            cursor: 'pointer',
          },
          primaryButton: {
            backgroundColor: '#007bff',
            color: 'white',
            padding: '5px 10px',
            fontSize: '14px',
            cursor: 'pointer',
          }
        };
    }
  };

  const styles = getPIMSStyles();

  return (
    <PIMSScreenWrapper title={safeConfig.screenLabels?.scheduler || 'Appointment Scheduler'}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* View Mode Selector */}
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                id="view-mode-day-button"
                onClick={() => setViewMode('day')}
                data-testid="view-mode-day-button"
                aria-label="Switch to day view"
                aria-pressed={viewMode === 'day'}
                style={{
                  ...styles.button,
                  ...(viewMode === 'day' ? { backgroundColor: '#e0e0e0' } : {})
                }}
              >
                Day
              </button>
              <button
                id="view-mode-week-button"
                onClick={() => setViewMode('week')}
                data-testid="view-mode-week-button"
                aria-label="Switch to week view"
                aria-pressed={viewMode === 'week'}
                style={{
                  ...styles.button,
                  ...(viewMode === 'week' ? { backgroundColor: '#e0e0e0' } : {})
                }}
              >
                Week
              </button>
              <button
                id="toggle-availability-grid-button"
                onClick={() => setShowAvailabilityGrid(!showAvailabilityGrid)}
                data-testid="toggle-availability-grid-button"
                aria-label={showAvailabilityGrid ? 'Switch to calendar view' : 'Switch to availability grid'}
                style={styles.button}
              >
                {showAvailabilityGrid ? 'Calendar View' : 'Availability Grid'}
              </button>
            </div>

            {/* Advanced Features */}
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                id="waitlist-manager-button"
                onClick={() => setShowWaitlistManager(!showWaitlistManager)}
                data-testid="waitlist-manager-button"
                aria-label="Open waitlist manager"
                style={styles.button}
              >
                Waitlist
              </button>
              <button
                id="block-scheduling-button"
                onClick={() => setShowBlockScheduling(!showBlockScheduling)}
                data-testid="block-scheduling-button"
                aria-label="Open block scheduling"
                style={styles.button}
              >
                Block Time
              </button>
            </div>

            {/* Provider Filter */}
            <select
              id="provider-filter-select"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              data-testid="provider-filter-select"
              aria-label="Filter appointments by provider"
              style={{ padding: '5px', fontSize: '13px' }}
            >
              <option value="">All Providers</option>
              {(providers && providers.length > 0 ? providers : MOCK_PROVIDERS).map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>

            {/* Date Navigation */}
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <button
                id="calendar-prev-week-button"
                onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                data-testid="calendar-prev-week-button"
                aria-label="Go to previous week"
                style={{ ...styles.button, width: '32px' }}
              >
                ←
              </button>
              <input
                id="calendar-date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                data-testid="calendar-date-picker"
                aria-label="Select date"
                style={{ padding: '5px', fontSize: '13px' }}
              />
              <button
                id="calendar-next-week-button"
                onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                data-testid="calendar-next-week-button"
                aria-label="Go to next week"
                style={{ ...styles.button, width: '32px' }}
              >
                →
              </button>
              <button
                id="calendar-today-button"
                onClick={() => {
                  setCurrentWeekOffset(0);
                  setSelectedDate(new Date().toISOString().split('T')[0]);
                }}
                data-testid="calendar-today-button"
                aria-label="Go to today"
                style={styles.button}
              >
                Today
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="new-appointment-button"
              onClick={() => {
                setSelectedSlot(null);
                setSelectedAppointment(null);
                setShowAppointmentForm(true);
              }}
              data-testid="new-appointment-button"
              aria-label="Create new appointment"
              style={styles.primaryButton}
            >
              New Appointment
            </button>
            <button
              id="reset-calendar-button"
              onClick={() => {
                clearAppointments();
                setCurrentWeekOffset(0);
              }}
              data-testid="reset-calendar-button"
              aria-label="Reset calendar to initial state"
              style={styles.button}
            >
              Reset Calendar
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {showAvailabilityGrid ? (
            <AvailabilityGrid
              date={selectedDate}
              selectedProviderId={selectedProvider}
              onSlotClick={handleSlotClick}
              viewMode={selectedProvider ? 'provider' : 'multi-provider'}
            />
          ) : (
            /* Traditional Calendar View */
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed'
            }}>
              <thead>
                <tr>
                  <th style={{ width: '80px', padding: '8px', borderBottom: '2px solid #e0e0e0' }}>
                    Time
                  </th>
                  {days.map((day) => {
                    const date = new Date(day);
                    const options = { weekday: 'short', month: 'short', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    const weekend = isWeekend(day);
                    const pastDate = isPastDate(day);

                    return (
                      <th
                        key={day}
                        style={{
                          padding: '8px',
                          borderBottom: '2px solid #e0e0e0',
                          backgroundColor: weekend || pastDate ? '#f0f0f0' : 'transparent',
                          color: pastDate ? '#999' : 'inherit'
                        }}
                      >
                        {formattedDate}
                        {day === selectedDate && (
                          <div style={{ fontSize: '10px', color: '#4CAF50' }}>Selected</div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {times.map((timeStr) => (
                  <tr key={timeStr}>
                    <td style={{ 
                      padding: '8px', 
                      borderRight: '1px solid #e0e0e0',
                      borderBottom: '1px solid #f0f0f0',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {timeStr}
                    </td>
                    {days.map((day) => {
                      const weekend = isWeekend(day);
                      const pastDate = isPastDate(day);
                      const dayAppointments = appointments.filter(
                        appt => appt.date === day && 
                               appt.time === timeStr &&
                               (!selectedProvider || appt.staff?.includes((providers && providers.length > 0 ? providers : MOCK_PROVIDERS).find(p => p.id === selectedProvider)?.name))
                      );

                      return (
                        <td
                          key={day + timeStr}
                          style={{
                            padding: '0',
                            borderRight: '1px solid #f0f0f0',
                            borderBottom: '1px solid #f0f0f0',
                            minHeight: '60px',
                            height: '60px',
                            verticalAlign: 'top',
                            position: 'relative'
                          }}
                        >
                          <button
                            id={`appointment-slot-${day}-${timeStr.replace(':', '-')}`}
                            data-testid={`appointment-slot-${day}-${timeStr.replace(':', '-')}`}
                            data-date={day}
                            data-time={timeStr}
                            data-available={!weekend && !pastDate && dayAppointments.length === 0}
                            aria-label={`${weekend ? 'Closed' : pastDate ? 'Past date' : dayAppointments.length > 0 ? `${dayAppointments.length} appointment(s)` : 'Available'} slot on ${day} at ${timeStr}`}
                            disabled={weekend || pastDate}
                            onClick={() => {
                              if (!weekend && !pastDate) {
                                if (dayAppointments.length > 0) {
                                  setSelectedAppointment(dayAppointments[0]);
                                } else {
                                  handleSlotClick({
                                    date: day,
                                    time: timeStr,
                                    providerId: selectedProvider || 'P001'
                                  });
                                }
                              }
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              padding: '4px',
                              border: 'none',
                              backgroundColor: weekend || pastDate
                                ? '#f0f0f0'
                                : dayAppointments.length > 0 ? '#ffd9d9' : '#f8f8f8',
                              cursor: weekend || pastDate ? 'not-allowed' : 'pointer',
                              textAlign: 'left',
                              font: 'inherit'
                            }}
                          >
                          {weekend ? (
                            <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                              Closed
                            </div>
                          ) : pastDate ? (
                            <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                              Past
                            </div>
                          ) : dayAppointments.length > 0 ? (
                            dayAppointments.map((appt, idx) => (
                              <div 
                                key={appt.id}
                                style={{
                                  fontSize: '11px',
                                  marginBottom: '2px',
                                  padding: '2px',
                                  backgroundColor: appt.status === 'cancelled' ? '#ccc' :
                                                 appt.status === 'completed' ? '#90EE90' :
                                                 appt.status === 'arrived' ? '#87CEEB' :
                                                 appt.status === 'in_progress' ? '#FFD700' :
                                                 'transparent',
                                  borderRadius: '2px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                title={`${appt.patient} - ${appt.reason} (${appt.staff})`}
                              >
                                <strong>{appt.patient?.split(' ')[0]}</strong>
                                {appt.status === 'cancelled' && ' (X)'}
                              </div>
                            ))
                          ) : (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#4CAF50', 
                              textAlign: 'center',
                              paddingTop: '20px'
                            }}>
                              Available
                            </div>
                          )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Appointment Form Modal */}
        {showAppointmentForm && (
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
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              maxHeight: '90vh',
              overflow: 'auto',
              minWidth: '600px'
            }}>
              <AppointmentForm
                initialDate={selectedSlot?.date || selectedDate}
                initialTime={selectedSlot?.time || ''}
                onClose={() => {
                  setShowAppointmentForm(false);
                  setSelectedSlot(null);
                }}
                onSuccess={handleFormSuccess}
                existingAppointment={selectedAppointment}
                mode={selectedAppointment ? 'reschedule' : 'create'}
              />
            </div>
          </div>
        )}

        {/* Appointment Details Panel */}
        {selectedAppointment && !showAppointmentForm && (
          <div style={{
            position: 'fixed',
            right: '20px',
            top: '100px',
            width: '300px',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 100
          }}>
            <h3 style={{ marginTop: 0 }}>Appointment Details</h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div><strong>Date:</strong> {selectedAppointment.date}</div>
              <div><strong>Time:</strong> {selectedAppointment.time}</div>
              <div><strong>Patient:</strong> {selectedAppointment.patient}</div>
              <div><strong>Provider:</strong> {selectedAppointment.staff}</div>
              <div><strong>Type:</strong> {selectedAppointment.appointmentType || 'General'}</div>
              <div><strong>Reason:</strong> {selectedAppointment.reason}</div>
              <div><strong>Status:</strong> 
                <span style={{
                  marginLeft: '5px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: selectedAppointment.status === 'cancelled' ? '#f44336' :
                                 selectedAppointment.status === 'completed' ? '#4CAF50' :
                                 selectedAppointment.status === 'arrived' ? '#2196F3' :
                                 selectedAppointment.status === 'in_progress' ? '#FF9800' :
                                 '#757575',
                  color: 'white'
                }}>
                  {selectedAppointment.status || 'Scheduled'}
                </span>
              </div>
              {selectedAppointment.roomName && (
                <div><strong>Room:</strong> {selectedAppointment.roomName}</div>
              )}
              <div><strong>Duration:</strong> {selectedAppointment.duration || 30} minutes</div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                <>
                  {selectedAppointment.status !== 'arrived' && selectedAppointment.status !== 'in_progress' && (
                    <button
                      id="appointment-check-in-button"
                      onClick={() => handleAppointmentAction('check-in', selectedAppointment.id)}
                      data-testid="appointment-check-in-button"
                      aria-label={`Check in appointment for ${selectedAppointment.patient}`}
                      style={{ ...styles.button, fontSize: '12px', padding: '4px 8px' }}
                    >
                      Check In
                    </button>
                  )}
                  {selectedAppointment.status === 'arrived' && (
                    <button
                      id="appointment-start-button"
                      onClick={() => handleAppointmentAction('start', selectedAppointment.id)}
                      data-testid="appointment-start-button"
                      aria-label={`Start appointment for ${selectedAppointment.patient}`}
                      style={{ ...styles.button, fontSize: '12px', padding: '4px 8px' }}
                    >
                      Start
                    </button>
                  )}
                  {selectedAppointment.status === 'in_progress' && (
                    <button
                      id="appointment-complete-button"
                      onClick={() => handleAppointmentAction('complete', selectedAppointment.id)}
                      data-testid="appointment-complete-button"
                      aria-label={`Complete appointment for ${selectedAppointment.patient}`}
                      style={{ ...styles.primaryButton, fontSize: '12px', padding: '4px 8px' }}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleAppointmentAction('reschedule', selectedAppointment.id)}
                    style={{ ...styles.button, fontSize: '12px', padding: '4px 8px' }}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleAppointmentAction('cancel', selectedAppointment.id)}
                    style={{ 
                      ...styles.button, 
                      fontSize: '12px', 
                      padding: '4px 8px',
                      backgroundColor: '#f44336',
                      color: 'white'
                    }}
                  >
                    Cancel
                  </button>
                  {!selectedAppointment.confirmationSent && (
                    <button
                      onClick={() => handleAppointmentAction('confirm', selectedAppointment.id)}
                      style={{ ...styles.button, fontSize: '12px', padding: '4px 8px' }}
                    >
                      Send Confirmation
                    </button>
                  )}
                  {selectedAppointment.status !== 'arrived' && selectedAppointment.status !== 'in_progress' && (
                    <button
                      onClick={() => handleAppointmentAction('no-show', selectedAppointment.id)}
                      style={{ ...styles.button, fontSize: '12px', padding: '4px 8px' }}
                    >
                      No Show
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                style={{ ...styles.button, fontSize: '12px', padding: '4px 8px' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmationDialog && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            maxWidth: '300px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <strong>Appointment {confirmationDialog.action}!</strong>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  {confirmationDialog.appointment.patientName} - {confirmationDialog.appointment.date} at {confirmationDialog.appointment.time}
                </div>
              </div>
              <button
                onClick={() => setConfirmationDialog(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  marginLeft: '10px'
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Status Legend */}
        <div style={{ 
          borderTop: '1px solid #e0e0e0',
          paddingTop: '10px',
          display: 'flex',
          gap: '20px',
          fontSize: '12px',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ffd9d9', border: '1px solid #ccc' }}></div>
            <span>Scheduled</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#87CEEB', border: '1px solid #ccc' }}></div>
            <span>Checked In</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#FFD700', border: '1px solid #ccc' }}></div>
            <span>In Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#90EE90', border: '1px solid #ccc' }}></div>
            <span>Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ccc', border: '1px solid #999' }}></div>
            <span>Cancelled</span>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && appointmentToCancel && (
          <CancelModal
            appointment={appointmentToCancel}
            onConfirm={handleCancelConfirm}
            onCancel={() => {
              setShowCancelModal(false);
              setAppointmentToCancel(null);
            }}
          />
        )}

        {/* Confirmation Send Modal */}
        {showConfirmationModal && appointmentToConfirm && (
          <ConfirmationModal
            appointment={appointmentToConfirm}
            onConfirm={handleConfirmationSend}
            onCancel={() => {
              setShowConfirmationModal(false);
              setAppointmentToConfirm(null);
            }}
          />
        )}

        {/* Waitlist Manager */}
        {showWaitlistManager && (
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
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              maxHeight: '90vh',
              overflow: 'auto',
              minWidth: '800px'
            }}>
              <WaitlistManager
                onClose={() => setShowWaitlistManager(false)}
              />
            </div>
          </div>
        )}

        {/* Block Scheduling */}
        {showBlockScheduling && (
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
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              maxHeight: '90vh',
              overflow: 'auto',
              minWidth: '600px'
            }}>
              <BlockScheduling
                onClose={() => setShowBlockScheduling(false)}
              />
            </div>
          </div>
        )}

        {/* Appointment Confirmation */}
        {showAppointmentConfirmation && confirmationAppointment && (
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
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              maxHeight: '90vh',
              overflow: 'auto',
              minWidth: '500px'
            }}>
              <AppointmentConfirmation
                appointment={confirmationAppointment}
                onClose={() => {
                  setShowAppointmentConfirmation(false);
                  setConfirmationAppointment(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </PIMSScreenWrapper>
  );
}

export default SchedulingScreen;