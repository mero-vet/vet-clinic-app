# PRD-10: Pharmacy Dispensing

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/screens/PharmacyScreen.jsx`
  - Main pharmacy interface
  - Prescription management
- `src/context/PharmacyContext.jsx`
  - Pharmacy state management
  - Inventory tracking
- `src/screens/Services/VaccineOrderForm.jsx`
  - Vaccine administration interface
  - Schedule management

### Referenced Components
- `src/context/PatientContext.jsx`
  - Patient medication history
  - Allergy information
- `src/context/MedicalRecordsContext.jsx`
  - Prescription documentation
  - Treatment plan integration
- `src/context/InvoiceContext.jsx`
  - Billing for medications
  - Dispensing fee calculation

### New Files to Create
- `src/components/Pharmacy/PrescriptionForm.jsx`
  - Comprehensive prescription entry
  - Dosage calculations
- `src/components/Pharmacy/DrugInteractionChecker.jsx`
  - Interaction screening
  - Allergy alerts
- `src/components/Pharmacy/LabelPrinter.jsx`
  - Prescription label generation
  - Client instructions
- `src/services/PharmacyService.js`
  - Dispensing logic
  - Inventory management
- `src/utils/drugDatabase.js`
  - Medication reference data
  - Dosing calculators

## Objective

Create an efficient pharmacy dispensing system that ensures medication safety while streamlining the prescription process from order to dispensing. The system should automatically calculate dosages, check for interactions, generate compliant labels, track inventory, and provide clear client instructions, reducing dispensing time by 60% while maintaining zero dispensing errors.

## Implementation Plan

### Phase 1: Prescription Management
- [ ] 1.1 Build prescription entry form
  - Drug search with formulary
  - Automatic dosage calculation
  - Sig generation assistance
  - Dependencies: none
- [ ] 1.2 Implement safety checks
  - Drug-drug interactions
  - Allergy screening
  - Dose range validation
  - Dependencies: 1.1 must be completed
- [ ] 1.3 Create refill management
  - Refill authorization
  - Automatic refill reminders
  - Prescription expiration tracking
  - Dependencies: 1.2 must be completed

### Phase 2: Dispensing Workflow
- [ ] 2.1 Build dispensing interface
  - Prescription queue management
  - Verification workflow
  - Quantity dispensed tracking
  - Dependencies: Phase 1 completed
- [ ] 2.2 Implement label generation
  - Compliant label formatting
  - Client instruction sheets
  - Multi-language support
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Add inventory integration
  - Real-time stock checking
  - Automatic reorder alerts
  - Lot number tracking
  - Dependencies: 2.2 must be completed

### Phase 3: Compliance and Reporting
- [ ] 3.1 Create controlled substance management
  - DEA compliance tracking
  - Prescription monitoring integration
  - Audit trail maintenance
  - Dependencies: Phase 2 completed
- [ ] 3.2 Build reporting system
  - Dispensing reports
  - Inventory reconciliation
  - Compliance reporting
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Implement client communication
  - Medication reminders
  - Refill notifications
  - Educational materials
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Prescription Model
{
  prescriptionId: "auto-generated",
  patientId: "foreign-key",
  prescriberId: "doctor-id",
  visitId: "foreign-key",
  prescriptionDate: "timestamp",
  status: "active|filled|partial|cancelled|expired",
  medication: {
    drugId: "string",
    name: "string",
    strength: "string",
    form: "tablet|capsule|liquid|injection|other",
    ndcNumber: "string",
    isControlled: "boolean",
    schedule: "II|III|IV|V|none"
  },
  dosing: {
    dose: "number",
    unit: "mg|ml|tablet|etc",
    route: "PO|IM|SQ|IV|topical|other",
    frequency: "SID|BID|TID|QID|PRN|other",
    duration: "days",
    totalQuantity: "number",
    refills: "number",
    refillsRemaining: "number"
  },
  sig: "string",
  notes: "string",
  substitutionAllowed: "boolean",
  interactions: [{
    severity: "major|moderate|minor",
    description: "string"
  }]
}

// Dispensing Record Model
{
  dispensingId: "auto-generated",
  prescriptionId: "foreign-key",
  dispensedBy: "user-id",
  dispensedDate: "timestamp",
  quantityDispensed: "number",
  lotNumber: "string",
  expirationDate: "date",
  verifiedBy: "user-id",
  labelPrinted: "boolean",
  clientEducation: "provided|declined",
  notes: "string"
}

// Drug Inventory Model
{
  inventoryId: "auto-generated",
  drugId: "string",
  lotNumber: "string",
  expirationDate: "date",
  quantityOnHand: "number",
  reorderLevel: "number",
  reorderQuantity: "number",
  unitCost: "number",
  location: "string",
  lastUpdated: "timestamp",
  transactions: [{
    type: "received|dispensed|adjusted|expired",
    quantity: "number",
    date: "timestamp",
    user: "user-id",
    reference: "string"
  }]
}
```

