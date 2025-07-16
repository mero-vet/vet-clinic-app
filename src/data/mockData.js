// Mock data for the scheduling system
// This is a frontend-only sandbox, so all data is hardcoded

export const MOCK_PROVIDERS = [
  { id: 'P001', name: 'Dr. Smith', type: 'Veterinarian', color: '#4CAF50' },
  { id: 'P002', name: 'Dr. Johnson', type: 'Veterinarian', color: '#2196F3' },
  { id: 'P003', name: 'Dr. Williams', type: 'Veterinarian', color: '#FF9800' },
  { id: 'P004', name: 'Tech Sarah', type: 'Technician', color: '#9C27B0' },
  { id: 'P005', name: 'Tech Mike', type: 'Technician', color: '#00BCD4' }
];

export const MOCK_APPOINTMENTS = [
  {
    id: 'APT001',
    date: '2025-07-17',
    time: '09:00',
    patient: 'Fluffy Johnson',
    owner: 'Mary Johnson',
    reason: 'Annual Checkup',
    appointmentType: 'Wellness',
    staff: 'Dr. Smith',
    providerId: 'P001',
    duration: 30,
    status: 'scheduled',
    confirmationSent: false,
    roomName: 'Exam Room 1'
  },
  {
    id: 'APT002',
    date: '2025-07-17',
    time: '10:00',
    patient: 'Max Williams',
    owner: 'John Williams',
    reason: 'Vaccination',
    appointmentType: 'Vaccination',
    staff: 'Dr. Smith',
    providerId: 'P001',
    duration: 20,
    status: 'scheduled',
    confirmationSent: true,
    roomName: 'Exam Room 1'
  },
  {
    id: 'APT003',
    date: '2025-07-17',
    time: '11:00',
    patient: 'Bella Davis',
    owner: 'Sarah Davis',
    reason: 'Dental Cleaning',
    appointmentType: 'Surgery',
    staff: 'Dr. Johnson',
    providerId: 'P002',
    duration: 60,
    status: 'scheduled',
    confirmationSent: false,
    roomName: 'Surgery Suite'
  },
  {
    id: 'APT004',
    date: '2025-07-17',
    time: '14:00',
    patient: 'Charlie Brown',
    owner: 'Mike Brown',
    reason: 'Limping - Front Leg',
    appointmentType: 'Sick Visit',
    staff: 'Dr. Williams',
    providerId: 'P003',
    duration: 30,
    status: 'scheduled',
    confirmationSent: false,
    roomName: 'Exam Room 2'
  },
  {
    id: 'APT005',
    date: '2025-07-18',
    time: '09:30',
    patient: 'Luna Garcia',
    owner: 'Maria Garcia',
    reason: 'Spay Surgery',
    appointmentType: 'Surgery',
    staff: 'Dr. Johnson',
    providerId: 'P002',
    duration: 90,
    status: 'scheduled',
    confirmationSent: true,
    roomName: 'Surgery Suite'
  }
];

// Appointment types for the form
export const APPOINTMENT_TYPES = [
  { value: 'Wellness', label: 'Wellness/Checkup' },
  { value: 'Vaccination', label: 'Vaccination' },
  { value: 'Sick Visit', label: 'Sick Visit' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Dental', label: 'Dental' },
  { value: 'Grooming', label: 'Grooming' },
  { value: 'Other', label: 'Other' }
];

// Mock rooms
export const MOCK_ROOMS = [
  { id: 'R001', name: 'Exam Room 1', type: 'exam' },
  { id: 'R002', name: 'Exam Room 2', type: 'exam' },
  { id: 'R003', name: 'Exam Room 3', type: 'exam' },
  { id: 'R004', name: 'Surgery Suite', type: 'surgery' },
  { id: 'R005', name: 'Dental Suite', type: 'dental' },
  { id: 'R006', name: 'Grooming Area', type: 'grooming' }
];

// Mock patients for the dropdown
export const MOCK_PATIENTS = [
  { id: 'PAT001', name: 'Fluffy Johnson', owner: 'Mary Johnson', species: 'Cat' },
  { id: 'PAT002', name: 'Max Williams', owner: 'John Williams', species: 'Dog' },
  { id: 'PAT003', name: 'Bella Davis', owner: 'Sarah Davis', species: 'Dog' },
  { id: 'PAT004', name: 'Charlie Brown', owner: 'Mike Brown', species: 'Dog' },
  { id: 'PAT005', name: 'Luna Garcia', owner: 'Maria Garcia', species: 'Cat' },
  { id: 'PAT006', name: 'Milo Anderson', owner: 'Lisa Anderson', species: 'Cat' },
  { id: 'PAT007', name: 'Rocky Martinez', owner: 'Carlos Martinez', species: 'Dog' },
  { id: 'PAT008', name: 'Smokey Wilson', owner: 'Tom Wilson', species: 'Cat' },
  { id: 'PAT009', name: 'Duke Thompson', owner: 'Emma Thompson', species: 'Dog' },
  { id: 'PAT010', name: 'Oreo Lee', owner: 'Kevin Lee', species: 'Rabbit' }
];

// Time slots for the scheduler
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30'
];

// Fallback configuration for when PIMS config is undefined
export const FALLBACK_CONFIG = {
  name: 'Default',
  screenLabels: {
    scheduler: 'Appointment Scheduler',
    checkin: 'Check-In',
    notes: 'Notes',
    services: 'Services',
    invoices: 'Invoices',
    records: 'Medical Records',
    inventory: 'Inventory',
    communications: 'Communications',
    pharmacy: 'Pharmacy',
    reports: 'Reports'
  },
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529',
    border: '#dee2e6',
    highlight: '#0056b3'
  }
};