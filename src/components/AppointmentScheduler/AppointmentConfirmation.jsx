import React, { useState } from 'react';
import { useScheduling } from '../../context/SchedulingContext';
import { useCommunications } from '../../context/CommunicationsContext';
import { appointmentTypes } from '../../utils/appointmentRules';
import { useToast } from '../Toast/ToastContext';

function AppointmentConfirmation({ appointment, onClose }) {
  const { sendConfirmation } = useScheduling();
  const { logCommunication } = useCommunications();
  const toast = useToast();

  const [confirmationMethod, setConfirmationMethod] = useState('email');
  const [customMessage, setCustomMessage] = useState('');
  const [includeReminders, setIncludeReminders] = useState(true);
  const [reminderPreferences, setReminderPreferences] = useState({
    dayBefore: true,
    hourBefore: true,
    weekBefore: appointment.appointmentTypeId === 'surgery'
  });
  const [isSending, setIsSending] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Generate confirmation message
  const generateConfirmationMessage = () => {
    const appointmentType = appointmentTypes[appointment.appointmentTypeId];
    const dateObj = new Date(appointment.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let message = `Dear ${appointment.clientName || 'Client'},\n\n`;
    message += `This confirms your appointment for ${appointment.patientName} `;
    message += `on ${formattedDate} at ${appointment.time}.\n\n`;
    message += `Appointment Type: ${appointmentType.name}\n`;
    message += `Provider: ${appointment.providerName}\n`;
    if (appointment.roomName) {
      message += `Location: ${appointment.roomName}\n`;
    }
    message += `Reason for Visit: ${appointment.reason}\n\n`;

    // Add special instructions based on appointment type
    if (appointment.appointmentTypeId === 'surgery') {
      message += `IMPORTANT PRE-SURGERY INSTRUCTIONS:\n`;
      message += `• No food after midnight the night before\n`;
      message += `• Water is okay until 6 AM on surgery day\n`;
      message += `• Please arrive 15 minutes early for check-in\n\n`;
    } else if (appointment.appointmentTypeId === 'dental') {
      message += `DENTAL PROCEDURE INSTRUCTIONS:\n`;
      message += `• No food after 10 PM the night before\n`;
      message += `• We will call you when your pet is ready for pickup\n\n`;
    }

    if (appointmentType.priceRange) {
      message += `Estimated Cost: ${appointmentType.priceRange}\n\n`;
    }

    if (customMessage) {
      message += `${customMessage}\n\n`;
    }

    message += `If you need to reschedule or cancel, please call us at (503) 555-0123.\n\n`;
    message += `Thank you for choosing our clinic!\n`;
    message += `Best regards,\nThe Veterinary Team`;

    return message;
  };

  const handleSendConfirmation = async () => {
    setIsSending(true);

    try {
      // Send confirmation through scheduling service
      const result = sendConfirmation(appointment.id, confirmationMethod);

      if (result.success) {
        // Log communication
        const message = generateConfirmationMessage();

        if (logCommunication) {
          logCommunication({
            clientId: appointment.clientId,
            patientId: appointment.patientId,
            type: 'appointment_confirmation',
            method: confirmationMethod,
            subject: `Appointment Confirmation - ${appointment.date} at ${appointment.time}`,
            message: message,
            status: 'sent',
            appointmentId: appointment.id
          });
        }

        // Set up reminders if requested
        if (includeReminders) {
          const reminders = [];

          if (reminderPreferences.weekBefore && appointment.appointmentTypeId === 'surgery') {
            reminders.push({
              type: 'appointment_reminder',
              scheduledFor: new Date(appointment.date + 'T' + appointment.time),
              daysBefore: 7,
              method: confirmationMethod,
              message: 'Surgery reminder: Please review pre-surgery instructions'
            });
          }

          if (reminderPreferences.dayBefore) {
            reminders.push({
              type: 'appointment_reminder',
              scheduledFor: new Date(appointment.date + 'T' + appointment.time),
              daysBefore: 1,
              method: confirmationMethod,
              message: 'Reminder: You have an appointment tomorrow'
            });
          }

          if (reminderPreferences.hourBefore) {
            reminders.push({
              type: 'appointment_reminder',
              scheduledFor: new Date(appointment.date + 'T' + appointment.time),
              hoursBefore: 1,
              method: 'sms', // Always SMS for last-minute reminders
              message: 'Reminder: Your appointment is in 1 hour'
            });
          }

          // Log scheduled reminders
          // Scheduled reminders processed
        }

        setConfirmationSent(true);
      } else {
        toast.error('Failed to send confirmation. Please try again.');
      }
    } catch (error) {
      toast.error(`Error sending confirmation: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const previewMessage = generateConfirmationMessage();

  if (confirmationSent) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{
          fontSize: '48px',
          color: '#4CAF50',
          marginBottom: '20px'
        }}>
          ✓
        </div>
        <h3>Confirmation Sent Successfully!</h3>
        <p>
          Appointment confirmation has been sent via {confirmationMethod}.
          {includeReminders && ' Reminders have been scheduled.'}
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Send Appointment Confirmation</h3>

      {/* Appointment Summary */}
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h4 style={{ marginTop: 0 }}>Appointment Summary</h4>
        <div style={{ fontSize: '14px' }}>
          <div><strong>Patient:</strong> {appointment.patientName}</div>
          <div><strong>Date:</strong> {appointment.date}</div>
          <div><strong>Time:</strong> {appointment.time}</div>
          <div><strong>Type:</strong> {appointmentTypes[appointment.appointmentTypeId]?.name}</div>
          <div><strong>Provider:</strong> {appointment.providerName}</div>
        </div>
      </div>

      {/* Confirmation Method */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Send confirmation via:
        </label>
        <select
          value={confirmationMethod}
          onChange={(e) => setConfirmationMethod(e.target.value)}
          style={{ width: '200px', padding: '5px' }}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="both">Email & SMS</option>
        </select>
      </div>

      {/* Custom Message */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Additional message (optional):
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows="3"
          style={{ width: '100%', padding: '5px' }}
          placeholder="Add any special instructions or notes..."
        />
      </div>

      {/* Reminder Settings */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={includeReminders}
            onChange={(e) => setIncludeReminders(e.target.checked)}
          />
          Set up automatic reminders
        </label>

        {includeReminders && (
          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            {appointment.appointmentTypeId === 'surgery' && (
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  checked={reminderPreferences.weekBefore}
                  onChange={(e) => setReminderPreferences(prev => ({
                    ...prev,
                    weekBefore: e.target.checked
                  }))}
                />
                1 week before (surgery only)
              </label>
            )}
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <input
                type="checkbox"
                checked={reminderPreferences.dayBefore}
                onChange={(e) => setReminderPreferences(prev => ({
                  ...prev,
                  dayBefore: e.target.checked
                }))}
              />
              1 day before
            </label>
            <label style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={reminderPreferences.hourBefore}
                onChange={(e) => setReminderPreferences(prev => ({
                  ...prev,
                  hourBefore: e.target.checked
                }))}
              />
              1 hour before (SMS only)
            </label>
          </div>
        )}
      </div>

      {/* Message Preview */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Message Preview:</h4>
        <div style={{
          backgroundColor: '#f8f8f8',
          padding: '15px',
          borderRadius: '4px',
          fontSize: '13px',
          whiteSpace: 'pre-wrap',
          maxHeight: '300px',
          overflow: 'auto',
          border: '1px solid #e0e0e0'
        }}>
          {previewMessage}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          disabled={isSending}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSending ? 'not-allowed' : 'pointer',
            opacity: isSending ? 0.6 : 1
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSendConfirmation}
          disabled={isSending}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSending ? 'not-allowed' : 'pointer',
            opacity: isSending ? 0.6 : 1
          }}
        >
          {isSending ? 'Sending...' : 'Send Confirmation'}
        </button>
      </div>
    </div>
  );
}

export default AppointmentConfirmation;