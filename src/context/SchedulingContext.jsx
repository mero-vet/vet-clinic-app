import React, { createContext, useContext, useState, useEffect } from 'react';

// A simple context for scheduling appointments.
// We'll assume each appointment has { id, date, time, reason, patient, staff }.

const SchedulingContext = createContext();

// Helper function to generate dates for 6 weeks starting from current week's Monday
const generateDates = () => {
  const dates = [];

  // Get current date and log it for debugging
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to midnight

  console.log('SchedulingContext - Raw date object:', now);
  console.log('SchedulingContext - Today:', now.toISOString(), 'Day of week:', now.getDay());

  // Find the Monday of the current week
  let mondayDate = new Date(now);
  const daysSinceMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
  mondayDate.setDate(now.getDate() - daysSinceMonday);

  console.log('SchedulingContext - This week\'s Monday:', mondayDate.toISOString());

  // Generate 6 weeks of dates
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 5; day++) { // Monday to Friday
      const currentDate = new Date(mondayDate);
      currentDate.setDate(mondayDate.getDate() + (week * 7) + day);
      const dateString = currentDate.toISOString().split('T')[0];
      dates.push(dateString);
    }
  }

  // Debug info
  console.log('SchedulingContext - First 5 dates:', dates.slice(0, 5));
  console.log('SchedulingContext - Last 5 dates:', dates.slice(-5));

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
  // Create a ref to detect if this is the first render
  const isFirstRender = React.useRef(true);

  // Always generate fresh appointments on component mount
  const [appointments, setAppointments] = useState([]);

  // Initialize appointments on first render
  useEffect(() => {
    if (isFirstRender.current) {
      setAppointments(generateInitialAppointments());
      isFirstRender.current = false;
    }
  }, []);

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
    // Force regenerate new appointments with current dates
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