import React, { useState, useEffect } from 'react';
import { useScheduling } from '../../context/SchedulingContext';
import { usePatient } from '../../context/PatientContext';
import { appointmentTypes, calculateEndTime } from '../../utils/appointmentRules';
import PatientSearchBar from '../PatientSearchBar';

function AppointmentForm({ 
  initialDate = '', 
  initialTime = '', 
  onClose, 
  onSuccess,
  existingAppointment = null,
  mode = 'create' // 'create', 'edit', 'reschedule'
}) {
  const { 
    providers, 
    rooms, 
    addAppointment, 
    rescheduleAppointment,
    getAvailableSlots,
    checkAvailability 
  } = useScheduling();
  
  const { patients } = usePatient();
  
  const [formData, setFormData] = useState({
    date: existingAppointment?.date || initialDate,
    time: existingAppointment?.time || initialTime,
    appointmentTypeId: existingAppointment?.appointmentTypeId || 'wellness',
    patientId: existingAppointment?.patientId || '',
    clientId: existingAppointment?.clientId || '',
    providerId: existingAppointment?.providerId || 'P001',
    roomId: existingAppointment?.roomId || '',
    reason: existingAppointment?.reason || '',
    notes: existingAppointment?.notes || '',
    duration: existingAppointment?.duration || null,
    sendConfirmation: true,
    confirmationMethod: 'email'
  });

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load patient data if editing
  useEffect(() => {
    if (existingAppointment && patients) {
      const patient = patients.find(p => p.patientId === existingAppointment.patientId);
      if (patient) {
        setSelectedPatient(patient);
      }
    }
  }, [existingAppointment, patients]);

  // Update form when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        patientId: selectedPatient.patientId,
        clientId: selectedPatient.clientId
      }));
    }
  }, [selectedPatient]);

  // Check availability when date, time, or provider changes
  useEffect(() => {
    if (formData.date && formData.time && formData.providerId) {
      const appointmentType = appointmentTypes[formData.appointmentTypeId];
      const duration = formData.duration || (appointmentType.defaultDuration + appointmentType.bufferTime);
      
      const availability = checkAvailability(
        formData.date,
        formData.time,
        duration,
        formData.providerId,
        formData.roomId
      );
      
      if (!availability.available && mode === 'create') {
        setValidationErrors(prev => ({
          ...prev,
          time: availability.reason
        }));
      } else {
        setValidationErrors(prev => {
          const { time, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [formData.date, formData.time, formData.providerId, formData.roomId, formData.appointmentTypeId, formData.duration, checkAvailability, mode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const findAvailableSlots = () => {
    if (!formData.date || !formData.providerId || !formData.appointmentTypeId) {
      alert('Please select a date, provider, and appointment type first');
      return;
    }

    const slots = getAvailableSlots(
      formData.date,
      formData.providerId,
      formData.appointmentTypeId,
      formData.duration
    );

    setAvailableSlots(slots);
    setShowAvailability(true);
  };

  const selectTimeSlot = (slot) => {
    setFormData(prev => ({
      ...prev,
      time: slot.time
    }));
    setShowAvailability(false);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.patientId) errors.patient = 'Patient is required';
    if (!formData.providerId) errors.provider = 'Provider is required';
    if (!formData.appointmentTypeId) errors.type = 'Appointment type is required';
    if (!formData.reason) errors.reason = 'Reason for visit is required';

    // Check if date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.date = 'Cannot schedule appointments in the past';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (mode === 'reschedule' && existingAppointment) {
        result = rescheduleAppointment(
          existingAppointment.id,
          formData.date,
          formData.time,
          formData.providerId
        );
      } else {
        // Add patient information for display
        const appointmentData = {
          ...formData,
          patientName: selectedPatient?.patientName,
          species: selectedPatient?.species
        };
        
        result = addAppointment(appointmentData);
      }

      if (result.success) {
        if (formData.sendConfirmation) {
          // Send confirmation (simulated)
          console.log(`Sending ${formData.confirmationMethod} confirmation for appointment`);
        }

        if (onSuccess) {
          onSuccess(result.appointment);
        }

        // Reset form
        setFormData({
          date: '',
          time: '',
          appointmentTypeId: 'wellness',
          patientId: '',
          clientId: '',
          providerId: 'P001',
          roomId: '',
          reason: '',
          notes: '',
          duration: null,
          sendConfirmation: true,
          confirmationMethod: 'email'
        });
        setSelectedPatient(null);

        if (onClose) {
          onClose();
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const appointmentType = appointmentTypes[formData.appointmentTypeId];
  const estimatedDuration = formData.duration || (appointmentType?.defaultDuration + appointmentType?.bufferTime) || 30;
  const endTime = formData.time ? calculateEndTime(formData.time, formData.appointmentTypeId) : '';

  return (
    <div style={{ 
      backgroundColor: '#f8f8f8', 
      padding: '20px', 
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h3>{mode === 'reschedule' ? 'Reschedule' : mode === 'edit' ? 'Edit' : 'Schedule New'} Appointment</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Patient Selection */}
        {mode === 'create' && (
          <div style={{ marginBottom: '15px' }}>
            <label>Patient *</label>
            <PatientSearchBar 
              onPatientSelect={handlePatientSelect}
              selectedPatient={selectedPatient}
            />
            {validationErrors.patient && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.patient}</span>
            )}
          </div>
        )}

        {/* Display selected patient info */}
        {selectedPatient && (
          <div style={{ 
            backgroundColor: '#e0e0e0', 
            padding: '10px', 
            marginBottom: '15px',
            borderRadius: '4px'
          }}>
            <strong>{selectedPatient.patientName}</strong> ({selectedPatient.species})
            <br />
            Owner: {selectedPatient.clientFirstName} {selectedPatient.clientLastName}
            <br />
            {selectedPatient.alertNotes && (
              <div style={{ color: 'red', marginTop: '5px' }}>
                <strong>Alert:</strong> {selectedPatient.alertNotes}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {/* Date and Time */}
          <div>
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '5px' }}
            />
            {validationErrors.date && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.date}</span>
            )}
          </div>

          <div>
            <label>Time *</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                style={{ flex: 1, padding: '5px' }}
              />
              <button
                type="button"
                onClick={findAvailableSlots}
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                Find Available
              </button>
            </div>
            {validationErrors.time && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.time}</span>
            )}
            {endTime && (
              <span style={{ fontSize: '12px', color: '#666' }}>
                Ends at: {endTime} ({estimatedDuration} min)
              </span>
            )}
          </div>

          {/* Provider and Room */}
          <div>
            <label>Provider *</label>
            <select
              name="providerId"
              value={formData.providerId}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '5px' }}
            >
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Room</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="">Auto-assign</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type */}
          <div style={{ gridColumn: 'span 2' }}>
            <label>Appointment Type *</label>
            <select
              name="appointmentTypeId"
              value={formData.appointmentTypeId}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '5px' }}
            >
              {Object.entries(appointmentTypes).map(([id, type]) => (
                <option key={id} value={id}>
                  {type.name} - {type.defaultDuration} min ({type.priceRange})
                </option>
              ))}
            </select>
            {appointmentType && (
              <div style={{ 
                marginTop: '5px', 
                padding: '10px', 
                backgroundColor: appointmentType.colorCode + '20',
                borderLeft: `4px solid ${appointmentType.colorCode}`,
                fontSize: '12px'
              }}>
                {appointmentType.description}
              </div>
            )}
          </div>

          {/* Reason for Visit */}
          <div style={{ gridColumn: 'span 2' }}>
            <label>Reason for Visit *</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Brief description of visit reason"
              style={{ width: '100%', padding: '5px' }}
            />
            {validationErrors.reason && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.reason}</span>
            )}
          </div>

          {/* Notes */}
          <div style={{ gridColumn: 'span 2' }}>
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              style={{ width: '100%', padding: '5px' }}
              placeholder="Any special instructions or notes"
            />
          </div>

          {/* Custom Duration */}
          <div>
            <label>Custom Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration || ''}
              onChange={handleInputChange}
              placeholder={`Default: ${estimatedDuration}`}
              min="15"
              max="240"
              step="15"
              style={{ width: '100%', padding: '5px' }}
            />
          </div>

          {/* Confirmation Options */}
          <div>
            <label>
              <input
                type="checkbox"
                name="sendConfirmation"
                checked={formData.sendConfirmation}
                onChange={handleInputChange}
              />
              Send Confirmation
            </label>
            {formData.sendConfirmation && (
              <select
                name="confirmationMethod"
                value={formData.confirmationMethod}
                onChange={handleInputChange}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="both">Both</option>
              </select>
            )}
          </div>
        </div>

        {/* Available Slots */}
        {showAvailability && availableSlots.length > 0 && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#f0f0f0',
            borderRadius: '4px'
          }}>
            <h4>Available Time Slots</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => selectTimeSlot(slot)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Scheduling...' : mode === 'reschedule' ? 'Reschedule' : 'Schedule Appointment'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;