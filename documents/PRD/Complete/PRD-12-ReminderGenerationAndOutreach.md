# PRD-12: Reminder Generation & Outreach

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/context/CommunicationsContext.jsx`
  - Communication state management
  - Message queue handling
- `src/screens/CommunicationsScreen.jsx`
  - Communication center interface
  - Reminder management dashboard
- `src/screens/PatientCheckin/components/RemindersAppointments.jsx`
  - Reminder display during check-in
  - Due date tracking

### Referenced Components
- `src/context/PatientContext.jsx`
  - Patient reminder history
  - Vaccination schedules
- `src/context/SchedulingContext.jsx`
  - Appointment-based reminders
  - Follow-up scheduling
- `src/services/api.js`
  - Communication delivery
  - External service integration

### New Files to Create
- `src/components/Reminders/ReminderEngine.jsx`
  - Reminder generation logic
  - Rule-based scheduling
- `src/components/Reminders/CampaignBuilder.jsx`
  - Multi-patient campaigns
  - Targeted outreach tools
- `src/components/Reminders/MessageComposer.jsx`
  - Template-based messaging
  - Personalization engine
- `src/services/ReminderService.js`
  - Reminder business logic
  - Delivery orchestration
- `src/utils/reminderRules.js`
  - Species-specific schedules
  - Compliance tracking

## Objective

Create an intelligent reminder system that automatically generates and sends personalized communications to improve patient compliance and clinic revenue. The system should track vaccination schedules, wellness visits, medication refills, and follow-ups while supporting multiple communication channels and providing measurable results on outreach effectiveness.

## Implementation Plan

### Phase 1: Reminder Generation Engine
- [ ] 1.1 Build core reminder logic
  - Vaccination schedule tracking
  - Wellness visit calculations
  - Custom reminder types
  - Dependencies: none
- [ ] 1.2 Create rule engine
  - Species-specific protocols
  - Age-based adjustments
  - Override capabilities
  - Dependencies: 1.1 must be completed
- [ ] 1.3 Implement due date tracking
  - Real-time due calculations
  - Grace period handling
  - Overdue escalation
  - Dependencies: 1.2 must be completed

### Phase 2: Communication Management
- [ ] 2.1 Build message templating
  - Personalization tokens
  - Multi-language support
  - A/B testing capability
  - Dependencies: Phase 1 completed
- [ ] 2.2 Create channel management
  - Email integration
  - SMS capabilities
  - Postal mail generation
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Implement preference handling
  - Client communication preferences
  - Opt-out management
  - Frequency controls
  - Dependencies: 2.2 must be completed

### Phase 3: Campaign and Analytics
- [ ] 3.1 Build campaign tools
  - Bulk reminder generation
  - Targeted filtering
  - Scheduled campaigns
  - Dependencies: Phase 2 completed
- [ ] 3.2 Create response tracking
  - Appointment booking tracking
  - Click/open rates
  - ROI calculation
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Implement analytics dashboard
  - Compliance rates
  - Revenue impact
  - Channel effectiveness
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Reminder Configuration Model
{
  configId: "auto-generated",
  reminderType: "vaccination|wellness|medication|follow-up|custom",
  name: "string",
  species: ["dog|cat|exotic"],
  trigger: {
    type: "age|date|interval|event",
    value: "number",
    unit: "days|weeks|months|years",
    basedOn: "dob|lastVisit|procedure|vaccination"
  },
  schedule: [{
    timing: "number",
    unit: "days|weeks|months",
    before: "boolean"
  }],
  active: "boolean",
  priority: "high|medium|low"
}

// Reminder Instance Model
{
  reminderId: "auto-generated",
  patientId: "foreign-key",
  clientId: "foreign-key",
  reminderType: "string",
  dueDate: "date",
  status: "pending|sent|responded|cancelled|expired",
  communications: [{
    sentDate: "timestamp",
    channel: "email|sms|mail|phone",
    template: "string",
    deliveryStatus: "sent|delivered|failed|opened|clicked",
    response: "booked|declined|no-response"
  }],
  appointmentBooked: "appointment-id",
  notes: "string"
}

// Campaign Model
{
  campaignId: "auto-generated",
  name: "string",
  type: "reminder|marketing|education|recall",
  status: "draft|scheduled|running|completed",
  criteria: {
    reminderTypes: ["string"],
    dueDateRange: { start: "date", end: "date" },
    species: ["string"],
    ageRange: { min: "months", max: "months" },
    lastVisitRange: { min: "days", max: "days" },
    customFilters: ["filter-object"]
  },
  messaging: {
    subject: "string",
    emailTemplate: "html",
    smsTemplate: "string",
    personalization: ["token"],
    callScript: "string"
  },
  schedule: {
    sendDate: "timestamp",
    channels: ["email|sms|mail"],
    throttling: {
      maxPerHour: "number",
      maxPerDay: "number"
    }
  },
  results: {
    totalSent: "number",
    delivered: "number",
    opened: "number",
    clicked: "number",
    appointments: "number",
    revenue: "number"
  }
}
```

