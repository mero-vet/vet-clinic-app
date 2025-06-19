export const testDefinitions = [
  {
    id: 'workflow-1',
    name: 'New Client + Patient Registration',
    description:
      'Search for duplicates → create client → add multiple pets → capture consent forms',
    successCriteria: [
      { type: 'url-contains', value: '/create-client' },
      { type: 'selector', selector: 'h2' },
      { type: 'selector', selector: 'form', mustExist: false },
    ],
  },
  {
    id: 'workflow-2',
    name: 'Appointment Scheduling & Confirmation',
    description:
      'Find open slot ➜ book visit type ➜ auto-confirm via SMS/email ➜ update calendar',
    successCriteria: [
      { type: 'url-contains', value: '/scheduler' },
      { type: 'selector', selector: 'table' },
      { type: 'selector', selector: 'button.windows-button' },
    ],
  },
  {
    id: 'workflow-3',
    name: 'Patient Check-In',
    description: 'Arrive patient ➜ verify info ➜ weigh ➜ triage notes ➜ place in exam room',
    successCriteria: [
      { type: 'selector', selector: '.patient-checkin-grid' },
      { type: 'selector', selector: '.patient-checkin-column' },
      { type: 'url-contains', value: '/' },
    ],
  },
  {
    id: 'workflow-4',
    name: 'Doctor Exam & Medical Record Entry',
    description: 'SOAP entry ➜ add problems & diagnoses ➜ prescribe meds ➜ add follow-up',
    successCriteria: [
      { type: 'url-contains', value: '/records' },
      { type: 'selector', selector: '.title-bar-text' },
      { type: 'selector', selector: '.windows-button' },
    ],
  },
  {
    id: 'workflow-5',
    name: 'Diagnostics Ordering',
    description:
      'Select lab/imaging ➜ generate requisition ➜ simulate result return ➜ attach to record',
    successCriteria: [
      { type: 'url-contains', value: '/services' },
      { type: 'selector', selector: '.title-bar-text' },
      { type: 'selector', selector: 'fieldset legend' },
    ],
  },
  {
    id: 'workflow-6',
    name: 'Treatment Plan & Estimate',
    description:
      'Build estimate ➜ present to owner ➜ capture electronic approval ➜ convert to invoice',
    successCriteria: [
      { type: 'url-contains', value: '/invoices' },
      { type: 'selector', selector: 'table.services-table' },
      { type: 'selector', selector: 'legend' },
    ],
  },
  {
    id: 'workflow-7',
    name: 'Pharmacy Dispensing',
    description: 'Check prescription ➜ deduct inventory ➜ print label ➜ record lot/expiry',
    successCriteria: [
      { type: 'url-contains', value: '/pharmacy' },
      { type: 'selector', selector: '.title-bar-text' },
      { type: 'selector', selector: 'table.windows-table' },
    ],
  },
  {
    id: 'workflow-8',
    name: 'Invoice & Payment Processing',
    description:
      'Add charges ➜ apply discounts/taxes ➜ split payment (cash/Card/on-account) ➜ email receipt',
    successCriteria: [
      { type: 'url-contains', value: '/invoices' },
      { type: 'selector', selector: '.title-bar-text' },
      { type: 'selector', selector: 'legend' },
    ],
  },
  {
    id: 'workflow-9',
    name: 'Reminder Generation & Outreach',
    description: 'Auto-create vaccine/med reminders ➜ batch send ➜ track responses',
    successCriteria: [
      { type: 'url-contains', value: '/communications' },
      { type: 'selector', selector: '.title-bar-text' },
      { type: 'selector', selector: 'table.windows-table' },
    ],
  },
  {
    id: 'workflow-10',
    name: 'End-of-Day Reconciliation & Reporting',
    description:
      'Close invoices ➜ cash drawer balance ➜ inventory adjustments ➜ generate financial, productivity reports',
    successCriteria: [
      { type: 'url-contains', value: '/reports' },
      { type: 'selector', selector: '.title-bar-text' },
      { type: 'selector', selector: 'table.windows-table' },
    ],
  },
];

export default testDefinitions;