### Safety Algorithms
```javascript
// Dosage calculation
function calculateDose(patient, drug, indication) {
  const weight = patient.weight;
  const species = patient.species;
  const dosageRange = getDosageRange(drug, species, indication);
  
  return {
    recommended: weight * dosageRange.typical,
    min: weight * dosageRange.min,
    max: weight * dosageRange.max,
    unit: dosageRange.unit,
    frequency: dosageRange.frequency
  };
}

// Interaction checking
function checkInteractions(newDrug, currentMedications) {
  const interactions = [];
  
  currentMedications.forEach(med => {
    const interaction = drugDatabase.checkInteraction(newDrug, med);
    if (interaction) {
      interactions.push({
        drug: med.name,
        severity: interaction.severity,
        effect: interaction.effect,
        recommendation: interaction.recommendation
      });
    }
  });
  
  return interactions;
}
```

### Label Generation
```javascript
// Prescription label format
function generateLabel(prescription, patient, client) {
  return {
    header: {
      clinicName: clinic.name,
      clinicPhone: clinic.phone,
      prescriptionNumber: prescription.id,
      date: prescription.dispensedDate
    },
    patient: {
      name: patient.name,
      species: patient.species,
      weight: patient.weight
    },
    client: {
      name: client.fullName,
      phone: client.phone
    },
    medication: {
      name: prescription.medication.name,
      strength: prescription.medication.strength,
      quantity: prescription.quantityDispensed,
      sig: prescription.sig
    },
    warnings: getWarnings(prescription.medication),
    prescriber: prescription.prescriber,
    refills: prescription.refillsRemaining,
    expiration: calculateExpiration(prescription),
    barcode: generateBarcode(prescription.id)
  };
}
```

## Success Criteria

- Average prescription processing time under 2 minutes
- Zero dispensing errors (wrong drug, dose, or patient)
- 100% interaction checking compliance
- Inventory accuracy above 99%
- DEA audit compliance at 100%
- Label printing success rate above 99%
- Client satisfaction with instructions above 4.7/5

## Risks and Mitigations

### Safety Risks
- **Medication errors**: Multiple verification steps and barcode scanning
- **Interaction misses**: Comprehensive drug database with regular updates
- **Dosing errors**: Automated calculations with range validation

### Regulatory Risks
- **DEA non-compliance**: Automated tracking and reporting systems
- **State board violations**: Configurable compliance rules by jurisdiction
- **Record keeping failures**: Comprehensive audit trails with backup

### Operational Risks
- **Inventory discrepancies**: Cycle counting and perpetual inventory
- **Label printer failures**: Backup printing options and PDF generation
- **Drug database outdated**: Automated updates and version control

## Future Considerations

- Automated dispensing cabinet integration
- Compounding formula management
- Telepharmacy capabilities
- Client mobile app for refills
- Smart pill bottle integration
- Medication synchronization programs
- Therapeutic drug monitoring
- Pharmacogenomics integration
- Online pharmacy integration
- Automated prior authorization
- Clinical pharmacy services
- Medication therapy management
- Integration with human pharmacies