import React, { useState, useEffect, useMemo } from 'react';
import { useScheduling } from '../../context/SchedulingContext';
import { appointmentTypes, businessHours } from '../../utils/appointmentRules';

function AvailabilityGrid({ 
  date, 
  selectedProviderId = null, 
  onSlotClick,
  viewMode = 'provider' // 'provider', 'room', 'multi-provider'
}) {
  const { 
    appointments, 
    providers, 
    rooms,
    getProviderSchedule,
    blockedTimes 
  } = useScheduling();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Generate time slots for the day
  const timeSlots = useMemo(() => {
    const slots = [];
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = businessHours[dayOfWeek];
    
    if (dayHours.closed) return slots;

    const [openHour, openMinute] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);
    const startTime = openHour * 60 + openMinute;
    const endTime = closeHour * 60 + closeMinute;

    // Generate 15-minute intervals
    for (let time = startTime; time < endTime; time += 15) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      slots.push({
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        hour: hours,
        minute: minutes,
        totalMinutes: time
      });
    }

    return slots;
  }, [date]);

  // Get appointments for the selected date
  const dayAppointments = useMemo(() => {
    return appointments.filter(apt => apt.date === date);
  }, [appointments, date]);

  // Get blocked times for the date
  const dayBlockedTimes = useMemo(() => {
    return blockedTimes.filter(block => block.date === date);
  }, [blockedTimes, date]);

  // Determine which providers/rooms to show
  const displayItems = useMemo(() => {
    if (viewMode === 'room') {
      return rooms;
    } else if (viewMode === 'multi-provider') {
      return providers;
    } else if (selectedProviderId) {
      return providers.filter(p => p.id === selectedProviderId);
    }
    return providers;
  }, [viewMode, selectedProviderId, providers, rooms]);

  // Check if a slot is occupied
  const getSlotStatus = (itemId, timeSlot, isProvider = true) => {
    const slotStart = timeSlot.totalMinutes;
    const slotEnd = slotStart + 15;

    // Check appointments
    const appointment = dayAppointments.find(apt => {
      const matchField = isProvider ? apt.providerId || apt.staff : apt.roomId;
      if ((isProvider && matchField !== itemId) || (!isProvider && matchField !== itemId)) return false;

      const [aptHour, aptMinute] = apt.time.split(':').map(Number);
      const aptStart = aptHour * 60 + aptMinute;
      const aptEnd = aptStart + (apt.duration || 30);

      return slotStart < aptEnd && slotEnd > aptStart;
    });

    if (appointment) {
      return {
        status: 'occupied',
        appointment,
        color: appointmentTypes[appointment.appointmentTypeId]?.colorCode || '#ccc'
      };
    }

    // Check blocked times (only for providers)
    if (isProvider) {
      const blocked = dayBlockedTimes.find(block => {
        if (block.providerId !== itemId) return false;

        const [blockStartHour, blockStartMinute] = block.startTime.split(':').map(Number);
        const [blockEndHour, blockEndMinute] = block.endTime.split(':').map(Number);
        const blockStart = blockStartHour * 60 + blockStartMinute;
        const blockEnd = blockEndHour * 60 + blockEndMinute;

        return slotStart < blockEnd && slotEnd > blockStart;
      });

      if (blocked) {
        return {
          status: 'blocked',
          reason: blocked.reason,
          color: '#666'
        };
      }
    }

    return { status: 'available', color: '#d9ffd9' };
  };

  const handleSlotClick = (itemId, timeSlot, itemType) => {
    const status = getSlotStatus(itemId, timeSlot, itemType === 'provider');
    
    if (status.status === 'available') {
      setSelectedSlot({ itemId, time: timeSlot.time, itemType });
      if (onSlotClick) {
        onSlotClick({
          [itemType === 'provider' ? 'providerId' : 'roomId']: itemId,
          time: timeSlot.time,
          date
        });
      }
    } else if (status.appointment) {
      // Show appointment details
      if (onSlotClick) {
        onSlotClick({
          appointment: status.appointment,
          action: 'view'
        });
      }
    }
  };

  const formatTimeHeader = (slot) => {
    // Only show time at hour marks
    if (slot.minute === 0) {
      return slot.time;
    }
    return '';
  };

  // Calculate grid column span for appointments
  const getAppointmentSpan = (appointment) => {
    const duration = appointment.duration || 30;
    return Math.ceil(duration / 15);
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `120px repeat(${timeSlots.length}, 40px)`,
        gap: '1px',
        backgroundColor: '#e0e0e0',
        padding: '1px',
        minWidth: 'fit-content'
      }}>
        {/* Header Row */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px',
          fontWeight: 'bold',
          position: 'sticky',
          left: 0,
          zIndex: 2
        }}>
          {viewMode === 'room' ? 'Rooms' : 'Providers'}
        </div>
        {timeSlots.map((slot, index) => (
          <div 
            key={slot.time}
            style={{ 
              backgroundColor: '#f0f0f0', 
              padding: '5px 2px',
              fontSize: '11px',
              textAlign: 'center',
              writingMode: 'vertical-lr',
              height: '60px'
            }}
          >
            {formatTimeHeader(slot)}
          </div>
        ))}

        {/* Provider/Room Rows */}
        {displayItems.map(item => (
          <React.Fragment key={item.id}>
            {/* Provider/Room Name */}
            <div style={{ 
              backgroundColor: '#f8f8f8', 
              padding: '10px',
              fontWeight: 'bold',
              fontSize: '13px',
              position: 'sticky',
              left: 0,
              zIndex: 1,
              borderRight: '2px solid #ccc'
            }}>
              {item.name}
              {item.type && (
                <div style={{ fontSize: '11px', color: '#666', fontWeight: 'normal' }}>
                  {item.type}
                </div>
              )}
            </div>

            {/* Time Slots */}
            {timeSlots.map((slot, slotIndex) => {
              const slotStatus = getSlotStatus(
                item.id, 
                slot, 
                viewMode !== 'room'
              );
              const isSelected = selectedSlot?.itemId === item.id && 
                               selectedSlot?.time === slot.time;
              const isHovered = hoveredSlot?.itemId === item.id && 
                              hoveredSlot?.time === slot.time;

              // Check if this slot is part of a longer appointment
              let isPartOfAppointment = false;
              let appointmentStartSlot = slotIndex;
              
              if (slotStatus.appointment) {
                const [aptHour, aptMinute] = slotStatus.appointment.time.split(':').map(Number);
                const aptStartMinutes = aptHour * 60 + aptMinute;
                appointmentStartSlot = timeSlots.findIndex(s => s.totalMinutes === aptStartMinutes);
                isPartOfAppointment = slotIndex !== appointmentStartSlot;
              }

              // Skip rendering if this slot is part of a multi-slot appointment
              if (isPartOfAppointment) {
                return null;
              }

              const colSpan = slotStatus.appointment ? 
                getAppointmentSpan(slotStatus.appointment) : 1;

              return (
                <div
                  key={`${item.id}-${slot.time}`}
                  style={{
                    backgroundColor: slotStatus.color,
                    border: isSelected ? '2px solid #2196F3' : 
                           isHovered ? '2px solid #4CAF50' : 
                           '1px solid transparent',
                    cursor: slotStatus.status === 'available' ? 'pointer' : 
                           slotStatus.appointment ? 'pointer' : 'not-allowed',
                    padding: '4px',
                    fontSize: '11px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    gridColumn: colSpan > 1 ? `span ${colSpan}` : 'auto',
                    position: 'relative'
                  }}
                  onClick={() => handleSlotClick(item.id, slot, viewMode === 'room' ? 'room' : 'provider')}
                  onMouseEnter={() => setHoveredSlot({ itemId: item.id, time: slot.time })}
                  onMouseLeave={() => setHoveredSlot(null)}
                  title={
                    slotStatus.appointment ? 
                      `${slotStatus.appointment.patient} - ${slotStatus.appointment.reason}` :
                    slotStatus.status === 'blocked' ?
                      `Blocked: ${slotStatus.reason || 'Unavailable'}` :
                      `Available - Click to book`
                  }
                >
                  {slotStatus.appointment && (
                    <>
                      <div style={{ fontWeight: 'bold' }}>
                        {slotStatus.appointment.time}
                      </div>
                      <div style={{ fontSize: '10px' }}>
                        {slotStatus.appointment.patient?.split(' ')[0]}
                      </div>
                    </>
                  )}
                  {slotStatus.status === 'blocked' && '❌'}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '10px', 
        display: 'flex', 
        gap: '20px',
        fontSize: '12px',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#d9ffd9', border: '1px solid #ccc' }}></div>
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#666', border: '1px solid #ccc' }}></div>
          <span>Blocked</span>
        </div>
        {Object.entries(appointmentTypes).slice(0, 4).map(([id, type]) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: type.colorCode, 
              border: '1px solid #ccc' 
            }}></div>
            <span>{type.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailabilityGrid;