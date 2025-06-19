import { 
  appointmentTypes, 
  businessHours, 
  schedulingRules,
  calculateEndTime,
  isTimeSlotAvailable,
  getNextAvailableSlot,
  reminderRules
} from '../utils/appointmentRules';

class SchedulingService {
  constructor() {
    this.appointments = new Map();
    this.providers = new Map();
    this.rooms = new Map();
    this.waitlist = [];
    this.blockedTimes = new Map();
    
    // Initialize with default providers
    this.initializeProviders();
    this.initializeRooms();
  }

  initializeProviders() {
    const defaultProviders = [
      { id: 'P001', name: 'Dr. Patterson', type: 'veterinarian', color: '#2196F3' },
      { id: 'P002', name: 'Dr. Lee', type: 'veterinarian', color: '#4CAF50' },
      { id: 'P003', name: 'Dr. Williams', type: 'veterinarian', color: '#FF9800' },
      { id: 'P004', name: 'Dr. Rodriguez', type: 'veterinarian', color: '#9C27B0' },
      { id: 'P005', name: 'Dr. Johnson', type: 'veterinarian', color: '#F44336' },
      { id: 'P006', name: 'Dr. Smith', type: 'veterinarian', color: '#00BCD4' },
      { id: 'P007', name: 'Dr. Davis', type: 'veterinarian', color: '#795548' },
      { id: 'T001', name: 'Tech Sarah', type: 'technician', color: '#607D8B' },
      { id: 'T002', name: 'Tech Mike', type: 'technician', color: '#FF5722' },
      { id: 'G001', name: 'Groomer Lisa', type: 'groomer', color: '#E91E63' }
    ];
    
    defaultProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  initializeRooms() {
    const defaultRooms = [
      { id: 'R001', name: 'Exam Room 1', type: 'exam_room', floor: 1 },
      { id: 'R002', name: 'Exam Room 2', type: 'exam_room', floor: 1 },
      { id: 'R003', name: 'Exam Room 3', type: 'exam_room', floor: 1 },
      { id: 'R004', name: 'Surgery Suite', type: 'surgery_suite', floor: 2 },
      { id: 'R005', name: 'Comfort Room', type: 'comfort_room', floor: 1 },
      { id: 'R006', name: 'Grooming Station 1', type: 'grooming_station', floor: 1 },
      { id: 'R007', name: 'Grooming Station 2', type: 'grooming_station', floor: 1 }
    ];
    
    defaultRooms.forEach(room => {
      this.rooms.set(room.id, room);
    });
  }

  // Check if a specific time slot is available
  checkAvailability(date, time, duration, providerId, roomId = null) {
    const dateKey = this.getDateKey(date);
    const dayAppointments = this.appointments.get(dateKey) || [];
    
    // Check provider availability
    const providerAvailable = isTimeSlotAvailable(
      time, 
      duration, 
      dayAppointments.filter(apt => apt.providerId === providerId),
      providerId
    );
    
    if (!providerAvailable) return { available: false, reason: 'Provider not available' };
    
    // Check room availability if specified
    if (roomId) {
      const roomAvailable = isTimeSlotAvailable(
        time,
        duration,
        dayAppointments.filter(apt => apt.roomId === roomId),
        roomId
      );
      
      if (!roomAvailable) return { available: false, reason: 'Room not available' };
    }
    
    // Check business hours
    if (!this.isWithinBusinessHours(date, time, duration)) {
      return { available: false, reason: 'Outside business hours' };
    }
    
    // Check for blocked times
    if (this.isTimeBlocked(date, time, duration, providerId)) {
      return { available: false, reason: 'Time is blocked' };
    }
    
    return { available: true };
  }

  // Get available time slots for a specific date and provider
  getAvailableSlots(date, providerId, appointmentTypeId, duration = null) {
    const appointmentType = appointmentTypes[appointmentTypeId];
    const totalDuration = duration || (appointmentType.defaultDuration + appointmentType.bufferTime);
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = businessHours[dayOfWeek];
    
    if (dayHours.closed) return [];
    
    const slots = [];
    const dateKey = this.getDateKey(date);
    const dayAppointments = this.appointments.get(dateKey) || [];
    const providerAppointments = dayAppointments.filter(apt => apt.providerId === providerId);
    
    // Generate 15-minute interval slots
    const [openHour, openMinute] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    for (let time = openTime; time + totalDuration <= closeTime; time += 15) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      const availability = this.checkAvailability(date, timeString, totalDuration, providerId);
      if (availability.available) {
        slots.push({
          time: timeString,
          available: true,
          duration: totalDuration,
          endTime: calculateEndTime(timeString, appointmentTypeId)
        });
      }
    }
    
    return slots;
  }