### Reminder Generation Logic
```javascript
// Automatic reminder generation
function generateReminders(patient) {
  const reminders = [];
  const configs = getReminderConfigs(patient.species);
  
  configs.forEach(config => {
    const dueDate = calculateDueDate(patient, config);
    
    if (shouldGenerateReminder(patient, config, dueDate)) {
      reminders.push({
        patient: patient,
        type: config.reminderType,
        dueDate: dueDate,
        priority: config.priority,
        schedule: generateCommunicationSchedule(config, dueDate)
      });
    }
  });
  
  return reminders;
}

// Communication scheduling
function scheduleReminders(reminder) {
  const preferences = getClientPreferences(reminder.clientId);
  const schedule = [];
  
  reminder.schedule.forEach(timing => {
    if (preferences.channels.includes(timing.channel)) {
      schedule.push({
        sendDate: calculateSendDate(reminder.dueDate, timing),
        channel: selectBestChannel(preferences, timing),
        template: selectTemplate(reminder.type, timing)
      });
    }
  });
  
  return schedule;
}
```

### Analytics Tracking
```javascript
// ROI calculation
function calculateCampaignROI(campaign) {
  const costs = {
    email: campaign.results.emailsSent * 0.01,
    sms: campaign.results.smsSent * 0.05,
    mail: campaign.results.mailSent * 0.75
  };
  
  const totalCost = sum(Object.values(costs));
  const revenue = calculateAttributedRevenue(campaign);
  
  return {
    cost: totalCost,
    revenue: revenue,
    roi: (revenue - totalCost) / totalCost * 100,
    costPerAppointment: totalCost / campaign.results.appointments
  };
}
```

## Success Criteria

- Automatic reminder generation for 100% of eligible patients
- Communication delivery rate above 95%
- Appointment booking rate from reminders above 30%
- Zero duplicate reminders sent
- Campaign creation time under 5 minutes
- Real-time analytics updates
- Compliance improvement of 25% or greater

## Risks and Mitigations

### Technical Risks
- **Delivery failures**: Multiple delivery channels and retry logic
- **Duplicate sending**: Idempotency keys and send tracking
- **Scale issues**: Batch processing and queue management

### Compliance Risks
- **CAN-SPAM violations**: Opt-out management and compliance checks
- **TCPA compliance**: SMS consent tracking and time restrictions
- **Data privacy**: Secure communication channels and encryption

### Business Risks
- **Over-communication**: Frequency caps and fatigue monitoring
- **Poor response rates**: A/B testing and continuous optimization
- **Channel costs**: ROI monitoring and channel optimization

## Future Considerations

- AI-powered message optimization
- Predictive compliance modeling
- Voice call integration
- Social media outreach
- Mobile app push notifications
- Automated appointment booking
- Natural language responses
- Behavioral targeting
- Cross-sell recommendations
- Client lifetime value optimization
- Integration with marketing platforms
- Sentiment analysis of responses
- Dynamic scheduling optimization