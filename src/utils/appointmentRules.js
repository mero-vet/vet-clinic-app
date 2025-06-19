// Appointment type definitions with durations and resource requirements
export const appointmentTypes = {
  wellness: {
    id: 'wellness',
    name: 'Annual Wellness Exam',
    defaultDuration: 30,
    bufferTime: 10,
    requiredResources: ['exam_room'],
    colorCode: '#4CAF50',
    description: 'Annual checkup with vaccines',
    priceRange: '$65-$150'
  },
  sick: {
    id: 'sick',
    name: 'Sick Visit',
    defaultDuration: 30,
    bufferTime: 10,
    requiredResources: ['exam_room'],
    colorCode: '#FF9800',
    description: 'Illness or injury examination',
    priceRange: '$65-$100'
  },
  surgery: {
    id: 'surgery',
    name: 'Surgery',
    defaultDuration: 120,
    bufferTime: 30,
    requiredResources: ['surgery_suite', 'surgery_tech'],
    colorCode: '#F44336',
    description: 'Surgical procedures',
    priceRange: '$300-$2000',
    requiresPreAuth: true
  },
  dental: {
    id: 'dental',
    name: 'Dental Cleaning',
    defaultDuration: 90,
    bufferTime: 20,
    requiredResources: ['surgery_suite', 'dental_tech'],
    colorCode: '#9C27B0',
    description: 'Teeth cleaning and oral exam',
    priceRange: '$250-$600'
  },
  grooming: {
    id: 'grooming',
    name: 'Grooming',
    defaultDuration: 60,
    bufferTime: 15,
    requiredResources: ['grooming_station'],
    colorCode: '#2196F3',
    description: 'Bath, haircut, nail trim',
    priceRange: '$45-$120'
  },
  vaccination: {
    id: 'vaccination',
    name: 'Vaccine Only',
    defaultDuration: 15,
    bufferTime: 5,
    requiredResources: ['exam_room'],
    colorCode: '#00BCD4',
    description: 'Vaccine administration only',
    priceRange: '$25-$45'
  },
  followup: {
    id: 'followup',
    name: 'Follow-up/Recheck',
    defaultDuration: 20,
    bufferTime: 5,
    requiredResources: ['exam_room'],
    colorCode: '#607D8B',
    description: 'Post-treatment recheck',
    priceRange: '$35-$65'
  },
  emergency: {
    id: 'emergency',
    name: 'Emergency',
    defaultDuration: 45,
    bufferTime: 0,
    requiredResources: ['exam_room', 'emergency_staff'],
    colorCode: '#FF0000',
    description: 'Urgent medical attention',
    priceRange: '$150-$500',
    priority: 'high'
  },
  boarding: {
    id: 'boarding',
    name: 'Boarding Drop-off/Pick-up',
    defaultDuration: 15,
    bufferTime: 5,
    requiredResources: ['boarding_staff'],
    colorCode: '#795548',
    description: 'Pet boarding services',
    priceRange: '$30-$60/day'
  },
  euthanasia: {
    id: 'euthanasia',
    name: 'Euthanasia',
    defaultDuration: 45,
    bufferTime: 30,
    requiredResources: ['comfort_room'],
    colorCode: '#000000',
    description: 'End of life care',
    priceRange: '$100-$300',
    requiresPrivacy: true
  }
};

// Provider types and their available appointment types
export const providerTypes = {
  veterinarian: {
    availableAppointments: Object.keys(appointmentTypes),
    defaultAppointmentLength: 30
  },
  technician: {
    availableAppointments: ['vaccination', 'followup', 'boarding'],
    defaultAppointmentLength: 20
  },
  groomer: {
    availableAppointments: ['grooming'],
    defaultAppointmentLength: 60
  }
};

// Room types and their capabilities
export const roomTypes = {
  exam_room: {
    id: 'exam_room',
    name: 'Exam Room',
    supportedAppointments: ['wellness', 'sick', 'vaccination', 'followup', 'emergency'],
    maxOccupancy: 1
  },
  surgery_suite: {
    id: 'surgery_suite',
    name: 'Surgery Suite',
    supportedAppointments: ['surgery', 'dental'],
    maxOccupancy: 1,
    requiresCleaning: true,
    cleaningTime: 30
  },
  comfort_room: {
    id: 'comfort_room',
    name: 'Comfort Room',
    supportedAppointments: ['euthanasia'],
    maxOccupancy: 1,
    privateRoom: true
  },
  grooming_station: {
    id: 'grooming_station',
    name: 'Grooming Station',
    supportedAppointments: ['grooming'],
    maxOccupancy: 1
  }
};

