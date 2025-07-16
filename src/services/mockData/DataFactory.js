import { faker } from '@faker-js/faker';
import RelationshipManager from './RelationshipManager';
import TemporalDataSimulator from './TemporalDataSimulator';

class DataFactory {
  constructor() {
    this.faker = faker;
    this.relationships = new RelationshipManager();
    this.temporal = new TemporalDataSimulator();
    
    // Common pet breeds by species
    this.breeds = {
      dog: ['Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'French Bulldog', 
            'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund'],
      cat: ['Persian', 'Maine Coon', 'Siamese', 'British Shorthair', 'Ragdoll', 
            'Bengal', 'Scottish Fold', 'Abyssinian', 'Russian Blue', 'Sphynx'],
      bird: ['Parakeet', 'Cockatiel', 'African Grey', 'Canary', 'Finch', 
             'Macaw', 'Lovebird', 'Conure', 'Cockatoo', 'Amazon Parrot'],
      rabbit: ['Holland Lop', 'Netherland Dwarf', 'Lionhead', 'Rex', 'Flemish Giant',
               'Mini Lop', 'Dutch', 'Angora', 'Harlequin', 'Californian'],
      reptile: ['Bearded Dragon', 'Leopard Gecko', 'Ball Python', 'Corn Snake', 
                'Red-Eared Slider', 'Iguana', 'Chameleon', 'Tortoise', 'Monitor Lizard'],
    };

    // Common conditions by species
    this.conditions = {
      dog: ['Allergies', 'Arthritis', 'Dental Disease', 'Obesity', 'Ear Infection',
            'Skin Condition', 'Diabetes', 'Heart Disease', 'Anxiety', 'Hip Dysplasia'],
      cat: ['Dental Disease', 'Obesity', 'Kidney Disease', 'Hyperthyroidism', 'Diabetes',
            'Upper Respiratory Infection', 'Urinary Tract Disease', 'Inflammatory Bowel Disease'],
      bird: ['Feather Plucking', 'Respiratory Infection', 'Psittacosis', 'Beak Overgrowth',
             'Egg Binding', 'Vitamin A Deficiency', 'Obesity', 'Crop Stasis'],
      rabbit: ['Dental Disease', 'GI Stasis', 'Respiratory Infection', 'Ear Mites',
               'Uterine Cancer', 'Sore Hocks', 'Head Tilt', 'Obesity'],
      reptile: ['Metabolic Bone Disease', 'Respiratory Infection', 'Parasites', 'Mouth Rot',
                'Shedding Problems', 'Impaction', 'Thermal Burns', 'Vitamin Deficiency'],
    };
  }

