import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import schedulingService from '../services/SchedulingService';
import { appointmentTypes, businessHours } from '../utils/appointmentRules';

// Enhanced scheduling context with full appointment management features
// Integrates with SchedulingService for business logic and validation

const SchedulingContext = createContext();

// Helper function to generate dates for multiple weeks
const generateDates = (startDate, weeksToGenerate = 6) => {
  const dates = [];

  // Parse the startDate string to a Date object
  const baseDate = new Date(startDate + 'T00:00:00'); // Ensure consistent parsing

  // Generate weeks of dates (all 7 days of the week)
  for (let week = 0; week < weeksToGenerate; week++) {
    for (let day = 0; day < 7; day++) {
      // Calculate date by adding days to the base date
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + (week * 7) + day);
      const dateString = currentDate.toISOString().split('T')[0];
      dates.push(dateString);
    }
  }

  return dates;
};

// Helper function to generate random appointments with 80% of slots filled
const generateRandomAppointments = () => {
  // Start from tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Reset time to start of day
  const tomorrowString = tomorrow.toISOString().split('T')[0];
  
  const dates = generateDates(tomorrowString, 6);
  // Mix of 30-minute and 1-hour slots for more realistic scheduling
  const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  const reasons = [
    'Annual Wellness Exam',
    'Vaccine Booster',
    'Dental Cleaning',
    'Spay/Neuter Surgery',
    'Digital X-Ray',
    'Blood Test - CBC',
    'Urinalysis',
    'Heartworm Test',
    'Sick Visit - Vomiting',
    'Sick Visit - Limping',
    'Mass Removal',
    'Dental Extractions',
    'Microchipping',
    'Skin Condition',
    'Ear Infection',
    'Eye Examination',
    'Post-Surgery Recheck',
    'Senior Wellness Exam',
    'Puppy/Kitten Visit',
    'Nail Trim'
  ];
  
  const dogNames = ['Max', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Bailey', 'Daisy', 'Rocky', 'Sadie', 'Duke', 'Molly', 'Tucker', 'Bear', 'Maggie', 'Oliver', 'Zoey', 'Buddy', 'Lily', 'Jack', 'Sophie'];
  const catNames = ['Luna', 'Milo', 'Simba', 'Chloe', 'Leo', 'Kitty', 'Smokey', 'Shadow', 'Tiger', 'Oreo', 'Coco', 'Felix', 'Jasper', 'Mittens', 'Oscar', 'Pepper', 'Sam', 'Princess', 'Chester', 'Misty'];
  const otherNames = ['Nibbles', 'Thumper', 'Snowball', 'Patches', 'Cinnamon'];
  
  const species = ['Canine', 'Feline', 'Rabbit', 'Guinea Pig', 'Ferret'];
  const speciesDistribution = [0.6, 0.35, 0.03, 0.01, 0.01]; // 60% dogs, 35% cats, 5% other
  
  const staff = ['Dr. Patterson', 'Dr. Lee', 'Dr. Williams', 'Dr. Rodriguez', 'Dr. Johnson', 'Dr. Smith', 'Dr. Davis'];
  
  // Generate more diverse client IDs
  const generateClientId = () => `CL${String(Math.floor(Math.random() * 9000) + 1000)}`;

  const appointments = [];
  let id = 1;

  // Helper function to get a random species based on distribution
  const getRandomSpecies = () => {
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < species.length; i++) {
      cumulative += speciesDistribution[i];
      if (rand < cumulative) {
        return species[i];
      }
    }
    return species[0]; // fallback to Canine
  };

  // Helper function to get a random pet name based on species
  const getRandomPetName = (speciesType) => {
    let namePool;
    switch (speciesType) {
      case 'Canine':
        namePool = dogNames;
        break;
      case 'Feline':
        namePool = catNames;
        break;
      default:
        namePool = otherNames;
    }
    return namePool[Math.floor(Math.random() * namePool.length)];
  };

  // Generate appointments with 80% probability for each slot on weekdays only
  dates.forEach(date => {
    // Skip weekends for appointment generation
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday

    if (!isWeekend) {
      times.forEach(time => {
        // 80% chance of having an appointment (slot not available)
        if (Math.random() < 0.8) {
          const selectedSpecies = getRandomSpecies();
          const petName = getRandomPetName(selectedSpecies);
          const selectedReason = reasons[Math.floor(Math.random() * reasons.length)];
          const selectedStaff = staff[Math.floor(Math.random() * staff.length)];

          appointments.push({
            id: id++,
            date,
            time,
            reason: selectedReason,
            patient: `${petName} (${selectedSpecies})`,
            clientId: generateClientId(),
            patientId: `P${String(Math.floor(Math.random() * 9000) + 1000)}`,
            staff: selectedStaff
          });
        }
      });
    }
  });

  return appointments;
};

