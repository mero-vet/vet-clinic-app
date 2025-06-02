import React, { createContext, useContext, useState } from 'react';

// A simple context for scheduling appointments.
// We'll assume each appointment has { id, date, time, reason, patient, staff }.
// 
// IMPORTANT: Schedule is randomized on every page refresh!
// - 80% of weekday slots are filled with random appointments
// - Pet names, species, and procedures are randomly selected
// - Mix of dogs (60%), cats (35%), and other animals (5%)
// - This creates a realistic-looking schedule for testing AI agents

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
    // Generate fresh random appointments
    setAppointments(generateRandomAppointments());
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