// Mock patient data storage
let patients = [];

// Breed data by species
const BREED_DATA = {
  dog: [
    'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'French Bulldog', 
    'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'German Shorthaired Pointer',
    'Yorkshire Terrier', 'Dachshund', 'Siberian Husky', 'Boxer', 'Cavalier King Charles Spaniel',
    'Shih Tzu', 'Boston Terrier', 'Pomeranian', 'Havanese', 'Shetland Sheepdog',
    'Brittany', 'Cocker Spaniel', 'Maltese', 'Pug', 'Chihuahua', 'Mixed Breed', 'Other'
  ],
  cat: [
    'Domestic Shorthair', 'Domestic Longhair', 'Maine Coon', 'Ragdoll', 'British Shorthair',
    'American Shorthair', 'Scottish Fold', 'Sphynx', 'Abyssinian', 'Bengal',
    'Persian', 'Russian Blue', 'Siamese', 'Norwegian Forest Cat', 'Oriental Shorthair',
    'Devon Rex', 'Burmese', 'Birman', 'Exotic Shorthair', 'Himalayan', 'Mixed Breed', 'Other'
  ],
  exotic: [
    'Rabbit', 'Guinea Pig', 'Hamster', 'Ferret', 'Chinchilla', 'Hedgehog',
    'Bearded Dragon', 'Ball Python', 'Corn Snake', 'Gecko', 'Iguana',
    'Parrot', 'Cockatiel', 'Parakeet', 'Finch', 'Canary', 'Other Bird',
    'Turtle', 'Tortoise', 'Other Reptile', 'Other Small Mammal', 'Other'
  ]
};

// Vaccination schedules by species
const VACCINATION_SCHEDULES = {
  dog: {
    puppy: [
      { name: 'DHPP', ages: ['6-8 weeks', '10-12 weeks', '14-16 weeks', '12-16 months'], frequency: 'Annual' },
      { name: 'Rabies', ages: ['12-16 weeks', '12-16 months'], frequency: 'Every 1-3 years' },
      { name: 'Bordetella', ages: ['10-12 weeks'], frequency: 'Annual or semi-annual' },
      { name: 'Lyme', ages: ['10-12 weeks', '14-16 weeks'], frequency: 'Annual' },
      { name: 'Canine Influenza', ages: ['10-12 weeks', '14-16 weeks'], frequency: 'Annual' }
    ],
    adult: [
      { name: 'DHPP', frequency: 'Annual or every 3 years' },
      { name: 'Rabies', frequency: 'Every 1-3 years' },
      { name: 'Bordetella', frequency: 'Annual or semi-annual' },
      { name: 'Lyme', frequency: 'Annual' },
      { name: 'Canine Influenza', frequency: 'Annual' }
    ]
  },
  cat: {
    kitten: [
      { name: 'FVRCP', ages: ['6-8 weeks', '10-12 weeks', '14-16 weeks', '12-16 months'], frequency: 'Every 1-3 years' },
      { name: 'Rabies', ages: ['12-16 weeks', '12-16 months'], frequency: 'Every 1-3 years' },
      { name: 'FeLV', ages: ['8-10 weeks', '12-14 weeks'], frequency: 'Annual' }
    ],
    adult: [
      { name: 'FVRCP', frequency: 'Every 1-3 years' },
      { name: 'Rabies', frequency: 'Every 1-3 years' },
      { name: 'FeLV', frequency: 'Annual (if at risk)' }
    ]
  },
  exotic: {
    all: [
      { name: 'Species-specific vaccines', frequency: 'Consult veterinarian' }
    ]
  }
};

// Initialize patients from localStorage or mock data
const initializePatients = () => {
  const stored = localStorage.getItem('vetClinicPatients');
  if (stored) {
    patients = JSON.parse(stored);
  } else {
    // Initialize with existing mock patients from PatientContext
    patients = [];
    localStorage.setItem('vetClinicPatients', JSON.stringify(patients));
  }
};

// Initialize on load
initializePatients();

/**
 * Generate a unique patient ID
 */
const generatePatientId = () => {
  const year = new Date().getFullYear();
  const existingIds = patients.filter(p => p.patientId && p.patientId.startsWith(`P-${year}-`));
  const nextNumber = existingIds.length + 1;
  return `P-${year}-${String(nextNumber).padStart(4, '0')}`;
};

