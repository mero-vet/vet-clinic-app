# PRD-04: New Client + Patient Registration

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/screens/CreateNewClientScreen.jsx`
  - Primary UI for client creation workflow
  - Handles form submission and validation
- `src/screens/CreateNewClient/components/NewClientForm.jsx`
  - Form component with all client fields
  - Contains validation logic and state management
- `src/services/ClientService.js`
  - Service layer for client data operations
  - Handles API calls and data persistence
- `src/context/PatientContext.jsx`
  - Patient data management and state
  - Needs extension for patient registration

### Referenced Components
- `src/context/PIMSContext.jsx`
  - PIMS configuration and theme management
  - Provides system-specific styling and behavior
- `src/screens/ClientCreationSuccessScreen.jsx`
  - Success confirmation screen
  - Shows next steps after registration
- `src/components/PatientSearchBar.jsx`
  - Search functionality integration
  - Updates after new registration

### New Files to Create
- `src/screens/PatientRegistration/PatientRegistrationForm.jsx`
  - Dedicated patient registration form
  - Species-specific field management
- `src/services/PatientService.js`
  - Patient-specific data operations
  - Vaccination schedule generation
- `src/utils/validationRules.js`
  - Centralized validation logic
  - Phone, email, and data format validation

## Objective

Enable efficient registration of new clients and their pets in a single streamlined workflow that captures all required information while minimizing data entry time. The system should support multiple pet registration per client, generate appropriate reminders based on species and age, and integrate seamlessly with existing patient search and medical records functionality.

## Implementation Plan

### Phase 1: Client Registration Enhancement
- [ ] 1.1 Enhance existing client form validation
  - Add real-time validation feedback
  - Implement phone number formatting
  - Add email validation
  - Dependencies: none
- [ ] 1.2 Add client data persistence
  - Implement local storage backup
  - Add duplicate client detection
  - Create client ID generation
  - Dependencies: 1.1 must be completed
- [ ] 1.3 Improve success flow
  - Add option to register patient immediately
  - Generate client barcode/ID card
  - Send welcome email option
  - Dependencies: 1.2 must be completed

### Phase 2: Patient Registration Integration
- [ ] 2.1 Create patient registration form component
  - Species selection (dog, cat, exotic)
  - Breed autocomplete with common breeds
  - Age/DOB calculator
  - Dependencies: Phase 1 completed
- [ ] 2.2 Implement multi-pet registration
  - Add "Add Another Pet" functionality
  - Maintain client context across pets
  - Show registered pets summary
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Generate vaccination schedules
  - Species-specific vaccine protocols
  - Age-based scheduling
  - Reminder preference settings
  - Dependencies: 2.2 must be completed

### Phase 3: Data Integration and Search
- [ ] 3.1 Update patient search functionality
  - Index new patients immediately
  - Update search suggestions
  - Add recent registrations quick access
  - Dependencies: Phase 2 completed
- [ ] 3.2 Integrate with medical records
  - Create initial patient record
  - Set up problem list template
  - Initialize medication history
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Connect reminder system
  - Generate initial reminders
  - Set communication preferences
  - Schedule welcome follow-up
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Client Model
{
  clientId: "auto-generated",
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  alternatePhone: "string",
  address: {
    street: "string",
    city: "string",
    state: "string",
    zip: "string"
  },
  preferredContact: "email|phone|text",
  notes: "string",
  createdDate: "timestamp",
  lastModified: "timestamp"
}

// Patient Model
{
  patientId: "auto-generated",
  clientId: "foreign-key",
  name: "string",
  species: "dog|cat|exotic",
  breed: "string",
  color: "string",
  sex: "M|F|MN|FS",
  dateOfBirth: "date",
  microchip: "string",
  weight: "number",
  rabiesTag: "string",
  alerts: ["string"],
  createdDate: "timestamp"
}
```

### API Endpoints
- `POST /api/clients` - Create new client
- `POST /api/patients` - Create new patient
- `GET /api/clients/check-duplicate` - Check for existing clients
- `GET /api/breeds/{species}` - Get breed list for autocomplete
- `POST /api/reminders/generate` - Generate initial reminders

### State Management
- Extend PatientContext to handle registration state
- Add form validation state management
- Implement multi-step form navigation
- Cache partial form data to prevent loss

## Success Criteria

- New client registration completes in under 2 minutes
- Zero data loss during multi-step registration
- 95% of required fields pass validation on first attempt
- Search results update within 1 second of registration
- Appropriate reminders generated for 100% of new patients
- Support for registering 5+ pets per client without performance degradation

## Risks and Mitigations

### Technical Risks
- **Data loss during registration**: Implement auto-save and local storage backup
- **Duplicate client creation**: Add real-time duplicate checking with fuzzy matching
- **Performance with large breed lists**: Implement virtual scrolling and lazy loading

### Integration Risks
- **Search index lag**: Implement optimistic updates to search results
- **Reminder generation failures**: Add retry mechanism and manual generation option
- **PIMS compatibility**: Test across all 5 PIMS layouts for consistent behavior

### User Experience Risks
- **Form abandonment**: Add progress indicators and save draft functionality
- **Validation frustration**: Provide clear, helpful error messages and formatting hints

## Future Considerations

- Integration with online pre-registration forms
- Mobile app support for client self-registration
- Automatic insurance verification
- Integration with microchip registries
- Photo upload for patient identification
- Family account linking for multi-household pets
- Referral tracking and rewards program
- Integration with national breed registries
- Support for livestock and large animal practices