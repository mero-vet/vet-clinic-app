# PRD-08: Diagnostics Ordering

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/screens/ServicesScreen.jsx`
  - Main services and diagnostics interface
  - Test ordering workflow
- `src/screens/Services/LabTestOrderForm.jsx`
  - Lab test selection and ordering
  - Sample requirements display
- `src/screens/Services/ServicesCatalog.jsx`
  - Available tests catalog
  - Pricing and turnaround display
- `src/screens/Services/OrdersHistory.jsx`
  - Previous orders tracking
  - Result status monitoring

### Referenced Components
- `src/context/PatientContext.jsx`
  - Patient information for orders
  - Previous test history
- `src/context/MedicalRecordsContext.jsx`
  - Integration with medical notes
  - Result documentation
- `src/context/InvoiceContext.jsx`
  - Billing integration
  - Cost estimates

### New Files to Create
- `src/components/Diagnostics/TestCatalog.jsx`
  - Comprehensive test directory
  - Search and filter capabilities
- `src/components/Diagnostics/OrderBuilder.jsx`
  - Multi-test order creation
  - Panel recommendations
- `src/components/Diagnostics/ResultsViewer.jsx`
  - Result display interface
  - Trend analysis tools
- `src/services/DiagnosticsService.js`
  - Lab integration logic
  - Result processing
- `src/utils/diagnosticPanels.js`
  - Common panel definitions
  - Species-specific recommendations

## Objective

Streamline diagnostic test ordering to reduce errors and improve efficiency while ensuring proper sample collection, lab communication, and result tracking. The system should guide users through test selection, automatically suggest relevant panels, handle lab requisitions, and integrate results directly into patient records, reducing ordering time by 60%.

## Implementation Plan

### Phase 1: Test Catalog and Ordering
- [ ] 1.1 Build comprehensive test catalog
  - In-house vs reference lab tests
  - Test descriptions and requirements
  - Sample type specifications
  - Dependencies: none
- [ ] 1.2 Create intelligent search
  - Test name and alias search
  - Category filtering
  - Common panels quick access
  - Dependencies: 1.1 must be completed
- [ ] 1.3 Implement order builder
  - Multi-test selection
  - Sample consolidation
  - Special instructions capture
  - Dependencies: 1.2 must be completed

### Phase 2: Clinical Decision Support
- [ ] 2.1 Add panel recommendations
  - Condition-based suggestions
  - Species-specific panels
  - Age-appropriate screening
  - Dependencies: Phase 1 completed
- [ ] 2.2 Implement test interactions
  - Incompatible test warnings
  - Fasting requirements
  - Timing considerations
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Create cost estimation
  - Real-time pricing display
  - Insurance coverage indication
  - Package deal suggestions
  - Dependencies: 2.2 must be completed

### Phase 3: Lab Integration and Results
- [ ] 3.1 Build lab requisitions
  - Electronic order submission
  - Barcode generation
  - Sample labeling
  - Dependencies: Phase 2 completed
- [ ] 3.2 Implement result receiving
  - Automated result import
  - Critical value alerts
  - Result verification workflow
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Create result interpretation
  - Reference range display
  - Trend visualization
  - Abnormal value highlighting
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Diagnostic Test Model
{
  testId: "auto-generated",
  code: "string",
  name: "string",
  aliases: ["string"],
  category: "chemistry|hematology|urinalysis|cytology|imaging|other",
  laboratory: "in-house|reference-lab-name",
  sampleType: "blood|urine|fecal|tissue|other",
  sampleVolume: "string",
  container: "string",
  specialRequirements: {
    fasting: "boolean",
    fastingHours: "number",
    specialHandling: "string"
  },
  turnaroundTime: "hours",
  price: "number",
  species: ["dog|cat|exotic"],
  referenceRanges: [{
    species: "string",
    ageRange: { min: "months", max: "months" },
    sex: "M|F|any",
    normal: { min: "number", max: "number" },
    unit: "string"
  }]
}

// Diagnostic Order Model
{
  orderId: "auto-generated",
  patientId: "foreign-key",
  visitId: "foreign-key",
  orderedBy: "doctor-id",
  orderDate: "timestamp",
  status: "pending|collected|sent|partial|complete|cancelled",
  priority: "routine|stat|asap",
  tests: [{
    testId: "foreign-key",
    status: "ordered|collected|resulted",
    specialInstructions: "string",
    sampleCollected: "timestamp",
    resultReceived: "timestamp"
  }],
  laboratoryRequisition: "string",
  totalCost: "number",
  notes: "string"
}

// Test Result Model
{
  resultId: "auto-generated",
  orderId: "foreign-key",
  testId: "foreign-key",
  value: "string|number",
  unit: "string",
  referenceRange: "string",
  flag: "normal|low|high|critical-low|critical-high",
  comments: "string",
  performedBy: "string",
  verifiedBy: "doctor-id",
  resultDate: "timestamp",
  methodology: "string"
}
```

### Panel Logic
```javascript
// Common diagnostic panels
const diagnosticPanels = {
  'wellness-senior': {
    name: 'Senior Wellness Panel',
    tests: ['CBC', 'CHEM17', 'UA', 'T4'],
    species: ['dog', 'cat'],
    ageMinMonths: 84
  },
  'pre-anesthetic': {
    name: 'Pre-Anesthetic Panel',
    tests: ['CBC', 'CHEM6', 'PT/PTT'],
    species: ['dog', 'cat']
  },
  'gi-panel': {
    name: 'GI Panel',
    tests: ['CBC', 'CHEM17', 'PLI', 'B12/Folate', 'Fecal'],
    species: ['dog', 'cat']
  }
};

// Test recommendation engine
function recommendTests(patientData, symptoms) {
  // Based on age, species, symptoms
  // Previous test history
  // Time since last similar tests
  // Return recommended panels and individual tests
}
```

### Lab Integration
- HL7 message formatting for orders
- Result file parsing (PDF, HL7, CSV)
- Automated result mapping
- Critical value notification system
- Lab interface error handling

## Success Criteria

- Average test ordering time under 60 seconds
- 95% accuracy in test selection (no missing tests)
- Zero sample labeling errors
- Results available in patient record within 5 minutes of receipt
- 100% critical value notification delivery
- Support for 50+ concurrent orders without degradation
- 90% of common panels ordered with single click

## Risks and Mitigations

### Technical Risks
- **Lab interface failures**: Manual entry backup with validation
- **Result mapping errors**: Human verification for critical results
- **Sample identification issues**: Redundant barcode systems

### Clinical Risks
- **Wrong test selection**: Clinical decision support and warnings
- **Missed critical values**: Multiple notification channels with acknowledgment
- **Sample collection errors**: Visual guides and requirement checklists

### Operational Risks
- **Lab communication delays**: Status monitoring and escalation alerts
- **Cost estimate inaccuracy**: Regular price synchronization
- **Result interpretation errors**: Clear reference ranges and flags

## Future Considerations

- AI-powered test recommendations
- Direct lab equipment interfaces
- Mobile sample collection app
- Client result portal access
- Automated retest scheduling
- Research study integration
- Genetic testing integration
- Point-of-care device connectivity
- Automated QC tracking
- Benchmarking against population
- Predictive analytics
- Integration with specialty labs
- Telepathology consultation