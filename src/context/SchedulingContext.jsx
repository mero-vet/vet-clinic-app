import React, { createContext, useContext, useState } from 'react';

// A simple context for scheduling appointments.
// We'll assume each appointment has { id, date, time, reason, patient, staff }.

const SchedulingContext = createContext();

export const SchedulingProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([
    // Pre-loaded appointments (80% filled for demonstration).
    { id: 1, date: '2025-01-27', time: '09:00', reason: 'Wellness Check', patient: 'Bella (Canine)', staff: 'Dr. Smith' },
    { id: 2, date: '2025-01-27', time: '10:00', reason: 'Vaccine Booster', patient: 'Max (Feline)', staff: 'Dr. Adams' },
    { id: 3, date: '2025-01-28', time: '08:00', reason: 'Dental Cleaning', patient: 'Rocky (Canine)', staff: 'Dr. Smith' },
    { id: 4, date: '2025-01-28', time: '11:00', reason: 'Ear Infection Follow-up', patient: 'Luna (Feline)', staff: 'Dr. Davis' },
    // ... add more so it's mostly filled
    { id: 5, date: '2025-01-29', time: '09:00', reason: 'Bloodwork', patient: 'Charlie (Canine)', staff: 'Dr. Adams' },
    { id: 6, date: '2025-01-29', time: '10:00', reason: 'Surgery Consult', patient: 'Coco (Feline)', staff: 'Dr. Smith' },
    { id: 7, date: '2025-01-30', time: '15:00', reason: 'Heartworm Check', patient: 'Buddy (Canine)', staff: 'Dr. Davis' },
    { id: 8, date: '2025-01-31', time: '14:00', reason: 'Check-up', patient: 'Lucy (Feline)', staff: 'Dr. Adams' },
  ]);

  const addAppointment = (newAppt) => {
    setAppointments((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newAppt,
      },
    ]);
  };

  return (
    <SchedulingContext.Provider value={{ appointments, addAppointment }}>
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = () => {
  return useContext(SchedulingContext);
};