  // Create a new appointment
  createAppointment(appointmentData) {
    const {
      date,
      time,
      patientId,
      clientId,
      providerId,
      appointmentTypeId,
      roomId,
      reason,
      notes,
      duration
    } = appointmentData;
    
    const appointmentType = appointmentTypes[appointmentTypeId];
    const totalDuration = duration || (appointmentType.defaultDuration + appointmentType.bufferTime);
    
    // Validate availability
    const availability = this.checkAvailability(date, time, totalDuration, providerId, roomId);
    if (!availability.available) {
      throw new Error(`Cannot book appointment: ${availability.reason}`);
    }
    
    // Generate appointment ID
    const appointmentId = this.generateAppointmentId();
    
    // Create appointment object
    const appointment = {
      id: appointmentId,
      date,
      time,
      endTime: calculateEndTime(time, appointmentTypeId),
      duration: totalDuration,
      patientId,
      clientId,
      providerId,
      providerName: this.providers.get(providerId)?.name,
      appointmentTypeId,
      appointmentType: appointmentType.name,
      roomId,
      roomName: this.rooms.get(roomId)?.name,
      reason,
      notes,
      status: 'scheduled',
      colorCode: appointmentType.colorCode,
      createdAt: new Date().toISOString(),
      confirmationSent: false,
      reminders: this.scheduleReminders(appointmentTypeId, date, time)
    };
    
    // Store appointment
    const dateKey = this.getDateKey(date);
    if (!this.appointments.has(dateKey)) {
      this.appointments.set(dateKey, []);
    }
    this.appointments.get(dateKey).push(appointment);
    
    return appointment;
  }

