import React, { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react';

const PatientContext = createContext();

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

// Mock patients data
const mockPatients = [
  {
    clientId: 'C1001',
    clientFirstName: 'Remy',
    clientLastName: 'Olson',
    clientEmail: 'remy@joinmero.com',
    emailDeclined: false,
    phoneHome: '(503) 555-0123',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '250.00',
    address: '1234 Fake Street',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97206',

    patientId: 'P2001',
    patientName: 'Wilson',
    species: 'Canine',
    sex: 'Male',
    breed: 'German Shepherd mix',
    birthDate: '2021-02-12',
    ageYears: '3',
    ageMonths: '11',
    ageDays: '20',
    weightDate: '2024-12-15',
    weight: '69.5',
    additionalNotes: 'Friendly, good with other dogs',
    alertNotes: 'Bad response to rimadyl',

    primaryReason: 'Annual Checkup',
    secondaryReason: 'Vaccine Update',
    room: 'Exam 3',
    visitType: 'Outpatient',
    status: 'Checked In',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Williams',
    referralRecheck: false,

    staffId: 'S101',
    checkedInBy: 'Jessica Smith',
    checkInDate: '2024-03-18T09:00',
    checkOutDate: '',
  },
  {
    clientId: 'C1002',
    clientFirstName: 'Alex',
    clientLastName: 'Morgan',
    clientEmail: 'alex.morgan@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-1234',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '0.00',
    address: '789 Oak Street',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97201',

    patientId: 'P2002',
    patientName: 'Sammy',
    species: 'Feline',
    sex: 'Neutered Male',
    breed: 'Domestic Short Hair (Tabby)',
    birthDate: '2017-06-01',
    ageYears: '8',
    ageMonths: '0',
    ageDays: '17',
    weightDate: '2025-06-12',
    weight: '12.3',
    additionalNotes: 'Indoor only, good with grooming',
    alertNotes: 'Chronic allergies - on Atopica',

    primaryReason: 'Regular checkup',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Johnson',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    // Medical history for Sammy
    medicalHistory: [
      { date: '2020-05-03', reason: 'Itching and licking paws', diagnosis: 'Suspected seasonal atopic dermatitis', treatment: 'Started Zyrtec' },
      { date: '2020-07-12', reason: 'Still scratching ears', treatment: 'Added topical hydrocortisone spray' },
      { date: '2020-11-08', reason: 'Licking belly, hair loss', treatment: 'Started Apoquel trial' },
      { date: '2021-03-14', reason: 'Doing well on Apoquel', treatment: 'Continue medication' },
      { date: '2021-10-06', reason: 'Sneezing and watery eyes', diagnosis: 'Allergic rhinitis flare-up' },
      { date: '2022-04-18', reason: 'Appetite down, sleeping more', diagnosis: 'Bloodwork normal' },
      { date: '2023-01-10', reason: 'Itchy skin despite Apoquel', treatment: 'Started Atopica' },
      { date: '2023-05-15', reason: 'Stable on Atopica', treatment: 'Continue maintenance dose' },
      { date: '2024-10-27', reason: 'Fall itching returned', diagnosis: 'Dust mite allergy suspected' },
      { date: '2025-06-12', reason: 'Regular checkup', diagnosis: 'Well-managed chronic allergies' }
    ]
  },
  {
    clientId: 'C1003',
    clientFirstName: 'Sarah',
    clientLastName: 'Johnson',
    clientEmail: 'sarah.johnson@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-2345',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '125.00',
    address: '123 Maple Avenue',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97203',

    patientId: 'P2003',
    patientName: 'Bella',
    species: 'Canine',
    sex: 'Spayed Female',
    breed: 'Golden Retriever',
    birthDate: '2019-03-15',
    ageYears: '6',
    ageMonths: '3',
    ageDays: '4',
    weightDate: '2025-05-20',
    weight: '65.2',
    additionalNotes: 'Very friendly, loves treats',
    alertNotes: 'Hip dysplasia - handle gently',

    primaryReason: 'Limping on right hind leg',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Smith',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2021-08-10', reason: 'Limping after playing fetch', diagnosis: 'Early hip dysplasia suspected', treatment: 'Radiographs confirmed mild hip dysplasia, started on Cosequin' },
      { date: '2022-02-15', reason: 'Routine check, hip evaluation', diagnosis: 'Hip dysplasia stable', treatment: 'Continue joint supplements, add fish oil' },
      { date: '2022-09-22', reason: 'Increased stiffness in mornings', diagnosis: 'Moderate hip dysplasia progression', treatment: 'Added Adequan injections monthly, start physical therapy' },
      { date: '2023-03-30', reason: 'Follow-up hip evaluation', diagnosis: 'Good response to treatment', treatment: 'Continue Adequan, PT exercises at home' },
      { date: '2023-11-14', reason: 'Limping after long walk', diagnosis: 'Muscle strain, hip dysplasia flare', treatment: 'Gabapentin for pain, restrict activity 2 weeks' },
      { date: '2024-06-08', reason: 'Annual exam, hip check', diagnosis: 'Stable hip dysplasia', treatment: 'Continue current management plan' },
      { date: '2025-01-20', reason: 'Difficulty rising from lying position', diagnosis: 'Arthritis secondary to hip dysplasia', treatment: 'Started Librela injections, continue supplements' },
      { date: '2025-05-20', reason: 'Limping on right hind leg', diagnosis: 'Hip dysplasia flare-up', treatment: 'Pain management adjustment, consider surgery consult' }
    ]
  },
  {
    clientId: 'C1004',
    clientFirstName: 'Michael',
    clientLastName: 'Chen',
    clientEmail: 'mchen@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-3456',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '0.00',
    address: '456 Pine Street',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97204',

    patientId: 'P2004',
    patientName: 'Max',
    species: 'Canine',
    sex: 'Neutered Male',
    breed: 'German Shepherd',
    birthDate: '2018-08-22',
    ageYears: '6',
    ageMonths: '10',
    ageDays: '28',
    weightDate: '2025-06-15',
    weight: '78.4',
    additionalNotes: 'Protective of owner, muzzle for exams',
    alertNotes: 'Food allergies - chicken, beef. IBD patient',

    primaryReason: 'Chronic diarrhea follow-up',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Williams',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2020-11-05', reason: 'Chronic diarrhea x 2 weeks', diagnosis: 'Suspected food allergy vs IBD', treatment: 'Started hydrolyzed protein diet trial' },
      { date: '2021-01-15', reason: 'Diarrhea improved but not resolved', diagnosis: 'Food allergy suspected', treatment: 'Elimination diet - novel protein (duck)' },
      { date: '2021-04-20', reason: 'Diarrhea returned, weight loss', diagnosis: 'IBD confirmed via endoscopy', treatment: 'Started prednisone, continue limited ingredient diet' },
      { date: '2021-10-12', reason: 'Good response to treatment', diagnosis: 'IBD in remission', treatment: 'Taper prednisone, maintain diet' },
      { date: '2022-05-08', reason: 'Flare-up after dietary indiscretion', diagnosis: 'IBD flare', treatment: 'Metronidazole, increase prednisone temporarily' },
      { date: '2023-02-14', reason: 'Stable, routine check', diagnosis: 'IBD well-controlled', treatment: 'Continue maintenance prednisone, strict diet' },
      { date: '2024-08-30', reason: 'Vomiting and diarrhea', diagnosis: 'IBD flare, pancreatitis', treatment: 'Hospitalization, IV fluids, anti-nausea meds' },
      { date: '2025-06-15', reason: 'Chronic diarrhea follow-up', diagnosis: 'IBD stable on current regimen', treatment: 'Continue current medications and diet' }
    ]
  },
  {
    clientId: 'C1005',
    clientFirstName: 'Emily',
    clientLastName: 'Rodriguez',
    clientEmail: 'emily.rodriguez@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-4567',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '450.00',
    address: '789 Elm Court',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97205',

    patientId: 'P2005',
    patientName: 'Luna',
    species: 'Feline',
    sex: 'Spayed Female',
    breed: 'Persian',
    birthDate: '2020-12-10',
    ageYears: '4',
    ageMonths: '6',
    ageDays: '9',
    weightDate: '2025-04-10',
    weight: '9.8',
    additionalNotes: 'Brachycephalic, stress easily',
    alertNotes: 'Chronic upper respiratory issues',

    primaryReason: 'Eye discharge, sneezing',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Johnson',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2021-06-15', reason: 'Sneezing, nasal discharge', diagnosis: 'Upper respiratory infection', treatment: 'Doxycycline, L-lysine supplement' },
      { date: '2021-11-20', reason: 'Chronic eye tearing', diagnosis: 'Brachycephalic ocular syndrome', treatment: 'Daily eye cleaning, artificial tears' },
      { date: '2022-03-08', reason: 'Difficulty breathing, open mouth', diagnosis: 'Severe URI, brachycephalic airway', treatment: 'Nebulization, antibiotics, discussed surgery' },
      { date: '2022-09-14', reason: 'Chronic snoring, sneezing', diagnosis: 'Stenotic nares', treatment: 'Nares widening surgery performed' },
      { date: '2023-04-25', reason: 'Post-surgery check', diagnosis: 'Improved airway, mild URI', treatment: 'Continue L-lysine, monitor' },
      { date: '2024-01-10', reason: 'Eye ulcer left eye', diagnosis: 'Corneal ulcer', treatment: 'Antibiotic eye drops, e-collar' },
      { date: '2024-11-05', reason: 'Chronic sneezing returned', diagnosis: 'Chronic rhinitis', treatment: 'Long-term azithromycin therapy' },
      { date: '2025-04-10', reason: 'Eye discharge, sneezing', diagnosis: 'URI flare-up', treatment: 'Increase azithromycin frequency, eye ointment' }
    ]
  },
  {
    clientId: 'C1006',
    clientFirstName: 'James',
    clientLastName: 'Wilson',
    clientEmail: 'jwilson@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-5678',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '75.00',
    address: '321 Oak Lane',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97206',

    patientId: 'P2006',
    patientName: 'Rocky',
    species: 'Canine',
    sex: 'Neutered Male',
    breed: 'English Bulldog',
    birthDate: '2017-09-05',
    ageYears: '7',
    ageMonths: '9',
    ageDays: '14',
    weightDate: '2025-05-01',
    weight: '52.3',
    additionalNotes: 'Needs sedation for nail trims',
    alertNotes: 'Brachycephalic - monitor breathing. Skin fold dermatitis',

    primaryReason: 'Skin fold infection',
    secondaryReason: 'Difficulty breathing',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Smith',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2019-05-20', reason: 'Red, smelly skin folds', diagnosis: 'Skin fold dermatitis', treatment: 'Chlorhexidine wipes, keep folds dry' },
      { date: '2020-07-15', reason: 'Labored breathing in heat', diagnosis: 'Brachycephalic airway syndrome', treatment: 'Avoid heat, weight management' },
      { date: '2021-03-10', reason: 'Chronic ear infections', diagnosis: 'Otitis externa', treatment: 'Ear cleaning protocol, Otomax' },
      { date: '2021-11-28', reason: 'Overweight, breathing issues', diagnosis: 'Obesity exacerbating BOAS', treatment: 'Prescription diet, exercise plan' },
      { date: '2022-06-14', reason: 'Itchy, red skin', diagnosis: 'Atopic dermatitis', treatment: 'Apoquel, medicated shampoo' },
      { date: '2023-04-02', reason: 'Facial fold infection', diagnosis: 'Deep pyoderma', treatment: 'Cephalexin, daily cleaning routine' },
      { date: '2024-09-18', reason: 'Weight recheck, skin check', diagnosis: 'Improved weight, mild dermatitis', treatment: 'Continue Apoquel, maintain weight' },
      { date: '2025-05-01', reason: 'Skin fold infection, breathing difficulty', diagnosis: 'Recurrent fold pyoderma, BOAS', treatment: 'Antibiotics, discuss fold removal surgery' }
    ]
  },
  {
    clientId: 'C1007',
    clientFirstName: 'Lisa',
    clientLastName: 'Thompson',
    clientEmail: 'lisa.thompson@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-6789',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '320.00',
    address: '567 Cedar Boulevard',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97207',

    patientId: 'P2007',
    patientName: 'Mittens',
    species: 'Feline',
    sex: 'Neutered Male',
    breed: 'Maine Coon',
    birthDate: '2016-01-20',
    ageYears: '9',
    ageMonths: '5',
    ageDays: '0',
    weightDate: '2025-06-01',
    weight: '18.5',
    additionalNotes: 'Gentle giant, tolerates procedures well',
    alertNotes: 'HCM (hypertrophic cardiomyopathy), CKD stage 2',

    primaryReason: 'Senior wellness exam',
    secondaryReason: 'Cardiac recheck',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Williams',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2019-08-12', reason: 'Heart murmur detected', diagnosis: 'Grade II/VI murmur', treatment: 'Echocardiogram recommended' },
      { date: '2019-09-05', reason: 'Cardiac workup', diagnosis: 'HCM confirmed', treatment: 'Started atenolol, monitor' },
      { date: '2020-03-15', reason: 'Cardiac recheck', diagnosis: 'Stable HCM', treatment: 'Continue atenolol' },
      { date: '2021-04-20', reason: 'Increased thirst/urination', diagnosis: 'Early kidney disease', treatment: 'Renal diet, monitor values' },
      { date: '2022-01-10', reason: 'Weight loss, poor appetite', diagnosis: 'CKD progression', treatment: 'SubQ fluids training, appetite stimulant' },
      { date: '2023-06-25', reason: 'Cardiac and renal recheck', diagnosis: 'Stable HCM, CKD stage 2', treatment: 'Continue all medications' },
      { date: '2024-12-15', reason: 'Lethargy, not eating', diagnosis: 'Uremic crisis', treatment: 'IV fluids hospitalization, adjusted meds' },
      { date: '2025-06-01', reason: 'Senior wellness, cardiac recheck', diagnosis: 'Stable chronic conditions', treatment: 'Continue management, increase SubQ fluids' }
    ]
  },
  {
    clientId: 'C1008',
    clientFirstName: 'David',
    clientLastName: 'Park',
    clientEmail: 'dpark@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-7890',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '0.00',
    address: '890 Birch Drive',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97208',

    patientId: 'P2008',
    patientName: 'Buddy',
    species: 'Canine',
    sex: 'Neutered Male',
    breed: 'Labrador Mix',
    birthDate: '2021-05-10',
    ageYears: '4',
    ageMonths: '1',
    ageDays: '9',
    weightDate: '2025-06-10',
    weight: '72.1',
    additionalNotes: 'High energy, pulls on leash',
    alertNotes: 'History of eating foreign objects',

    primaryReason: 'Annual wellness exam',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Johnson',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2021-07-15', reason: 'First puppy visit', diagnosis: 'Healthy puppy', treatment: 'DHPP vaccine, deworming' },
      { date: '2021-08-12', reason: 'Puppy vaccines', diagnosis: 'Normal exam', treatment: 'DHPP booster, started heartworm prevention' },
      { date: '2021-11-20', reason: 'Vomiting, not eating', diagnosis: 'Dietary indiscretion', treatment: 'Supportive care, bland diet' },
      { date: '2022-03-05', reason: 'Ate sock', diagnosis: 'Foreign body ingestion', treatment: 'Induced vomiting, sock retrieved' },
      { date: '2022-10-14', reason: 'Limping after park', diagnosis: 'Soft tissue injury', treatment: 'Rest, NSAIDs for 5 days' },
      { date: '2023-06-22', reason: 'Annual exam', diagnosis: 'Healthy adult', treatment: 'Vaccines updated, continue preventatives' },
      { date: '2024-04-18', reason: 'Possible foreign body', diagnosis: 'Ate toy pieces', treatment: 'Radiographs clear, monitor' },
      { date: '2025-06-10', reason: 'Annual wellness exam', diagnosis: 'Healthy, active dog', treatment: 'Vaccines due, discuss training for impulse control' }
    ]
  },
  {
    clientId: 'C1009',
    clientFirstName: 'Amanda',
    clientLastName: 'Foster',
    clientEmail: 'afoster@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-8901',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '850.00',
    address: '234 Willow Way',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97209',

    patientId: 'P2009',
    patientName: 'Whiskers',
    species: 'Feline',
    sex: 'Spayed Female',
    breed: 'Siamese',
    birthDate: '2019-07-08',
    ageYears: '5',
    ageMonths: '11',
    ageDays: '11',
    weightDate: '2025-05-15',
    weight: '8.2',
    additionalNotes: 'Very vocal, stress in carrier',
    alertNotes: 'Severe dental disease, behavioral issues',

    primaryReason: 'Dental cleaning follow-up',
    secondaryReason: 'Inappropriate urination',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Smith',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2021-09-10', reason: 'Bad breath, not eating dry food', diagnosis: 'Moderate dental disease', treatment: 'Dental cleaning scheduled' },
      { date: '2021-10-05', reason: 'Dental procedure', diagnosis: 'Severe gingivitis, 3 extractions', treatment: 'Teeth cleaned, extractions, antibiotics' },
      { date: '2022-04-15', reason: 'Urinating outside litter box', diagnosis: 'Behavioral vs medical', treatment: 'Urinalysis normal, behavior modification' },
      { date: '2022-11-20', reason: 'Dental recheck', diagnosis: 'Gingivitis returning', treatment: 'Home dental care education' },
      { date: '2023-07-08', reason: 'Still inappropriate urination', diagnosis: 'Stress-related', treatment: 'Feliway, additional litter boxes' },
      { date: '2024-02-14', reason: 'Dental disease progression', diagnosis: 'Multiple tooth resorptions', treatment: 'Major dental, 8 extractions' },
      { date: '2024-10-30', reason: 'Aggression toward other cat', diagnosis: 'Inter-cat aggression', treatment: 'Behavior consult, environmental modification' },
      { date: '2025-05-15', reason: 'Dental follow-up, urination issues', diagnosis: 'Healing well, stress cystitis', treatment: 'Pain management, stress reduction plan' }
    ]
  },
  {
    clientId: 'C1010',
    clientFirstName: 'Robert',
    clientLastName: 'Taylor',
    clientEmail: 'rtaylor@email.com',
    emailDeclined: false,
    phoneHome: '(503) 555-9012',
    phoneExt: '',
    phoneDeclined: false,

    balanceDue: '1250.00',
    address: '678 Spruce Street',
    city: 'Portland',
    stateProv: 'OR',
    postalCode: '97210',

    patientId: 'P2010',
    patientName: 'Zeus',
    species: 'Canine',
    sex: 'Neutered Male',
    breed: 'Great Dane',
    birthDate: '2020-11-15',
    ageYears: '4',
    ageMonths: '7',
    ageDays: '4',
    weightDate: '2025-06-05',
    weight: '145.6',
    additionalNotes: 'Gentle with people, anxious at vet',
    alertNotes: 'History of GDV (bloat) - gastropexy done',

    primaryReason: 'Preventive care visit',
    secondaryReason: 'Stomach health monitoring',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: 'Dr. Williams',
    referralRecheck: false,

    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',

    medicalHistory: [
      { date: '2021-08-20', reason: 'Puppy wellness', diagnosis: 'Healthy giant breed puppy', treatment: 'Vaccines, discuss bloat prevention' },
      { date: '2022-04-10', reason: 'Rapid growth concerns', diagnosis: 'Normal for breed', treatment: 'Large breed puppy food, monitor' },
      { date: '2022-12-05', reason: 'Retching, distended abdomen', diagnosis: 'GDV (gastric dilatation-volvulus)', treatment: 'Emergency surgery, gastropexy performed' },
      { date: '2023-01-15', reason: 'Post-surgery recheck', diagnosis: 'Healing well', treatment: 'Continue restricted feeding schedule' },
      { date: '2023-08-22', reason: 'Annual exam', diagnosis: 'Healthy, gastropexy intact', treatment: 'Maintain feeding protocol' },
      { date: '2024-03-18', reason: 'Occasional vomiting', diagnosis: 'Eating too fast', treatment: 'Slow feeder bowl, smaller meals' },
      { date: '2024-11-30', reason: 'Preventive care', diagnosis: 'Stable, no GI issues', treatment: 'Continue preventive measures' },
      { date: '2025-06-05', reason: 'Preventive visit, stomach monitoring', diagnosis: 'Excellent health, gastropexy holding', treatment: 'Maintain current feeding and care routine' }
    ]
  }
];