// Business hours configuration
export const businessHours = {
  monday: { open: '08:00', close: '18:00' },
  tuesday: { open: '08:00', close: '18:00' },
  wednesday: { open: '08:00', close: '18:00' },
  thursday: { open: '08:00', close: '18:00' },
  friday: { open: '08:00', close: '18:00' },
  saturday: { open: '09:00', close: '14:00' },
  sunday: { closed: true }
};

// Scheduling rules and constraints
export const schedulingRules = {
  // Minimum time between appointments for the same provider
  minTimeBetweenAppointments: 0,
  
  // Maximum appointments per day per provider
  maxAppointmentsPerDay: {
    veterinarian: 20,
    technician: 30,
    groomer: 8
  },
  
  // Lunch break configuration
  lunchBreak: {
    start: '12:00',
    end: '13:00',
    applyTo: ['veterinarian', 'technician']
  },
  
  // Double booking rules
  allowDoubleBooking: {
    vaccination: true, // Allow vaccine appointments to overlap
    followup: true
  },
  
  // Advance booking limits (in days)
  advanceBookingLimit: 90,
  
  // Same day appointment cutoff time
  sameDayBookingCutoff: '16:00',
  
  // Cancellation policy (hours before appointment)
  cancellationWindow: 24,
  
  // No-show policy
  noShowLimit: 3, // Number of no-shows before requiring prepayment
  
  // Emergency appointment rules
  emergencySlots: {
    reservePerDay: 2,
    maxDuration: 45
  }
};

// Helper functions for appointment scheduling
export const calculateEndTime = (startTime, appointmentTypeId) => {
  const appointmentType = appointmentTypes[appointmentTypeId];
  if (!appointmentType) return null;
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + appointmentType.defaultDuration + appointmentType.bufferTime;
  
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

export const isTimeSlotAvailable = (startTime, duration, existingAppointments, providerId) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = startTotalMinutes + duration;
  
  return !existingAppointments.some(appt => {
    if (appt.providerId !== providerId) return false;
    
    const [apptStartHours, apptStartMinutes] = appt.time.split(':').map(Number);
    const apptStartTotal = apptStartHours * 60 + apptStartMinutes;
    const apptEndTotal = apptStartTotal + appt.duration;
    
    // Check for overlap
    return (startTotalMinutes < apptEndTotal && endTotalMinutes > apptStartTotal);
  });
};

export const getNextAvailableSlot = (date, appointmentTypeId, providerId, existingAppointments) => {
  const appointmentType = appointmentTypes[appointmentTypeId];
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
  const dayHours = businessHours[dayOfWeek];
  
  if (dayHours.closed) return null;
  
  const [openHour, openMinute] = dayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);
  const openTotalMinutes = openHour * 60 + openMinute;
  const closeTotalMinutes = closeHour * 60 + closeMinute;
  
  const duration = appointmentType.defaultDuration + appointmentType.bufferTime;
  
  // Check every 15-minute interval
  for (let time = openTotalMinutes; time + duration <= closeTotalMinutes; time += 15) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Skip lunch break
    if (schedulingRules.lunchBreak.applyTo.includes('veterinarian')) {
      const [lunchStartHour, lunchStartMinute] = schedulingRules.lunchBreak.start.split(':').map(Number);
      const [lunchEndHour, lunchEndMinute] = schedulingRules.lunchBreak.end.split(':').map(Number);
      const lunchStart = lunchStartHour * 60 + lunchStartMinute;
      const lunchEnd = lunchEndHour * 60 + lunchEndMinute;
      
      if (time < lunchEnd && time + duration > lunchStart) continue;
    }
    
    if (isTimeSlotAvailable(timeString, duration, existingAppointments, providerId)) {
      return timeString;
    }
  }
  
  return null;
};

// Reminder configuration
export const reminderRules = {
  defaultReminders: [
    { daysBefore: 1, method: 'sms', time: '10:00' },
    { daysBefore: 1, method: 'email', time: '10:00' }
  ],
  surgeryReminders: [
    { daysBefore: 7, method: 'email', time: '10:00', message: 'Pre-surgery instructions' },
    { daysBefore: 2, method: 'sms', time: '14:00', message: 'Surgery reminder' },
    { daysBefore: 1, method: 'sms', time: '17:00', message: 'NPO reminder' }
  ],
  wellnessReminders: [
    { daysBefore: 7, method: 'email', time: '10:00' },
    { daysBefore: 1, method: 'sms', time: '10:00' }
  ]
};

// Waitlist priorities
export const waitlistPriorities = {
  emergency: 1,
  urgent: 2,
  routine: 3,
  convenience: 4
};