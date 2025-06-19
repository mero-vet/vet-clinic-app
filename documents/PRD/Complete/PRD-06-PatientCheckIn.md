# PRD-06: Patient Check-In

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/screens/PatientCheckinScreen.jsx`
  - Main check-in interface
  - Orchestrates check-in workflow
- `src/screens/PatientCheckin/components/CheckInOutButtons.jsx`
  - Check-in/out state management
  - Status updates and timestamps
- `src/screens/PatientCheckin/components/ClientInfo.jsx`
  - Client information display
  - Contact verification interface
- `src/screens/PatientCheckin/components/PatientInfo.jsx`
  - Patient details and alerts
  - Weight capture interface
- `src/screens/PatientCheckin/components/ReasonForVisit.jsx`
  - Visit reason capture
  - Chief complaint documentation
- `src/screens/PatientCheckin/components/RemindersAppointments.jsx`
  - Due reminders display
  - Appointment verification

### Referenced Components
- `src/context/PatientContext.jsx`
  - Current patient data
  - Visit history access
- `src/context/SchedulingContext.jsx`
  - Appointment verification
  - Schedule updates
- `src/services/api.js`
  - Check-in data persistence
  - Status broadcasting

### New Files to Create
- `src/components/CheckIn/ConsentForms.jsx`
  - Digital consent capture
  - Signature collection
- `src/components/CheckIn/PaymentVerification.jsx`
  - Balance display
  - Payment collection interface
- `src/services/CheckInService.js`
  - Check-in business logic
  - Queue management
- `src/utils/checkInValidation.js`
  - Required field validation
  - Consent verification

## Objective

Streamline the patient check-in process to reduce wait times and ensure all necessary information is captured before the appointment begins. The system should verify patient information, capture reason for visit, update weight records, handle consent forms, and notify staff when patients are ready, reducing check-in time to under 3 minutes.

## Implementation Plan

### Phase 1: Core Check-In Workflow
- [ ] 1.1 Enhance appointment verification
  - Auto-load from today's schedule
  - Walk-in appointment creation
  - Appointment time validation
  - Dependencies: none
- [ ] 1.2 Improve information verification
  - Highlight changed fields
  - One-click confirmation
  - Update prompt for outdated info
  - Dependencies: none
- [ ] 1.3 Optimize weight capture
  - Previous weight display
  - Percentage change calculation
  - Abnormal change alerts
  - Dependencies: none

### Phase 2: Clinical Information Capture
- [ ] 2.1 Enhance reason for visit
  - Template quick selections
  - Previous visit reference
  - Symptom duration capture
  - Dependencies: Phase 1 completed
- [ ] 2.2 Add medication verification
  - Current medication list
  - Compliance checking
  - Refill needs flagging
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Implement alert management
  - Aggressive/caution alerts
  - Allergy notifications
  - Special handling notes
  - Dependencies: 2.2 must be completed

### Phase 3: Administrative Completion
- [ ] 3.1 Build consent management
  - Annual consent tracking
  - Procedure-specific consents
  - Digital signature capture
  - Dependencies: Phase 2 completed
- [ ] 3.2 Add payment verification
  - Outstanding balance display
  - Estimate review
  - Payment collection
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Create staff notification system
  - Room assignment
  - Ready status broadcast
  - Wait time tracking
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Check-In Model
{
  checkInId: "auto-generated",
  appointmentId: "foreign-key",
  patientId: "foreign-key",
  checkInTime: "timestamp",
  checkInBy: "user-id",
  status: "checked-in|in-room|with-doctor|check-out|completed",
  roomNumber: "string",
  weight: {
    value: "number",
    unit: "lbs|kg",
    changeFromLast: "percentage"
  },
  reasonForVisit: "string",
  symptoms: [{
    description: "string",
    duration: "string",
    severity: "mild|moderate|severe"
  }],
  vitals: {
    temperature: "number",
    pulse: "number",
    respiration: "number"
  },
  verifiedInfo: {
    contact: "boolean",
    insurance: "boolean",
    medications: "boolean"
  },
  consentsObtained: ["consent-type"],
  paymentStatus: "paid|due|arrangement",
  notes: "string"
}

// Queue Model
{
  queueId: "auto-generated",
  date: "date",
  entries: [{
    patientId: "string",
    checkInTime: "timestamp",
    status: "waiting|in-room|with-doctor",
    priority: "normal|urgent",
    waitTime: "minutes",
    assignedRoom: "string",
    assignedStaff: "user-id"
  }]
}
```

### Check-In Flow State Machine
```javascript
const checkInStates = {
  ARRIVAL: 'arrival',
  VERIFICATION: 'verification',
  CLINICAL_INFO: 'clinical_info',
  CONSENTS: 'consents',
  PAYMENT: 'payment',
  READY: 'ready',
  IN_ROOM: 'in_room',
  WITH_DOCTOR: 'with_doctor',
  CHECKOUT: 'checkout'
};

// Transition rules
const transitions = {
  [ARRIVAL]: [VERIFICATION],
  [VERIFICATION]: [CLINICAL_INFO],
  [CLINICAL_INFO]: [CONSENTS],
  [CONSENTS]: [PAYMENT],
  [PAYMENT]: [READY],
  [READY]: [IN_ROOM],
  [IN_ROOM]: [WITH_DOCTOR],
  [WITH_DOCTOR]: [CHECKOUT]
};
```

### Real-Time Updates
- WebSocket connection for queue updates
- Status changes broadcast to all stations
- Wait time calculations every 30 seconds
- Room availability real-time sync

## Success Criteria

- Average check-in time under 3 minutes
- 100% capture of required clinical information
- Real-time queue visibility across all workstations
- Zero lost check-ins due to system issues
- 95% of weights captured and compared to previous
- Consent compliance tracking at 100%
- Staff notification within 10 seconds of ready status

## Risks and Mitigations

### Technical Risks
- **Queue synchronization issues**: Implement robust WebSocket reconnection and state reconciliation
- **Signature capture failures**: Provide fallback to paper consent with scan option
- **Scale during busy periods**: Implement queue optimization and load balancing

### Workflow Risks
- **Incomplete check-ins**: Enforce required fields and provide clear progress indicators
- **Room assignment conflicts**: Real-time room availability with automatic reassignment
- **Payment processing delays**: Async payment processing with manual override option

### Compliance Risks
- **Missing consents**: Block appointment start until critical consents obtained
- **Data privacy during check-in**: Implement privacy screens and automatic timeout
- **Audit trail gaps**: Comprehensive logging of all check-in actions and changes

## Future Considerations

- Self-service kiosk check-in option
- Mobile pre-check-in from parking lot
- Biometric patient identification
- Integration with smart scales
- Automated vital signs capture
- AI-powered triage suggestions
- Waiting room display integration
- Family/multi-pet check-in
- Telemedicine check-in flow
- Insurance card scanning
- Real-time wait time predictions
- Check-in analytics dashboard