  generateOwner(options = {}) {
    const ownerId = options.id || faker.string.uuid();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      id: ownerId,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number('###-###-####'),
      alternatePhone: Math.random() > 0.7 ? faker.phone.number('###-###-####') : null,
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
      },
      preferredContact: faker.helpers.arrayElement(['email', 'phone', 'text']),
      registrationDate: faker.date.past({ years: 5 }).toISOString(),
      lastVisit: faker.date.recent({ days: 180 }).toISOString(),
      balance: faker.number.float({ min: 0, max: 500, precision: 0.01 }),
      notes: options.notes || faker.lorem.sentence(),
      isActive: options.isActive !== undefined ? options.isActive : true,
      emergencyContact: Math.random() > 0.5 ? {
        name: faker.person.fullName(),
        phone: faker.phone.number('###-###-####'),
        relationship: faker.helpers.arrayElement(['spouse', 'parent', 'sibling', 'friend']),
      } : null,
    };
  }

  generatePatient(options = {}) {
    const patientId = options.id || faker.string.uuid();
    const species = options.species || faker.helpers.arrayElement(['dog', 'cat', 'bird', 'rabbit', 'reptile']);
    const breeds = this.breeds[species] || ['Mixed'];
    const age = options.age || faker.number.int({ min: 1, max: 15 });
    
    return {
      id: patientId,
      name: options.name || faker.person.firstName(),
      species,
      breed: options.breed || faker.helpers.arrayElement(breeds),
      age,
      ageUnit: age < 1 ? 'months' : 'years',
      sex: options.sex || faker.helpers.arrayElement(['Male', 'Female', 'Neutered Male', 'Spayed Female']),
      color: options.color || faker.color.human(),
      weight: this.generateWeight(species),
      microchipId: Math.random() > 0.3 ? faker.string.numeric(15) : null,
      dateOfBirth: faker.date.past({ years: age }).toISOString(),
      registrationDate: faker.date.past({ years: Math.min(age, 5) }).toISOString(),
      lastVisit: faker.date.recent({ days: 90 }).toISOString(),
      status: options.status || faker.helpers.arrayElement(['Active', 'Active', 'Active', 'Inactive', 'Deceased']),
      alerts: this.generateAlerts(),
      conditions: this.generateConditions(species),
      vaccinations: this.generateVaccinations(species, age),
      medications: this.generateMedications(species),
      ownerId: options.ownerId || null,
      imageUrl: options.imageUrl || faker.image.urlLoremFlickr({ category: species }),
      notes: options.notes || faker.lorem.sentence(),
    };
  }

  generateWeight(species) {
    const weights = {
      dog: { value: faker.number.float({ min: 10, max: 100, precision: 0.1 }), unit: 'lbs' },
      cat: { value: faker.number.float({ min: 8, max: 20, precision: 0.1 }), unit: 'lbs' },
      bird: { value: faker.number.float({ min: 0.1, max: 2, precision: 0.01 }), unit: 'lbs' },
      rabbit: { value: faker.number.float({ min: 2, max: 15, precision: 0.1 }), unit: 'lbs' },
      reptile: { value: faker.number.float({ min: 0.5, max: 10, precision: 0.1 }), unit: 'lbs' },
    };
    
    return weights[species] || { value: faker.number.float({ min: 1, max: 20 }), unit: 'lbs' };
  }

  generateAlerts() {
    const alerts = [];
    
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'aggressive',
        description: 'May be aggressive, use caution',
        severity: 'high',
      });
    }
    
    if (Math.random() > 0.8) {
      alerts.push({
        type: 'allergy',
        description: faker.helpers.arrayElement(['Allergic to penicillin', 'Allergic to certain anesthetics']),
        severity: 'medium',
      });
    }
    
    if (Math.random() > 0.9) {
      alerts.push({
        type: 'medical',
        description: faker.helpers.arrayElement(['Diabetic', 'Heart condition', 'Seizure disorder']),
        severity: 'high',
      });
    }
    
    return alerts;
  }

  generateConditions(species) {
    const speciesConditions = this.conditions[species] || this.conditions.dog;
    const numConditions = faker.number.int({ min: 0, max: 3 });
    const conditions = [];
    
    for (let i = 0; i < numConditions; i++) {
      conditions.push({
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement(speciesConditions),
        diagnosedDate: faker.date.past({ years: 2 }).toISOString(),
        status: faker.helpers.arrayElement(['Active', 'Managed', 'Resolved']),
        notes: faker.lorem.sentence(),
      });
    }
    
    return conditions;
  }

  generateVaccinations(species, age) {
    const vaccinations = [];
    const coreVaccines = {
      dog: ['Rabies', 'DHPP', 'Bordetella'],
      cat: ['Rabies', 'FVRCP', 'FeLV'],
      bird: ['Polyomavirus', 'Pacheco\'s Disease'],
      rabbit: ['RHDV', 'Myxomatosis'],
      reptile: [],
    };
    
    const vaccines = coreVaccines[species] || [];
    
    vaccines.forEach(vaccine => {
      if (Math.random() > 0.2) {
        const lastDate = faker.date.past({ years: 1 });
        vaccinations.push({
          id: faker.string.uuid(),
          name: vaccine,
          lastAdministered: lastDate.toISOString(),
          nextDue: faker.date.future({ years: 1, refDate: lastDate }).toISOString(),
          status: faker.helpers.arrayElement(['Current', 'Due Soon', 'Overdue']),
        });
      }
    });
    
    return vaccinations;
  }

  generateMedications(species) {
    const medications = [];
    const numMedications = faker.number.int({ min: 0, max: 2 });
    
    const commonMedications = [
      'Apoquel', 'Rimadyl', 'Gabapentin', 'Prednisone', 'Amoxicillin',
      'Metronidazole', 'Tramadol', 'Carprofen', 'Doxycycline', 'Clavamox',
    ];
    
    for (let i = 0; i < numMedications; i++) {
      medications.push({
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement(commonMedications),
        dosage: `${faker.number.int({ min: 5, max: 50 })}mg`,
        frequency: faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Every 12 hours', 'As needed']),
        startDate: faker.date.recent({ days: 30 }).toISOString(),
        endDate: faker.date.future({ years: 0.25 }).toISOString(),
        prescribedBy: faker.person.fullName(),
        notes: faker.lorem.sentence(),
      });
    }
    
    return medications;
  }

  generateAppointment(options = {}) {
    const appointmentTypes = [
      'Wellness Exam', 'Vaccination', 'Dental Cleaning', 'Surgery Consultation',
      'Follow-up', 'Emergency', 'Grooming', 'Behavioral Consultation',
    ];
    
    const startTime = options.startTime || faker.date.future({ years: 0.1 });
    const duration = options.duration || faker.helpers.arrayElement([15, 30, 45, 60]);
    
    return {
      id: options.id || faker.string.uuid(),
      patientId: options.patientId || faker.string.uuid(),
      ownerId: options.ownerId || faker.string.uuid(),
      type: options.type || faker.helpers.arrayElement(appointmentTypes),
      startTime: startTime.toISOString(),
      endTime: new Date(startTime.getTime() + duration * 60000).toISOString(),
      duration,
      veterinarianId: options.veterinarianId || faker.string.uuid(),
      veterinarianName: options.veterinarianName || faker.person.fullName(),
      status: options.status || faker.helpers.arrayElement(['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show']),
      roomNumber: options.roomNumber || faker.helpers.arrayElement(['1', '2', '3', '4', 'Surgery 1', 'Surgery 2']),
      reason: options.reason || faker.lorem.sentence(),
      notes: options.notes || faker.lorem.sentence(),
      createdAt: faker.date.past({ years: 0.1 }).toISOString(),
      reminders: {
        email: Math.random() > 0.3,
        sms: Math.random() > 0.5,
        call: Math.random() > 0.7,
      },
    };
  }

  generateStaff(options = {}) {
    const roles = ['Veterinarian', 'Veterinary Technician', 'Receptionist', 'Practice Manager', 'Groomer'];
    const specialties = ['General Practice', 'Surgery', 'Dentistry', 'Emergency Care', 'Exotic Animals'];
    
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const role = options.role || faker.helpers.arrayElement(roles);
    
    return {
      id: options.id || faker.string.uuid(),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      title: role === 'Veterinarian' ? 'DVM' : null,
      role,
      specialty: role === 'Veterinarian' ? faker.helpers.arrayElement(specialties) : null,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number('###-###-####'),
      licenseNumber: role === 'Veterinarian' ? faker.string.alphanumeric(10).toUpperCase() : null,
      hireDate: faker.date.past({ years: 10 }).toISOString(),
      status: options.status || 'Active',
      availability: this.generateAvailability(),
      skills: this.generateSkills(role),
      imageUrl: faker.image.avatar(),
    };
  }

  generateAvailability() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availability = {};
    
    days.forEach(day => {
      if (Math.random() > 0.2) {
        availability[day] = {
          start: faker.helpers.arrayElement(['8:00 AM', '9:00 AM', '10:00 AM']),
          end: faker.helpers.arrayElement(['5:00 PM', '6:00 PM', '7:00 PM']),
        };
      }
    });
    
    return availability;
  }

  generateSkills(role) {
    const skillsByRole = {
      'Veterinarian': ['Surgery', 'Diagnostics', 'Emergency Care', 'Preventive Care'],
      'Veterinary Technician': ['Lab Work', 'Anesthesia', 'Radiology', 'Patient Care'],
      'Receptionist': ['Customer Service', 'Scheduling', 'Medical Records', 'Billing'],
      'Practice Manager': ['Staff Management', 'Financial Management', 'Operations', 'Compliance'],
      'Groomer': ['Bathing', 'Hair Cutting', 'Nail Trimming', 'Ear Cleaning'],
    };
    
    return faker.helpers.arrayElements(skillsByRole[role] || [], { min: 2, max: 4 });
  }

  generateTimeSeries(entity, dataType, options = {}) {
    const config = {
      startDate: options.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: options.endDate || new Date(),
      interval: options.interval || 'day',
      ...options,
    };

    switch (dataType) {
      case 'weight':
        return this.temporal.generateTimeSeries({
          ...config,
          pattern: this.temporal.patterns.RANDOM_WALK,
          baseValue: entity.weight?.value || 10,
          variance: 0.02,
          trend: entity.age < 2 ? 0.5 : -0.1,
        });

      case 'temperature':
        return this.temporal.generateTimeSeries({
          ...config,
          pattern: this.temporal.patterns.SINUSOIDAL,
          baseValue: 101.5,
          variance: 0.01,
          seasonality: { type: 'daily', amplitude: 0.5 },
        });

      case 'heartRate':
        return this.temporal.generateTimeSeries({
          ...config,
          pattern: this.temporal.patterns.RANDOM_WALK,
          baseValue: this.getBaseHeartRate(entity.species),
          variance: 0.1,
        });

      case 'appointments':
        return this.temporal.generateTimeSeries({
          ...config,
          pattern: this.temporal.patterns.STEP,
          baseValue: 1,
          variance: 0.5,
        });

      default:
        return this.temporal.generateTimeSeries(config);
    }
  }

  getBaseHeartRate(species) {
    const heartRates = {
      dog: 100,
      cat: 140,
      bird: 300,
      rabbit: 180,
      reptile: 60,
    };
    return heartRates[species] || 100;
  }

  createRelationship(entity1Id, entity2Id, type, metadata = {}) {
    return this.relationships.addRelationship(entity1Id, entity2Id, type, metadata);
  }

  generateCompleteClinicData(options = {}) {
    const numOwners = options.numOwners || 100;
    const numStaff = options.numStaff || 10;
    const avgPetsPerOwner = options.avgPetsPerOwner || 1.5;
    
    const data = {
      owners: [],
      patients: [],
      staff: [],
      appointments: [],
    };

    // Generate staff
    for (let i = 0; i < numStaff; i++) {
      data.staff.push(this.generateStaff());
    }

    // Generate owners and their pets
    for (let i = 0; i < numOwners; i++) {
      const owner = this.generateOwner();
      data.owners.push(owner);

      const numPets = faker.number.int({ min: 1, max: Math.ceil(avgPetsPerOwner * 2) });
      for (let j = 0; j < numPets; j++) {
        const patient = this.generatePatient({ ownerId: owner.id });
        data.patients.push(patient);

        // Create pet-owner relationship
        this.createRelationship(
          patient.id,
          owner.id,
          this.relationships.relationshipTypes.PET_OWNER
        );

        // Generate appointments for each pet
        const numAppointments = faker.number.int({ min: 0, max: 5 });
        for (let k = 0; k < numAppointments; k++) {
          const vet = faker.helpers.arrayElement(data.staff.filter(s => s.role === 'Veterinarian'));
          data.appointments.push(
            this.generateAppointment({
              patientId: patient.id,
              ownerId: owner.id,
              veterinarianId: vet.id,
              veterinarianName: vet.fullName,
            })
          );
        }
      }
    }

    return data;
  }
}

export default DataFactory;