export const PatientProvider = ({ children }) => {
  // Store all patients
  const [patients] = useState(mockPatients);

  // Current active patient data (for backward compatibility)
  const [patientData, setPatientData] = useState({
    // Client Info
    clientId: '',
    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    emailDeclined: false,
    phoneHome: '',
    phoneExt: '',
    phoneDeclined: false,

    // Billing & Contact
    balanceDue: '',
    address: '',
    city: '',
    stateProv: '',
    postalCode: '',

    // Patient Info
    patientId: '',
    patientName: '',
    species: '',
    sex: '',
    breed: '',
    birthDate: '',
    ageYears: '',
    ageMonths: '',
    ageDays: '',
    weightDate: '',
    weight: '',
    additionalNotes: '',
    alertNotes: '',

    // Visit Info
    primaryReason: '',
    secondaryReason: '',
    room: '',
    visitType: 'Outpatient',
    status: '',
    ward: '',
    cage: '',
    rdvmName: '',
    referralRecheck: false,

    // Check-In / Staff Info
    staffId: '',
    checkedInBy: '',
    checkInDate: '',
    checkOutDate: '',
  });

  // Use a ref to track if mock data has been set to prevent infinite loops
  const mockDataSet = useRef(false);

  // Search patients by name (patient or owner)
  const searchPatients = useCallback((searchTerm) => {
    if (!searchTerm) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return patients.filter(patient =>
      patient.patientName.toLowerCase().includes(lowerSearchTerm) ||
      patient.clientFirstName.toLowerCase().includes(lowerSearchTerm) ||
      patient.clientLastName.toLowerCase().includes(lowerSearchTerm) ||
      `${patient.clientFirstName} ${patient.clientLastName}`.toLowerCase().includes(lowerSearchTerm)
    );
  }, [patients]);

  // Set active patient
  const setActivePatient = useCallback((patient) => {
    if (patient) {
      setPatientData(patient);
      mockDataSet.current = true;
    }
  }, []);

  // Wrap setMockPatientData in useCallback to ensure its reference stability
  const setMockPatientData = useCallback(() => {
    // Only set the mock data if it hasn't been set already
    if (!mockDataSet.current) {
      // Set Wilson as the default patient
      setActivePatient(patients[0]);
    }
  }, [patients, setActivePatient]);

  const value = useMemo(() => ({
    patientData,
    setPatientData,
    setMockPatientData,
    patients,
    searchPatients,
    setActivePatient
  }), [patientData, setMockPatientData, patients, searchPatients, setActivePatient]);

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};