/**
 * Calculate age from date of birth
 */
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Return age in years and months for young animals
  if (age < 2) {
    const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
    return { years: age, months, display: age === 0 ? `${months} months` : `${age} year${age > 1 ? 's' : ''} ${months} months` };
  }
  
  return { years: age, months: 0, display: `${age} years` };
};

/**
 * Get breeds by species
 */
export function getBreedsBySpecies(species) {
  return BREED_DATA[species] || [];
}

/**
 * Create a new patient
 */
export function createPatient(patientData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newPatient = {
          ...patientData,
          patientId: generatePatientId(),
          createdDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          // Initialize medical record fields
          medicalHistory: [],
          vaccinations: [],
          medications: [],
          allergies: patientData.allergies || [],
          conditions: [],
          lastVisit: null,
          nextAppointment: null
        };
        
        // Add to storage
        patients.push(newPatient);
        localStorage.setItem('vetClinicPatients', JSON.stringify(patients));
        
        resolve({
          success: true,
          data: newPatient
        });
      } catch (error) {
        reject({
          success: false,
          error: 'Failed to create patient'
        });
      }
    }, 300);
  });
}

/**
 * Get patient by ID
 */
export function getPatientById(patientId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patient = patients.find(p => p.patientId === patientId);
      if (patient) {
        resolve({
          success: true,
          data: patient
        });
      } else {
        reject({
          success: false,
          error: 'Patient not found'
        });
      }
    }, 100);
  });
}

/**
 * Get patients by client ID
 */
export function getPatientsByClientId(clientId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clientPatients = patients.filter(p => p.clientId === clientId);
      resolve({
        success: true,
        data: clientPatients
      });
    }, 200);
  });
}

/**
 * Update patient
 */
export function updatePatient(patientId, updates) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = patients.findIndex(p => p.patientId === patientId);
      if (index !== -1) {
        patients[index] = {
          ...patients[index],
          ...updates,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem('vetClinicPatients', JSON.stringify(patients));
        
        resolve({
          success: true,
          data: patients[index]
        });
      } else {
        reject({
          success: false,
          error: 'Patient not found'
        });
      }
    }, 300);
  });
}

/**
 * Generate vaccination schedule based on species and age
 */
export function generateVaccinationSchedule(species, dateOfBirth) {
  const age = calculateAge(dateOfBirth);
  const isYoung = (species === 'dog' && age.years < 1) || (species === 'cat' && age.years < 1);
  
  const schedules = VACCINATION_SCHEDULES[species];
  if (!schedules) return [];
  
  const schedule = isYoung ? schedules.puppy || schedules.kitten : schedules.adult;
  
  return schedule || schedules.all || [];
}

/**
 * Generate reminders for a patient
 */
export function generateReminders(patientData) {
  const reminders = [];
  const today = new Date();
  
  // Vaccination reminders
  const vaccineSchedule = generateVaccinationSchedule(patientData.species, patientData.dateOfBirth);
  vaccineSchedule.forEach(vaccine => {
    reminders.push({
      type: 'vaccination',
      name: vaccine.name,
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      description: `${vaccine.name} vaccination due`,
      priority: 'high'
    });
  });
  
  // Annual wellness exam
  reminders.push({
    type: 'wellness',
    name: 'Annual Wellness Exam',
    dueDate: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    description: 'Annual wellness examination and health check',
    priority: 'medium'
  });
  
  // Dental cleaning (for dogs and cats over 1 year)
  const age = calculateAge(patientData.dateOfBirth);
  if ((patientData.species === 'dog' || patientData.species === 'cat') && age.years >= 1) {
    reminders.push({
      type: 'dental',
      name: 'Dental Cleaning',
      dueDate: new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
      description: 'Professional dental cleaning recommended',
      priority: 'low'
    });
  }
  
  // Parasite prevention
  if (patientData.species === 'dog' || patientData.species === 'cat') {
    reminders.push({
      type: 'prevention',
      name: 'Parasite Prevention',
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Monthly
      description: 'Monthly flea, tick, and heartworm prevention due',
      priority: 'high',
      recurring: 'monthly'
    });
  }
  
  return reminders;
}

/**
 * Search patients
 */
export function searchPatients(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query || query.trim() === '') {
        resolve([]);
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      const results = patients.filter(patient => {
        return (
          patient.name.toLowerCase().includes(lowerQuery) ||
          patient.patientId.toLowerCase().includes(lowerQuery) ||
          patient.species.toLowerCase().includes(lowerQuery) ||
          (patient.breed && patient.breed.toLowerCase().includes(lowerQuery))
        );
      });
      
      resolve(results);
    }, 200);
  });
}