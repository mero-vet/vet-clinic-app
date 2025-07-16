import React, { useState } from 'react';
import { useScheduling } from '../../context/SchedulingContext';
import { usePatient } from '../../context/PatientContext';
import { appointmentTypes, waitlistPriorities } from '../../utils/appointmentRules';
import PatientSearchBar from '../PatientSearchBar';
import { useToast } from '../Toast/ToastContext';

function WaitlistManager({ onClose }) {
  const { waitlistEntries, addToWaitlist, providers } = useScheduling();
  const { patients } = usePatient();
  const toast = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    clientId: '',
    appointmentTypeId: 'wellness',
    preferredDates: [],
    preferredProviders: [],
    priority: 'routine',
    notes: ''
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dateInput, setDateInput] = useState('');

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      patientId: patient.patientId,
      clientId: patient.clientId
    }));
  };

  const handleAddDate = () => {
    if (dateInput && !formData.preferredDates.includes(dateInput)) {
      setFormData(prev => ({
        ...prev,
        preferredDates: [...prev.preferredDates, dateInput]
      }));
      setDateInput('');
    }
  };

  const handleRemoveDate = (date) => {
    setFormData(prev => ({
      ...prev,
      preferredDates: prev.preferredDates.filter(d => d !== date)
    }));
  };

  const handleProviderToggle = (providerId) => {
    setFormData(prev => ({
      ...prev,
      preferredProviders: prev.preferredProviders.includes(providerId)
        ? prev.preferredProviders.filter(id => id !== providerId)
        : [...prev.preferredProviders, providerId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      toast.warning('Please select a patient');
      return;
    }

    const entry = addToWaitlist(formData);
    
    // Reset form
    setFormData({
      patientId: '',
      clientId: '',
      appointmentTypeId: 'wellness',
      preferredDates: [],
      preferredProviders: [],
      priority: 'routine',
      notes: ''
    });
    setSelectedPatient(null);
    setShowAddForm(false);
    
    toast.success('Added to waitlist successfully!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return '#FF0000';
      case 'urgent': return '#FF9800';
      case 'routine': return '#4CAF50';
      case 'convenience': return '#2196F3';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Group waitlist entries by status
  const waitingEntries = waitlistEntries.filter(e => e.status === 'waiting');
  const notifiedEntries = waitlistEntries.filter(e => e.status === 'notified');
  const bookedEntries = waitlistEntries.filter(e => e.status === 'booked');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Appointment Waitlist</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showAddForm ? 'Cancel' : 'Add to Waitlist'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Add to Waitlist Form */}
      {showAddForm && (
        <div style={{ 
          backgroundColor: '#f8f8f8', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Add Patient to Waitlist</h3>
          <form onSubmit={handleSubmit}>
            {/* Patient Selection */}
            <div style={{ marginBottom: '15px' }}>
              <label>Patient *</label>
              <PatientSearchBar 
                onPatientSelect={handlePatientSelect}
                selectedPatient={selectedPatient}
              />
            </div>

            {/* Selected Patient Info */}
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
              </div>
            )}

            {/* Appointment Type */}
            <div style={{ marginBottom: '15px' }}>
              <label>Appointment Type *</label>
              <select
                value={formData.appointmentTypeId}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  appointmentTypeId: e.target.value 
                }))}
                style={{ width: '100%', padding: '5px' }}
              >
                {Object.entries(appointmentTypes).map(([id, type]) => (
                  <option key={id} value={id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div style={{ marginBottom: '15px' }}>
              <label>Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  priority: e.target.value 
                }))}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="emergency">Emergency</option>
                <option value="urgent">Urgent</option>
                <option value="routine">Routine</option>
                <option value="convenience">Convenience</option>
              </select>
            </div>

            {/* Preferred Dates */}
            <div style={{ marginBottom: '15px' }}>
              <label>Preferred Dates (optional)</label>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ flex: 1, padding: '5px' }}
                />
                <button
                  type="button"
                  onClick={handleAddDate}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add Date
                </button>
              </div>
              {formData.preferredDates.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {formData.preferredDates.map(date => (
                    <span
                      key={date}
                      style={{
                        backgroundColor: '#e0e0e0',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {formatDate(date)}
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        style={{
                          marginLeft: '5px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Providers */}
            <div style={{ marginBottom: '15px' }}>
              <label>Preferred Providers (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {providers.filter(p => p.type === 'veterinarian').map(provider => (
                  <label key={provider.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={formData.preferredProviders.includes(provider.id)}
                      onChange={() => handleProviderToggle(provider.id)}
                    />
                    <span style={{ marginLeft: '5px' }}>{provider.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '15px' }}>
              <label>Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  notes: e.target.value 
                }))}
                rows="3"
                style={{ width: '100%', padding: '5px' }}
                placeholder="Any special requirements or preferences..."
              />
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add to Waitlist
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Waitlist Sections */}
      {waitingEntries.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3>Waiting ({waitingEntries.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {waitingEntries.map(entry => {
              const patient = patients?.find(p => p.patientId === entry.patientId);
              const appointmentType = appointmentTypes[entry.appointmentTypeId];
              
              return (
                <div
                  key={entry.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong>{patient?.patientName || 'Unknown Patient'}</strong>
                        <span
                          style={{
                            backgroundColor: getPriorityColor(entry.priority),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px'
                          }}
                        >
                          {entry.priority.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                        {appointmentType?.name} • Added {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                      {entry.preferredDates.length > 0 && (
                        <div style={{ fontSize: '13px', marginTop: '5px' }}>
                          Preferred dates: {entry.preferredDates.map(d => formatDate(d)).join(', ')}
                        </div>
                      )}
                      {entry.preferredProviders.length > 0 && (
                        <div style={{ fontSize: '13px', marginTop: '5px' }}>
                          Preferred providers: {entry.preferredProviders
                            .map(id => providers.find(p => p.id === id)?.name)
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      )}
                      {entry.notes && (
                        <div style={{ fontSize: '13px', marginTop: '5px', fontStyle: 'italic' }}>
                          {entry.notes}
                        </div>
                      )}
                    </div>
                    <button
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Find Slot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {notifiedEntries.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3>Notified ({notifiedEntries.length})</h3>
          <div style={{ fontSize: '14px', color: '#666' }}>
            These patients have been notified of available slots.
          </div>
        </div>
      )}

      {waitlistEntries.length === 0 && !showAddForm && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666'
        }}>
          <p>No patients on the waitlist.</p>
          <p>Click "Add to Waitlist" to add a patient.</p>
        </div>
      )}
    </div>
  );
}

export default WaitlistManager;