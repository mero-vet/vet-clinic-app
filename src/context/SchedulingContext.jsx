import React, { createContext, useContext, useState, useEffect } from 'react';

// A simple context for scheduling appointments.
// We'll assume each appointment has { id, date, time, reason, patient, staff }.

const SchedulingContext = createContext();

// Helper function to generate dates for 6 weeks starting from current week's Monday
const generateDates = () => {
  const dates = [];

  // Get current date and log it for debugging
  const today = new Date();
  console.log('SchedulingContext - Today:', today.toISOString());

  // Find the Monday of the current week
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days, otherwise find previous Monday
  console.log('SchedulingContext - Monday offset:', mondayOffset);

  // Create a new date object for current week's Monday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + mondayOffset);

  // Reset time to 00:00:00 to avoid any time-related issues
  startDate.setHours(0, 0, 0, 0);

  console.log('SchedulingContext - Calendar start date:', startDate.toISOString());

  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 5; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + (week * 7) + day);
      dates.push(currentDate.toISOString().split('T')[0]);
    }
  }

  // Log first week's dates for debugging
  console.log('SchedulingContext - First week dates:', dates.slice(0, 5));

  return dates;
};

// Helper function to generate appointments
const generateInitialAppointments = () => {
  const dates = generateDates();
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const reasons = [
    'Wellness Check',
    'Vaccine Booster',
    'Dental Cleaning',
    'Surgery',
    'X-Ray',
    'Blood Work',
    'Check-up',
    'Grooming',
    'Nail Trimming',
    'Spay/Neuter Consult',
    'Allergy Assessment',
    'Annual Physical',
    'Microchip Installation'
  ];
  const patients = ['Bella (Canine)', 'Max (Feline)', 'Rocky (Canine)', 'Luna (Feline)', 'Charlie (Canine)', 'Coco (Feline)', 'Buddy (Canine)', 'Lucy (Feline)'];
  const staff = ['Dr. Smith', 'Dr. Adams', 'Dr. Davis', 'Dr. Wilson'];
  // Sample client IDs
  const clientIds = ['CL001', 'CL002', 'CL003', 'CL004', 'CL005', 'CL006', 'CL007', 'CL008'];

  const appointments = [];
  let id = 1;

  dates.forEach(date => {
    times.forEach(time => {
      // 80% chance of having an appointment
      if (Math.random() < 0.8) {
        const patientIndex = Math.floor(Math.random() * patients.length);
        appointments.push({
          id: id++,
          date,
          time,
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          patient: patients[patientIndex],
          clientId: clientIds[patientIndex], // Match client ID to patient
          staff: staff[Math.floor(Math.random() * staff.length)]
        });
      }
    });
  });

  return appointments;
};

export const SchedulingProvider = ({ children }) => {
  // Don't check localStorage, always generate new appointments
  const [appointments, setAppointments] = useState(generateInitialAppointments);

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
    setAppointments(generateInitialAppointments());
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