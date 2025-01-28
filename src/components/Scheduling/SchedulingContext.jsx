import React, { createContext, useState, useContext } from 'react';

// SchedulingContext to manage appointment data globally
const SchedulingContext = createContext();

export function SchedulingProvider({ children }) {
  const [appointments, setAppointments] = useState([]);

  // Example of adding a new appointment
  const addAppointment = (newAppt) => {
    setAppointments((prev) => [...prev, newAppt]);
  };

  // Example of removing an existing appointment
  const removeAppointment = (id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  const value = {
    appointments,
    addAppointment,
    removeAppointment,
  };

  return (
    <SchedulingContext.Provider value={value}>
      {children}
    </SchedulingContext.Provider>
  );
}

export function useScheduling() {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
}