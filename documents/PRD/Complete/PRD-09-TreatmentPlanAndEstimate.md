# PRD-09: Treatment Plan & Estimate

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/screens/InvoiceScreen.jsx`
  - Estimate creation interface
  - Line item management
- `src/context/InvoiceContext.jsx`
  - Estimate and invoice state
  - Calculation logic
- `src/screens/ServicesScreen.jsx`
  - Service selection interface
  - Treatment options display

### Referenced Components
- `src/context/PatientContext.jsx`
  - Patient medical context
  - Previous treatment history
- `src/context/MedicalRecordsContext.jsx`
  - Diagnosis linkage
  - Treatment documentation
- `src/screens/Services/ServicesCatalog.jsx`
  - Available treatments
  - Pricing information

### New Files to Create
- `src/components/TreatmentPlan/PlanBuilder.jsx`
  - Visual treatment plan creation
  - Multi-option presentation
- `src/components/TreatmentPlan/EstimateGenerator.jsx`
  - Automated estimate creation
  - Range-based pricing
- `src/components/TreatmentPlan/ConsentCapture.jsx`
  - Treatment consent forms
  - Digital signature integration
- `src/services/TreatmentPlanService.js`
  - Plan generation logic
  - Estimate calculations
- `src/utils/treatmentProtocols.js`
  - Standard treatment protocols
  - Best practice guidelines

## Objective

Enable veterinarians to quickly create comprehensive treatment plans with accurate cost estimates that clients can easily understand and approve. The system should present multiple treatment options, automatically calculate costs including ranges for procedures, and capture informed consent, reducing treatment planning time by 70% while improving client communication and compliance.

## Implementation Plan

### Phase 1: Treatment Plan Builder
- [ ] 1.1 Create plan structure interface
  - Problem-oriented organization
  - Priority level assignment
  - Timeline visualization
  - Dependencies: none
- [ ] 1.2 Build treatment selection
  - Service/procedure catalog
  - Medication integration
  - Alternative options
  - Dependencies: 1.1 must be completed
- [ ] 1.3 Implement protocol templates
  - Common condition protocols
  - Customizable templates
  - Evidence-based defaults
  - Dependencies: 1.2 must be completed

### Phase 2: Estimate Generation
- [ ] 2.1 Build pricing engine
  - Service-based pricing
  - Range calculations
  - Package discounts
  - Dependencies: Phase 1 completed
- [ ] 2.2 Create estimate presentation
  - Good/Better/Best options
  - Visual cost breakdown
  - Payment plan integration
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Add estimate communication
  - Print-friendly format
  - Email capability
  - Client portal sharing
  - Dependencies: 2.2 must be completed

### Phase 3: Consent and Approval
- [ ] 3.1 Implement consent management
  - Treatment-specific consents
  - Risk disclosure
  - Alternative documentation
  - Dependencies: Phase 2 completed
- [ ] 3.2 Build approval workflow
  - Partial approval handling
  - Declined item tracking
  - Approved plan activation
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Create plan tracking
  - Treatment completion marking
  - Progress monitoring
  - Outcome documentation
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Treatment Plan Model
{
  planId: "auto-generated",
  patientId: "foreign-key",
  visitId: "foreign-key",
  createdBy: "doctor-id",
  createdDate: "timestamp",
  status: "draft|presented|approved|partial|declined|completed",
  problems: [{
    problemId: "string",
    description: "string",
    priority: "high|medium|low",
    treatments: [{
      treatmentId: "string",
      type: "procedure|medication|diagnostic|other",
      description: "string",
      isRequired: "boolean",
      alternatives: ["treatment-id"]
    }]
  }],
  timeline: {
    immediate: ["treatment-id"],
    shortTerm: ["treatment-id"],
    longTerm: ["treatment-id"]
  },
  notes: "string"
}

// Estimate Model
{
  estimateId: "auto-generated",
  planId: "foreign-key",
  version: "number",
  createdDate: "timestamp",
  expirationDate: "date",
  status: "draft|sent|viewed|approved|expired",
  options: [{
    optionName: "good|better|best|custom",
    lineItems: [{
      serviceId: "string",
      description: "string",
      quantity: "number",
      unitPrice: "number",
      priceRange: {
        low: "number",
        high: "number"
      },
      discount: "percentage",
      total: "number"
    }],
    subtotal: "number",
    tax: "number",
    total: "number"
  }],
  approvedOption: "string",
  approvedItems: ["line-item-id"],
  clientSignature: "string",
  signedDate: "timestamp",
  paymentTerms: "string"
}

// Treatment Protocol Model
{
  protocolId: "auto-generated",
  name: "string",
  condition: "string",
  species: ["dog|cat|exotic"],
  treatments: [{
    category: "string",
    required: "boolean",
    options: [{
      description: "string",
      services: ["service-id"],
      medications: [{
        drug: "string",
        dosage: "string",
        duration: "string"
      }]
    }]
  }],
  notes: "string",
  references: ["string"]
}
```

### Pricing Logic
```javascript
// Dynamic pricing calculation
function calculateEstimate(treatments, patient) {
  let items = [];
  
  treatments.forEach(treatment => {
    const basePrice = getServicePrice(treatment.serviceId);
    const modifiers = calculateModifiers(patient, treatment);
    
    items.push({
      service: treatment,
      price: basePrice,
      range: treatment.requiresSurgery ? 
        { low: basePrice * 0.8, high: basePrice * 1.2 } : 
        { low: basePrice, high: basePrice },
      modifiers: modifiers
    });
  });
  
  return {
    items: items,
    subtotal: sum(items),
    tax: calculateTax(items),
    total: subtotal + tax
  };
}

// Treatment option generation
function generateTreatmentOptions(diagnosis) {
  return {
    conservative: getConservativeApproach(diagnosis),
    standard: getStandardProtocol(diagnosis),
    aggressive: getAggressiveApproach(diagnosis)
  };
}
```

## Success Criteria

- Average treatment plan creation under 3 minutes
- 90% of estimates approved without revision
- Client understanding score above 4.5/5
- Zero calculation errors in estimates
- 95% of plans use protocol templates
- Consent capture compliance at 100%
- Support for complex multi-problem plans

## Risks and Mitigations

### Financial Risks
- **Pricing errors**: Regular price file updates and validation
- **Underestimation**: Built-in ranges for variable procedures
- **Discount misapplication**: Rule-based discount engine with limits

### Clinical Risks
- **Inappropriate treatment selection**: Protocol validation and warnings
- **Missing consent elements**: Required consent checkpoint system
- **Communication failures**: Plain language descriptions and visuals

### Operational Risks
- **Estimate expiration**: Automated reminders and easy renewal
- **Partial approval confusion**: Clear status tracking and documentation
- **Version control issues**: Comprehensive estimate history with changes highlighted

## Future Considerations

- AI-powered treatment recommendations
- Outcome-based pricing models
- Insurance pre-authorization integration
- Video explanation integration
- 3D treatment visualization
- Comparative effectiveness data
- Client financial scoring
- Treatment financing integration
- Outcome tracking and reporting
- Peer review of treatment plans
- Integration with specialist consultations
- Evidence-based medicine links
- Client education video library