export const SchedulingProvider = ({ children }) => {
  // Generate fresh appointments on every mount (page refresh)
  const [appointments, setAppointments] = useState(() => generateRandomAppointments());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState('P001'); // Default to Dr. Patterson
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'
  const [confirmationDialog, setConfirmationDialog] = useState(null);
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [blockedTimes, setBlockedTimes] = useState([]);

  // Initialize service with existing appointments
  useEffect(() => {
    // Convert existing appointments to service format
    appointments.forEach(apt => {
      try {
        const appointmentType = Object.values(appointmentTypes).find(type => 
          type.name.toLowerCase().includes(apt.reason.toLowerCase().split(' ')[0])
        ) || appointmentTypes.sick;

        schedulingService.createAppointment({
          date: apt.date,
          time: apt.time,
          patientId: apt.patientId,
          clientId: apt.clientId,
          providerId: apt.staff.includes('Patterson') ? 'P001' :
                      apt.staff.includes('Lee') ? 'P002' :
                      apt.staff.includes('Williams') ? 'P003' :
                      apt.staff.includes('Rodriguez') ? 'P004' :
                      apt.staff.includes('Johnson') ? 'P005' :
                      apt.staff.includes('Smith') ? 'P006' : 'P007',
          appointmentTypeId: appointmentType.id,
          roomId: 'R001', // Default room
          reason: apt.reason,
          notes: '',
          duration: appointmentType.defaultDuration + appointmentType.bufferTime
        });
      } catch (error) {
        // Skip if appointment can't be created (conflicts, etc.)
      }
    });
  }, []);

  // Get providers list
  const providers = useMemo(() => {
    return Array.from(schedulingService.providers.values());
  }, []);

  // Get rooms list
  const rooms = useMemo(() => {
    return Array.from(schedulingService.rooms.values());
  }, []);

  // Enhanced appointment management functions
  const addAppointment = useCallback((appointmentData) => {
    try {
      const appointment = schedulingService.createAppointment(appointmentData);
      
      // Update local state
      setAppointments(prev => [...prev, {
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
        patient: `${appointmentData.patientName || 'Unknown'} (${appointmentData.species || 'Unknown'})`,
        clientId: appointment.clientId,
        patientId: appointment.patientId,
        staff: appointment.providerName,
        duration: appointment.duration,
        status: appointment.status,
        appointmentType: appointment.appointmentType,
        roomId: appointment.roomId,
        roomName: appointment.roomName
      }]);

      // Show confirmation dialog
      setConfirmationDialog({
        appointment,
        action: 'created'
      });

      return { success: true, appointment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const updateAppointmentStatus = useCallback((appointmentId, status) => {
    try {
      const updatedAppointment = schedulingService.updateAppointmentStatus(appointmentId, status);
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status } : apt
      ));

      return { success: true, appointment: updatedAppointment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const rescheduleAppointment = useCallback((appointmentId, newDate, newTime, newProviderId) => {
    try {
      const appointment = schedulingService.rescheduleAppointment(
        appointmentId, 
        newDate, 
        newTime, 
        newProviderId
      );
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { 
              ...apt, 
              date: newDate, 
              time: newTime, 
              staff: appointment.providerName 
            } 
          : apt
      ));

      setConfirmationDialog({
        appointment,
        action: 'rescheduled'
      });

      return { success: true, appointment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const cancelAppointment = useCallback((appointmentId, reason) => {
    try {
      const appointment = schedulingService.cancelAppointment(appointmentId, reason);
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));

      return { success: true, appointment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const removeAppointment = useCallback((appointmentId) => {
    setAppointments((prev) => prev.filter(appt => appt.id !== appointmentId));
  }, []);

  const clearAppointments = useCallback(() => {
    // Generate fresh random appointments
    setAppointments(generateRandomAppointments());
  }, []);

  // Availability checking
  const checkAvailability = useCallback((date, time, duration, providerId, roomId) => {
    return schedulingService.checkAvailability(date, time, duration, providerId, roomId);
  }, []);

  const getAvailableSlots = useCallback((date, providerId, appointmentTypeId, duration) => {
    return schedulingService.getAvailableSlots(date, providerId, appointmentTypeId, duration);
  }, []);

  // Waitlist management
  const addToWaitlist = useCallback((waitlistData) => {
    const entry = schedulingService.addToWaitlist(waitlistData);
    setWaitlistEntries(prev => [...prev, entry]);
    return entry;
  }, []);

  // Block time management
  const blockTime = useCallback((providerId, date, startTime, endTime, reason) => {
    schedulingService.blockTime(providerId, date, startTime, endTime, reason);
    setBlockedTimes(prev => [...prev, { providerId, date, startTime, endTime, reason }]);
  }, []);

  // Send confirmation
  const sendConfirmation = useCallback((appointmentId, method) => {
    return schedulingService.sendConfirmation(appointmentId, method);
  }, []);

  // Get appointments with filters
  const getAppointments = useCallback((startDate, endDate, filters) => {
    return schedulingService.getAppointments(startDate, endDate, filters);
  }, []);

  // Get provider schedule
  const getProviderSchedule = useCallback((providerId, date) => {
    return schedulingService.getProviderSchedule(providerId, date);
  }, []);

  // Create recurring appointments
  const createRecurringAppointments = useCallback((appointmentData, recurrencePattern) => {
    const appointments = schedulingService.createRecurringAppointments(
      appointmentData, 
      recurrencePattern
    );
    
    // Update local state with new appointments
    appointments.forEach(apt => {
      setAppointments(prev => [...prev, {
        id: apt.id,
        date: apt.date,
        time: apt.time,
        reason: apt.reason,
        patient: `${appointmentData.patientName || 'Unknown'} (${appointmentData.species || 'Unknown'})`,
        clientId: apt.clientId,
        patientId: apt.patientId,
        staff: apt.providerName,
        duration: apt.duration,
        status: apt.status
      }]);
    });

    return appointments;
  }, []);

  // Context value with all scheduling features
  const contextValue = {
    // State
    appointments,
    selectedDate,
    selectedProvider,
    viewMode,
    confirmationDialog,
    waitlistEntries,
    blockedTimes,
    providers,
    rooms,
    appointmentTypes,
    businessHours,
    
    // State setters
    setSelectedDate,
    setSelectedProvider,
    setViewMode,
    setConfirmationDialog,
    
    // Appointment management
    addAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    cancelAppointment,
    removeAppointment,
    clearAppointments,
    
    // Availability
    checkAvailability,
    getAvailableSlots,
    
    // Waitlist
    addToWaitlist,
    
    // Time blocking
    blockTime,
    
    // Confirmations
    sendConfirmation,
    
    // Queries
    getAppointments,
    getProviderSchedule,
    
    // Recurring appointments
    createRecurringAppointments
  };

  return (
    <SchedulingContext.Provider value={contextValue}>
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = () => {
  return useContext(SchedulingContext);
};