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
    agentPrompt: `Hello VetAssist, we have a brand new client named Sarah Johnson bringing in two pets (Bella – Golden Retriever, Max – German Shepherd). Please register Sarah as a new client, then create patient records for Bella (DOB 03/2019, spayed female) and Max (DOB 08/2018, neutered male). Ensure duplicate detection is run and all mandatory fields are completed. Let me know once registration is finished.`
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
    agentPrompt: `Hi VetAssist, please schedule a 30-minute wellness exam for Sammy (DOMESTIC SH, feline) with Dr. Smith next Tuesday at 10 AM. Confirm the appointment via SMS to owner Alex Morgan and email a reminder 24 hours before. Let me know when it's booked.`
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
    agentPrompt: `Hi VetAssist, Wilson has just arrived for his appointment. Please begin the check-in process: confirm his client information, capture his weight, complete triage notes and assign him to an exam room. Let me know when he is ready for the doctor.`
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
    agentPrompt: `VetAssist, open Wilson's medical record and create a new SOAP note for today's wellness visit. Use the canine wellness template, document normal findings, prescribe monthly heart-worm prevention, and finalize the note.`
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
    agentPrompt: `VetAssist, for Wilson please order a CBC/chemistry panel and thoracic radiographs. Generate the lab requisition and attach the orders to his record.`
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
    agentPrompt: `VetAssist, build a treatment plan for Bella's hip dysplasia: include hip radiographs, joint supplements, and a 6-session laser therapy package. Generate an estimate and present it for owner approval.`
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
    agentPrompt: `VetAssist, dispense Apoquel 5.4 mg tablets for Sammy: 1 tablet twice daily for 14 days with 2 refills. Deduct inventory, print the prescription label and record lot & expiry.`
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
    agentPrompt: `VetAssist, finalize today's charges for Max, apply his 10 % senior discount, collect $150 by credit card and place the remaining $50 on account. Email the paid receipt to owner Michael Chen.`
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
    agentPrompt: `VetAssist, generate vaccine reminders for all patients due next month, batch send the email reminders, and show me the send-status report.`
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
    agentPrompt: `VetAssist, run end-of-day: close all open invoices, count the cash drawer (expected $520), adjust inventory for dispensed items, and email the daily financial & productivity reports to management.`
  },
];

export default testDefinitions;