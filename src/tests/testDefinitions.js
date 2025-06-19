export const testDefinitions = [
  {
    id: 'workflow-1',
    name: 'New Client + Patient Registration',
    description:
      'Search for duplicates → create client → add multiple pets → capture consent forms',
    successCriteria: [],
  },
  {
    id: 'workflow-2',
    name: 'Appointment Scheduling & Confirmation',
    description:
      'Find open slot ➜ book visit type ➜ auto-confirm via SMS/email ➜ update calendar',
    successCriteria: [],
  },
  {
    id: 'workflow-3',
    name: 'Patient Check-In',
    description: 'Arrive patient ➜ verify info ➜ weigh ➜ triage notes ➜ place in exam room',
    successCriteria: [],
  },
  {
    id: 'workflow-4',
    name: 'Doctor Exam & Medical Record Entry',
    description: 'SOAP entry ➜ add problems & diagnoses ➜ prescribe meds ➜ add follow-up',
    successCriteria: [],
  },
  {
    id: 'workflow-5',
    name: 'Diagnostics Ordering',
    description:
      'Select lab/imaging ➜ generate requisition ➜ simulate result return ➜ attach to record',
    successCriteria: [],
  },
  {
    id: 'workflow-6',
    name: 'Treatment Plan & Estimate',
    description:
      'Build estimate ➜ present to owner ➜ capture electronic approval ➜ convert to invoice',
    successCriteria: [],
  },
  {
    id: 'workflow-7',
    name: 'Pharmacy Dispensing',
    description: 'Check prescription ➜ deduct inventory ➜ print label ➜ record lot/expiry',
    successCriteria: [],
  },
  {
    id: 'workflow-8',
    name: 'Invoice & Payment Processing',
    description:
      'Add charges ➜ apply discounts/taxes ➜ split payment (cash/Card/on-account) ➜ email receipt',
    successCriteria: [],
  },
  {
    id: 'workflow-9',
    name: 'Reminder Generation & Outreach',
    description: 'Auto-create vaccine/med reminders ➜ batch send ➜ track responses',
    successCriteria: [],
  },
  {
    id: 'workflow-10',
    name: 'End-of-Day Reconciliation & Reporting',
    description:
      'Close invoices ➜ cash drawer balance ➜ inventory adjustments ➜ generate financial, productivity reports',
    successCriteria: [],
  },
];

export default testDefinitions;