  // Update appointment status
  updateAppointmentStatus(appointmentId, status) {
    const appointment = this.findAppointment(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    appointment.status = status;
    appointment.statusUpdatedAt = new Date().toISOString();
    
    // Handle specific status changes
    switch (status) {
      case 'confirmed':
        appointment.confirmedAt = new Date().toISOString();
        break;
      case 'arrived':
        appointment.arrivedAt = new Date().toISOString();
        break;
      case 'in_progress':
        appointment.startedAt = new Date().toISOString();
        break;
      case 'completed':
        appointment.completedAt = new Date().toISOString();
        break;
      case 'no_show':
        this.handleNoShow(appointment);
        break;
      case 'cancelled':
        this.handleCancellation(appointment);
        break;
    }
    
    return appointment;
  }

  // Reschedule appointment
  rescheduleAppointment(appointmentId, newDate, newTime, newProviderId = null) {
    const appointment = this.findAppointment(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    const providerId = newProviderId || appointment.providerId;
    
    // Check new time availability
    const availability = this.checkAvailability(
      newDate, 
      newTime, 
      appointment.duration, 
      providerId, 
      appointment.roomId
    );
    
    if (!availability.available) {
      throw new Error(`Cannot reschedule: ${availability.reason}`);
    }
    
    // Remove from old date
    const oldDateKey = this.getDateKey(appointment.date);
    const oldDateAppointments = this.appointments.get(oldDateKey) || [];
    const index = oldDateAppointments.findIndex(apt => apt.id === appointmentId);
    if (index > -1) {
      oldDateAppointments.splice(index, 1);
    }
    
    // Update appointment
    appointment.date = newDate;
    appointment.time = newTime;
    appointment.providerId = providerId;
    appointment.providerName = this.providers.get(providerId)?.name;
    appointment.rescheduledAt = new Date().toISOString();
    appointment.rescheduleCount = (appointment.rescheduleCount || 0) + 1;
    
    // Add to new date
    const newDateKey = this.getDateKey(newDate);
    if (!this.appointments.has(newDateKey)) {
      this.appointments.set(newDateKey, []);
    }
    this.appointments.get(newDateKey).push(appointment);
    
    // Reschedule reminders
    appointment.reminders = this.scheduleReminders(appointment.appointmentTypeId, newDate, newTime);
    
    return appointment;
  }

  // Cancel appointment
  cancelAppointment(appointmentId, reason = '') {
    const appointment = this.findAppointment(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date().toISOString();
    appointment.cancellationReason = reason;
    
    // Check waitlist for this appointment type and date
    this.processWaitlist(appointment.date, appointment.appointmentTypeId, appointment.providerId);
    
    return appointment;
  }

  // Add to waitlist
  addToWaitlist(waitlistData) {
    const {
      patientId,
      clientId,
      appointmentTypeId,
      preferredDates,
      preferredProviders,
      priority = 'routine',
      notes
    } = waitlistData;
    
    const waitlistEntry = {
      id: this.generateWaitlistId(),
      patientId,
      clientId,
      appointmentTypeId,
      preferredDates,
      preferredProviders,
      priority,
      notes,
      createdAt: new Date().toISOString(),
      status: 'waiting'
    };
    
    this.waitlist.push(waitlistEntry);
    this.waitlist.sort((a, b) => {
      // Sort by priority then by creation date
      const priorityOrder = { emergency: 0, urgent: 1, routine: 2, convenience: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    
    return waitlistEntry;
  }

  // Process waitlist when appointment becomes available
  processWaitlist(date, appointmentTypeId, providerId) {
    const eligibleEntries = this.waitlist.filter(entry => 
      entry.status === 'waiting' &&
      entry.appointmentTypeId === appointmentTypeId &&
      (!entry.preferredProviders || entry.preferredProviders.includes(providerId)) &&
      (!entry.preferredDates || entry.preferredDates.includes(date))
    );
    
    // Notify eligible waitlist entries (in real app, would send notifications)
    eligibleEntries.forEach(entry => {
      entry.notifiedAt = new Date().toISOString();
      entry.status = 'notified';
    });
    
    return eligibleEntries;
  }

  // Block time for provider
  blockTime(providerId, date, startTime, endTime, reason = '') {
    const dateKey = this.getDateKey(date);
    if (!this.blockedTimes.has(dateKey)) {
      this.blockedTimes.set(dateKey, []);
    }
    
    this.blockedTimes.get(dateKey).push({
      providerId,
      startTime,
      endTime,
      reason,
      createdAt: new Date().toISOString()
    });
  }

  // Create recurring appointments
  createRecurringAppointments(appointmentData, recurrencePattern) {
    const {
      frequency, // 'weekly', 'biweekly', 'monthly'
      count, // number of occurrences
      endDate // or end by date
    } = recurrencePattern;
    
    const appointments = [];
    let currentDate = new Date(appointmentData.date);
    let occurrenceCount = 0;
    
    while (occurrenceCount < count || (endDate && currentDate <= new Date(endDate))) {
      try {
        const appointment = this.createAppointment({
          ...appointmentData,
          date: currentDate.toISOString().split('T')[0]
        });
        appointments.push(appointment);
        occurrenceCount++;
      } catch (error) {
        // Skip if slot not available
      }
      
      // Calculate next occurrence
      switch (frequency) {
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
    
    return appointments;
  }

  // Helper methods
  getDateKey(date) {
    return typeof date === 'string' ? date : date.toISOString().split('T')[0];
  }

  generateAppointmentId() {
    return `APT${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }

  generateWaitlistId() {
    return `WL${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }

  findAppointment(appointmentId) {
    for (const [dateKey, appointments] of this.appointments) {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (appointment) return appointment;
    }
    return null;
  }

  isWithinBusinessHours(date, time, duration) {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = businessHours[dayOfWeek];
    
    if (dayHours.closed) return false;
    
    const [startHour, startMinute] = time.split(':').map(Number);
    const [openHour, openMinute] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = startTime + duration;
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    return startTime >= openTime && endTime <= closeTime;
  }

  isTimeBlocked(date, time, duration, providerId) {
    const dateKey = this.getDateKey(date);
    const blockedList = this.blockedTimes.get(dateKey) || [];
    
    return blockedList.some(block => {
      if (block.providerId !== providerId) return false;
      
      const [startHour, startMinute] = time.split(':').map(Number);
      const [blockStartHour, blockStartMinute] = block.startTime.split(':').map(Number);
      const [blockEndHour, blockEndMinute] = block.endTime.split(':').map(Number);
      
      const startTime = startHour * 60 + startMinute;
      const endTime = startTime + duration;
      const blockStart = blockStartHour * 60 + blockStartMinute;
      const blockEnd = blockEndHour * 60 + blockEndMinute;
      
      return startTime < blockEnd && endTime > blockStart;
    });
  }

  scheduleReminders(appointmentTypeId, date, time) {
    const reminders = [];
    const appointmentDateTime = new Date(`${date}T${time}`);
    const rules = reminderRules[appointmentTypeId] || reminderRules.defaultReminders;
    
    rules.forEach(rule => {
      const reminderDate = new Date(appointmentDateTime);
      reminderDate.setDate(reminderDate.getDate() - rule.daysBefore);
      
      reminders.push({
        id: this.generateReminderId(),
        scheduledFor: reminderDate.toISOString(),
        method: rule.method,
        message: rule.message || `Reminder: You have an appointment on ${date} at ${time}`,
        status: 'scheduled'
      });
    });
    
    return reminders;
  }

  generateReminderId() {
    return `REM${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }

  handleNoShow(appointment) {
    // Track no-show history (in real app, would update client record)
    appointment.noShowRecorded = true;
  }

  handleCancellation(appointment) {
    // Check cancellation policy
    const now = new Date();
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilAppointment < schedulingRules.cancellationWindow) {
      appointment.lateCancellation = true;
    }
  }

  // Get appointments for a specific date range
  getAppointments(startDate, endDate, filters = {}) {
    const appointments = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateKey = this.getDateKey(date);
      const dayAppointments = this.appointments.get(dateKey) || [];
      
      const filtered = dayAppointments.filter(apt => {
        if (filters.providerId && apt.providerId !== filters.providerId) return false;
        if (filters.status && apt.status !== filters.status) return false;
        if (filters.appointmentTypeId && apt.appointmentTypeId !== filters.appointmentTypeId) return false;
        if (filters.patientId && apt.patientId !== filters.patientId) return false;
        return true;
      });
      
      appointments.push(...filtered);
    }
    
    return appointments.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }

  // Get provider schedule
  getProviderSchedule(providerId, date) {
    const dateKey = this.getDateKey(date);
    const appointments = this.appointments.get(dateKey) || [];
    const providerAppointments = appointments.filter(apt => apt.providerId === providerId);
    const blockedTimes = (this.blockedTimes.get(dateKey) || []).filter(block => block.providerId === providerId);
    
    return {
      appointments: providerAppointments,
      blockedTimes,
      provider: this.providers.get(providerId)
    };
  }

  // Get room schedule
  getRoomSchedule(roomId, date) {
    const dateKey = this.getDateKey(date);
    const appointments = this.appointments.get(dateKey) || [];
    const roomAppointments = appointments.filter(apt => apt.roomId === roomId);
    
    return {
      appointments: roomAppointments,
      room: this.rooms.get(roomId)
    };
  }

  // Send appointment confirmation (simulated)
  sendConfirmation(appointmentId, method = 'email') {
    const appointment = this.findAppointment(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    appointment.confirmationSent = true;
    appointment.confirmationMethod = method;
    appointment.confirmationSentAt = new Date().toISOString();
    
    // In real app, would integrate with communication service
    return {
      success: true,
      method,
      message: `Confirmation sent via ${method}`
    };
  }

  // Export appointments for reporting
  exportAppointments(startDate, endDate, format = 'json') {
    const appointments = this.getAppointments(startDate, endDate);
    
    switch (format) {
      case 'csv':
        return this.convertToCSV(appointments);
      case 'json':
      default:
        return JSON.stringify(appointments, null, 2);
    }
  }

  convertToCSV(appointments) {
    const headers = ['Date', 'Time', 'Patient ID', 'Client ID', 'Provider', 'Type', 'Status', 'Room'];
    const rows = appointments.map(apt => [
      apt.date,
      apt.time,
      apt.patientId,
      apt.clientId,
      apt.providerName,
      apt.appointmentType,
      apt.status,
      apt.roomName || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Create singleton instance
const schedulingService = new SchedulingService();

export default schedulingService;