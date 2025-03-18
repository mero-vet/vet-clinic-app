import React, { createContext, useContext, useState, useEffect } from 'react';

// A simple context for scheduling appointments.
// We'll assume each appointment has { id, date, time, reason, patient, staff }.

const SchedulingContext = createContext();

// Helper function to generate dates for 8 weeks starting from a base date
const generateDates = () => {
  const dates = [];
  const startDate = new Date('2024-03-17');
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 5; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + (week * 7) + day);
      dates.push(currentDate.toISOString().split('T')[0]);
    }
  }
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
  // Force clear localStorage on initial load to refresh appointments
  localStorage.removeItem('sessionAppointments');

  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('sessionAppointments');
    return savedAppointments ? JSON.parse(savedAppointments) : generateInitialAppointments();
  });

  // Update localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('sessionAppointments', JSON.stringify(appointments));
  }, [appointments]);

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
    localStorage.removeItem('sessionAppointments');
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