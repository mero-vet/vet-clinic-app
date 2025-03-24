import React, { createContext, useContext, useState } from 'react';

// A simple context for scheduling appointments.
// We'll assume each appointment has { id, date, time, reason, patient, staff }.

const SchedulingContext = createContext();

// Helper function to generate dates for multiple weeks
const generateDates = (startDate, weeksToGenerate = 6) => {
  const dates = [];

  // Parse the startDate string to a Date object
  const baseDate = new Date(startDate);

  // Generate weeks of dates (all 7 days of the week)
  for (let week = 0; week < weeksToGenerate; week++) {
    for (let day = 0; day < 7; day++) { // Monday to Sunday (0-6)
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
  // Monday, March 17, 2025 as base date
  const dates = generateDates('2025-03-17', 6);
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const reasons = [
    'Wellness Check',
    'Vaccine Booster',
    'Dental Cleaning',
    'Surgery',
    'X-Ray',
    'Blood Work'
  ];
  const patients = ['Bella (Canine)', 'Max (Feline)', 'Rocky (Canine)', 'Luna (Feline)'];
  const staff = ['Dr. Smith', 'Dr. Adams', 'Dr. Davis', 'Dr. Wilson'];
  const clientIds = ['CL001', 'CL002', 'CL003', 'CL004'];

  const appointments = [];
  let id = 1;

  // Generate appointments with 80% probability for each slot on weekdays only
  dates.forEach(date => {
    // Skip weekends for appointment generation
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday

    if (!isWeekend) {
      times.forEach(time => {
        // 80% chance of having an appointment (slot not available)
        if (Math.random() < 0.8) {
          const patientIndex = Math.floor(Math.random() * patients.length);

          appointments.push({
            id: id++,
            date,
            time,
            reason: reasons[Math.floor(Math.random() * reasons.length)],
            patient: patients[patientIndex],
            clientId: clientIds[patientIndex],
            staff: staff[Math.floor(Math.random() * staff.length)]
          });
        }
      });
    }
  });

  return appointments;
};

// Generate appointments once on module load
const INITIAL_APPOINTMENTS = generateRandomAppointments();

export const SchedulingProvider = ({ children }) => {
  // Start with the fixed set of appointments
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const addAppointment = (newAppt) => {
    setAppointments((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newAppt,
      },
    ]);
  };

  const removeAppointment = (appointmentId) => {
    setAppointments((prev) => prev.filter(appt => appt.id !== appointmentId));
  };

  const clearAppointments = () => {
    // Reset to the original appointments
    setAppointments(INITIAL_APPOINTMENTS);
  };

  return (
    <SchedulingContext.Provider value={{
      appointments,
      addAppointment,
      removeAppointment,
      clearAppointments
    }}>
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = () => {
  return useContext(SchedulingContext);
};