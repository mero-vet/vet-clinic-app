import React, { useState } from 'react';
import { useScheduling } from '../../context/SchedulingContext';
import { useToast } from '../Toast/ToastContext';

function BlockScheduling({ onClose }) {
  const { providers, blockTime, blockedTimes, appointmentTypes } = useScheduling();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    providerId: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    blockType: 'unavailable' // 'unavailable', 'surgery_block', 'admin_time', 'meeting'
  });

  const blockTypes = {
    unavailable: { name: 'Unavailable', color: '#666' },
    surgery_block: { name: 'Surgery Block', color: '#F44336' },
    admin_time: { name: 'Admin Time', color: '#FF9800' },
    meeting: { name: 'Meeting', color: '#2196F3' },
    lunch: { name: 'Lunch', color: '#4CAF50' },
    training: { name: 'Training', color: '#9C27B0' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.providerId || !formData.date || !formData.startTime || !formData.endTime) {
      toast.warning('Please fill in all required fields');
      return;
    }

    // Validate time range
    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const [endHour, endMinute] = formData.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (startMinutes >= endMinutes) {
      toast.error('End time must be after start time');
      return;
    }

    // Block the time
    blockTime(
      formData.providerId,
      formData.date,
      formData.startTime,
      formData.endTime,
      `${blockTypes[formData.blockType].name}: ${formData.reason}`
    );

    // Reset form
    setFormData({
      providerId: '',
      date: '',
      startTime: '',
      endTime: '',
      reason: '',
      blockType: 'unavailable'
    });

    toast.success('Time blocked successfully!');
  };

  const handleCreateSurgeryBlock = () => {
    if (!formData.providerId || !formData.date) {
      toast.warning('Please select a provider and date first');
      return;
    }

    // Create a 3-hour surgery block
    const surgeryStart = '09:00';
    const surgeryEnd = '12:00';

    blockTime(
      formData.providerId,
      formData.date,
      surgeryStart,
      surgeryEnd,
      'Surgery Block: Reserved for surgical procedures'
    );

    toast.success('Surgery block created from 9:00 AM to 12:00 PM');
  };

  // Get blocked times for the selected date and provider
  const getBlockedTimesForDay = () => {
    if (!formData.date || !formData.providerId) return [];
    
    return blockedTimes.filter(block => 
      block.date === formData.date && 
      block.providerId === formData.providerId
    );
  };

  const dayBlockedTimes = getBlockedTimesForDay();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Block Scheduling Time</h2>
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

      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          {/* Provider Selection */}
          <div style={{ gridColumn: 'span 2' }}>
            <label>Provider *</label>
            <select
              value={formData.providerId}
              onChange={(e) => setFormData(prev => ({ ...prev, providerId: e.target.value }))}
              style={{ width: '100%', padding: '5px' }}
              required
            >
              <option value="">Select Provider</option>
              {providers.filter(p => p.type === 'veterinarian').map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label>Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '5px' }}
              required
            />
          </div>

          {/* Block Type */}
          <div>
            <label>Block Type *</label>
            <select
              value={formData.blockType}
              onChange={(e) => setFormData(prev => ({ ...prev, blockType: e.target.value }))}
              style={{ width: '100%', padding: '5px' }}
            >
              {Object.entries(blockTypes).map(([value, type]) => (
                <option key={value} value={value}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div>
            <label>Start Time *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              style={{ width: '100%', padding: '5px' }}
              required
            />
          </div>

          <div>
            <label>End Time *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              style={{ width: '100%', padding: '5px' }}
              required
            />
          </div>

          {/* Reason */}
          <div style={{ gridColumn: 'span 2' }}>
            <label>Reason / Notes</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows="3"
              style={{ width: '100%', padding: '5px' }}
              placeholder="Additional details about this blocked time..."
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h4 style={{ marginTop: 0 }}>Quick Actions</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCreateSurgeryBlock}
              style={{
                padding: '6px 12px',
                backgroundColor: '#F44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Create Surgery Block (9AM-12PM)
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  startTime: '12:00',
                  endTime: '13:00',
                  blockType: 'lunch',
                  reason: 'Lunch break'
                }));
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Add Lunch Break (12-1PM)
            </button>
          </div>
        </div>

        {/* Existing Blocks for Selected Day */}
        {dayBlockedTimes.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4>Blocked Times for {formData.date}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {dayBlockedTimes.map((block, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: '#f8f8f8',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>
                    {block.startTime} - {block.endTime}: {block.reason || 'Blocked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              setFormData({
                providerId: '',
                date: '',
                startTime: '',
                endTime: '',
                reason: '',
                blockType: 'unavailable'
              });
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#757575',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Block Time
          </button>
        </div>
      </form>

      {/* Block Type Legend */}
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f8f8',
        borderRadius: '4px'
      }}>
        <h4 style={{ marginTop: 0 }}>Block Types</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '13px' }}>
          {Object.entries(blockTypes).map(([key, type]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: type.color,
                borderRadius: '4px'
              }}></div>
              <span>{type.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlockScheduling;