import React, { useState, useEffect } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import './RoomAssignment.css';

const RoomAssignment = ({ checkInId, visitType, onComplete }) => {
  const { availableRooms, assignRoom, currentCheckIn } = useCheckIn();
  const [selectedRoom, setSelectedRoom] = useState('');
  const [requiresSpecialEquipment, setRequiresSpecialEquipment] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentCheckIn?.roomNumber) {
      setSelectedRoom(currentCheckIn.roomNumber);
    }
  }, [currentCheckIn]);

  const roomTypeRequirements = {
    'Surgery': ['Surgical', 'Anesthesia', 'Monitors'],
    'X-Ray': ['X-Ray'],
    'Dental': ['Dental', 'Anesthesia'],
    'Emergency': ['Monitors', 'IV']
  };

  useEffect(() => {
    // Auto-set equipment requirements based on visit type
    if (visitType) {
      const requirements = roomTypeRequirements[visitType] || [];
      setRequiresSpecialEquipment(requirements);
    }
  }, [visitType]);

  const filteredRooms = availableRooms.filter(room => {
    if (requiresSpecialEquipment.length === 0) return true;
    return requiresSpecialEquipment.every(equipment => 
      room.specialEquipment.includes(equipment)
    );
  });

  const handleAssignRoom = () => {
    if (!selectedRoom) {
      setError('Please select a room');
      return;
    }

    try {
      assignRoom(checkInId, selectedRoom);
      onComplete?.({ room: selectedRoom, notes });
    } catch (err) {
      setError(err.message || 'Failed to assign room');
    }
  };

  const getRoomStatusClass = (room) => {
    switch (room.status) {
      case 'available':
        return 'room-available';
      case 'occupied':
        return 'room-occupied';
      case 'cleaning':
        return 'room-cleaning';
      case 'reserved':
        return 'room-reserved';
      default:
        return '';
    }
  };

  const formatLastCleaned = (date) => {
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="room-assignment">
      <h3>Room Assignment</h3>

      <div className="room-requirements">
        <label>Special Equipment Required:</label>
        <div className="equipment-tags">
          {requiresSpecialEquipment.length === 0 ? (
            <span className="no-requirements">None</span>
          ) : (
            requiresSpecialEquipment.map(equipment => (
              <span key={equipment} className="equipment-tag">
                {equipment}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="room-grid">
        <h4>Available Rooms ({filteredRooms.length})</h4>
        
        {filteredRooms.length === 0 ? (
          <div className="no-rooms-message">
            <p>No rooms available with required equipment</p>
            <button 
              className="btn-secondary"
              onClick={() => setRequiresSpecialEquipment([])}
            >
              Show all rooms
            </button>
          </div>
        ) : (
          <div className="rooms-list">
            {filteredRooms.map(room => (
              <div 
                key={room.roomNumber}
                className={`room-card ${selectedRoom === room.roomNumber ? 'selected' : ''} ${getRoomStatusClass(room)}`}
                onClick={() => setSelectedRoom(room.roomNumber)}
              >
                <div className="room-header">
                  <h5>{room.roomNumber}</h5>
                  <span className="room-status">{room.status}</span>
                </div>
                
                <div className="room-details">
                  {room.specialEquipment.length > 0 && (
                    <div className="room-equipment">
                      {room.specialEquipment.map((eq, idx) => (
                        <span key={idx} className="equipment-icon" title={eq}>
                          {eq === 'X-Ray' && '🩻'}
                          {eq === 'Surgical' && '🔪'}
                          {eq === 'Anesthesia' && '💨'}
                          {eq === 'Monitors' && '📊'}
                          {eq === 'IV' && '💉'}
                          {eq === 'Fluids' && '💧'}
                          {eq === 'Dental' && '🦷'}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="room-info">
                    <span>Cleaned: {formatLastCleaned(room.lastCleaned)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="all-rooms-status">
        <h4>All Rooms Status</h4>
        <div className="status-summary">
          <div className="status-item">
            <span className="status-dot available"></span>
            <span>Available ({availableRooms.length})</span>
          </div>
          <div className="status-item">
            <span className="status-dot occupied"></span>
            <span>Occupied</span>
          </div>
          <div className="status-item">
            <span className="status-dot cleaning"></span>
            <span>Cleaning</span>
          </div>
        </div>
      </div>

      <div className="assignment-notes">
        <label>Room Assignment Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Special instructions for this room assignment..."
          rows={2}
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="assignment-actions">
        <button 
          className="btn-secondary"
          onClick={() => onComplete?.(null)}
        >
          Assign Later
        </button>
        <button 
          className="btn-primary"
          onClick={handleAssignRoom}
          disabled={!selectedRoom}
        >
          Assign Room {selectedRoom}
        </button>
      </div>
    </div>
  );
};

export default RoomAssignment;