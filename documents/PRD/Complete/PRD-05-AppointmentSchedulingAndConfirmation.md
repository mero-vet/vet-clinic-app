# PRD-05: Appointment Scheduling & Confirmation

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/screens/SchedulingScreen.jsx`
  - Main scheduling interface
  - Calendar view and appointment management
- `src/context/SchedulingContext.jsx`
  - Appointment state management
  - Schedule data and availability logic
- `src/components/layouts/*/`
  - PIMS-specific scheduling UI variations
  - Layout adaptations for each system

### Referenced Components
- `src/context/PatientContext.jsx`
  - Patient selection and data
  - Medical history for appointment context
- `src/context/CommunicationsContext.jsx`
  - Confirmation message handling
  - Reminder scheduling integration
- `src/services/api.js`
  - API integration layer
  - External calendar sync capabilities

### New Files to Create
- `src/components/AppointmentScheduler/AppointmentForm.jsx`
  - Comprehensive appointment booking form
  - Reason codes and duration calculation
- `src/components/AppointmentScheduler/AvailabilityGrid.jsx`
  - Visual availability display
  - Multi-provider scheduling view
- `src/services/SchedulingService.js`
  - Business logic for scheduling rules
  - Conflict detection and resolution
- `src/utils/appointmentRules.js`
  - Appointment type definitions
  - Duration and resource requirements

## Objective

Create an intuitive appointment scheduling system that minimizes booking time while preventing conflicts, automatically calculating appropriate durations based on appointment type, and sending confirmations through the client's preferred communication channel. The system should support multi-doctor practices and integrate with existing patient records for context-aware scheduling.

## Implementation Plan

### Phase 1: Core Scheduling Interface
- [ ] 1.1 Enhance calendar view
  - Implement day/week/month views
  - Add drag-and-drop rescheduling
  - Show appointment status colors
  - Dependencies: none
- [ ] 1.2 Create appointment form
  - Patient selection with search
  - Appointment type dropdown
  - Reason for visit field
  - Dependencies: none
- [ ] 1.3 Implement duration calculation
  - Appointment type-based defaults
  - Manual override option
  - Buffer time configuration
  - Dependencies: 1.2 must be completed

### Phase 2: Availability Management
- [ ] 2.1 Build availability engine
  - Provider schedule templates
  - Block-out time management
  - Resource availability checking
  - Dependencies: Phase 1 completed
- [ ] 2.2 Create availability visualization
  - Real-time slot availability
  - Multi-provider comparison view
  - Suggested appointment times
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Implement conflict detection
  - Double-booking prevention
  - Resource conflict alerts
  - Overbooking rules configuration
  - Dependencies: 2.2 must be completed

### Phase 3: Confirmation and Communication
- [ ] 3.1 Build confirmation system
  - Immediate email confirmation
  - SMS confirmation option
  - Printable appointment card
  - Dependencies: Phase 2 completed
- [ ] 3.2 Integrate reminder scheduling
  - Automatic reminder creation
  - Multi-channel reminders
  - Customizable timing rules
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Add rescheduling workflow
  - Client self-rescheduling link
  - Cancellation handling
  - Waitlist management
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Appointment Model
{
  appointmentId: "auto-generated",
  patientId: "foreign-key",
  clientId: "foreign-key",
  providerId: "foreign-key",
  appointmentType: "wellness|sick|surgery|dental|other",
  scheduledDate: "date",
  scheduledTime: "time",
  duration: "minutes",
  status: "scheduled|confirmed|arrived|in-progress|completed|cancelled|no-show",
  reasonForVisit: "string",
  notes: "string",
  resources: ["string"],
  confirmationSent: "boolean",
  confirmationMethod: "email|sms|phone|none",
  createdBy: "user-id",
  createdDate: "timestamp",
  modifiedDate: "timestamp"
}

// Provider Schedule Model
{
  providerId: "string",
  dayOfWeek: "0-6",
  startTime: "time",
  endTime: "time",
  lunchStart: "time",
  lunchEnd: "time",
  appointmentSlotDuration: "minutes",
  bufferTime: "minutes"
}

// Appointment Type Model
{
  typeId: "string",
  name: "string",
  defaultDuration: "minutes",
  requiredResources: ["string"],
  allowedProviders: ["provider-id"],
  colorCode: "hex",
  active: "boolean"
}
```

### Scheduling Algorithm
```javascript
// Availability calculation
function getAvailableSlots(date, provider, duration) {
  // 1. Get provider schedule for day
  // 2. Get existing appointments
  // 3. Calculate free slots
  // 4. Filter by requested duration
  // 5. Check resource availability
  // 6. Return available time slots
}

// Conflict detection
function checkConflicts(appointment) {
  // 1. Provider availability
  // 2. Patient double-booking
  // 3. Resource availability
  // 4. Schedule boundaries
  // 5. Business rules validation
}
```

### API Endpoints
- `GET /api/schedule/availability` - Get available time slots
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/{id}` - Update/reschedule appointment
- `POST /api/appointments/{id}/confirm` - Send confirmation
- `GET /api/providers/{id}/schedule` - Get provider schedule
- `POST /api/appointments/{id}/cancel` - Cancel appointment

## Success Criteria

- Average appointment booking time under 90 seconds
- Zero double-booking incidents
- 95% of appointments receive confirmation within 2 minutes
- Support for 20+ concurrent users without performance degradation
- Appointment search and retrieval under 500ms
- 90% reduction in phone-based scheduling

## Risks and Mitigations

### Technical Risks
- **Calendar synchronization conflicts**: Implement optimistic locking and conflict resolution UI
- **Performance with large schedules**: Add pagination and virtual scrolling for calendar views
- **Confirmation delivery failures**: Implement retry logic and delivery status tracking

### Integration Risks
- **External calendar sync issues**: Provide manual sync option and conflict reporting
- **SMS gateway failures**: Implement multiple gateway fallback options
- **Time zone complications**: Store all times in UTC with proper conversion

### User Experience Risks
- **Complex scheduling rules**: Provide scheduling wizard for complex appointments
- **Finding available slots**: Implement "next available" smart suggestions
- **Accidental double-booking**: Add confirmation step for potential conflicts

## Future Considerations

- Online self-scheduling portal for clients
- Mobile app integration
- Telemedicine appointment support
- Multi-location scheduling
- Equipment/room resource scheduling
- Automated waitlist management
- Smart scheduling optimization (AI-based)
- Integration with external calendars (Google, Outlook)
- Group appointment support (puppy classes)
- Recurring appointment templates
- Schedule optimization analytics
- Provider preference learning