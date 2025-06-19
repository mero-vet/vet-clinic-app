# PRD-11: Invoice & Payment Processing

Current Status: IN PROGRESS
Next Action Item: Finalize scope review
Blocking Issues: None

## Key Files and Components

### Core Implementation Files
- `src/screens/InvoiceScreen.jsx`
  - Main invoice interface
  - Payment processing workflow
- `src/context/InvoiceContext.jsx`
  - Invoice state management
  - Calculation engine
- `src/screens/Invoice/InvoiceLineItems.jsx`
  - Line item management
  - Service and product entries
- `src/screens/Invoice/InvoiceTotals.jsx`
  - Total calculations
  - Tax and discount handling
- `src/screens/Invoice/InvoiceActions.jsx`
  - Payment actions
  - Invoice finalization

### Referenced Components
- `src/context/PatientContext.jsx`
  - Patient billing history
  - Account information
- `src/screens/ServicesScreen.jsx`
  - Service charges integration
  - Treatment billing
- `src/screens/PharmacyScreen.jsx`
  - Medication charges
  - Dispensing fees

### New Files to Create
- `src/components/Payment/PaymentProcessor.jsx`
  - Payment method handling
  - Transaction processing
- `src/components/Payment/PaymentReceipt.jsx`
  - Receipt generation
  - Email/print options
- `src/services/PaymentService.js`
  - Payment gateway integration
  - Transaction management
- `src/utils/taxCalculations.js`
  - Tax rule engine
  - Jurisdiction handling
- `src/components/Payment/PaymentPlanManager.jsx`
  - Payment plan setup
  - Installment tracking

## Objective

Deliver a comprehensive invoice and payment system that accurately captures all services, automatically applies appropriate fees and taxes, supports multiple payment methods, and processes transactions securely. The system should reduce checkout time to under 3 minutes while maintaining perfect accuracy in financial transactions and providing flexible payment options for clients.

## Implementation Plan

### Phase 1: Invoice Generation and Management
- [ ] 1.1 Enhance invoice builder
  - Automatic service capture
  - Real-time total updates
  - Line item categorization
  - Dependencies: none
- [ ] 1.2 Implement pricing rules
  - Package pricing logic
  - Multi-pet discounts
  - Loyalty program integration
  - Dependencies: 1.1 must be completed
- [ ] 1.3 Add tax calculations
  - Service vs product tax rates
  - Jurisdiction-based rules
  - Tax exemption handling
  - Dependencies: 1.2 must be completed

### Phase 2: Payment Processing
- [ ] 2.1 Build payment interface
  - Multiple payment methods
  - Split payment support
  - Quick payment buttons
  - Dependencies: Phase 1 completed
- [ ] 2.2 Integrate payment gateways
  - Credit/debit processing
  - ACH/check handling
  - Digital wallet support
  - Dependencies: 2.1 must be completed
- [ ] 2.3 Implement cash handling
  - Cash drawer integration
  - Change calculation
  - Till reconciliation
  - Dependencies: 2.2 must be completed

### Phase 3: Financial Management
- [ ] 3.1 Create payment plans
  - Installment setup
  - Automatic charging
  - Payment reminders
  - Dependencies: Phase 2 completed
- [ ] 3.2 Build receipt system
  - Digital receipt delivery
  - Detailed breakdowns
  - Return/refund tracking
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Add financial reporting
  - Daily reconciliation
  - Payment method analysis
  - Outstanding balance tracking
  - Dependencies: 3.2 must be completed

## Implementation Notes

*Notes will be added as implementation progresses*

## Technical Design

### Data Models
```javascript
// Invoice Model
{
  invoiceId: "auto-generated",
  invoiceNumber: "sequential",
  patientId: "foreign-key",
  clientId: "foreign-key",
  visitId: "foreign-key",
  invoiceDate: "timestamp",
  status: "draft|open|partial|paid|void|refunded",
  lineItems: [{
    lineId: "auto-generated",
    type: "service|product|medication",
    code: "string",
    description: "string",
    quantity: "number",
    unitPrice: "number",
    discount: {
      type: "percentage|fixed",
      value: "number",
      reason: "string"
    },
    tax: {
      rate: "percentage",
      amount: "number"
    },
    total: "number",
    provider: "doctor-id"
  }],
  subtotal: "number",
  discountTotal: "number",
  taxTotal: "number",
  grandTotal: "number",
  balance: "number",
  notes: "string"
}

// Payment Model
{
  paymentId: "auto-generated",
  invoiceId: "foreign-key",
  paymentDate: "timestamp",
  amount: "number",
  method: "cash|check|credit|debit|care-credit|payment-plan",
  status: "pending|completed|failed|refunded",
  transactionDetails: {
    referenceNumber: "string",
    authorizationCode: "string",
    last4: "string",
    cardType: "visa|mastercard|amex|discover",
    checkNumber: "string"
  },
  processedBy: "user-id",
  refundedAmount: "number",
  refundReason: "string"
}

// Payment Plan Model
{
  planId: "auto-generated",
  clientId: "foreign-key",
  invoiceIds: ["invoice-id"],
  totalAmount: "number",
  downPayment: "number",
  numberOfPayments: "number",
  paymentAmount: "number",
  frequency: "weekly|biweekly|monthly",
  startDate: "date",
  status: "active|completed|defaulted|cancelled",
  payments: [{
    scheduledDate: "date",
    amount: "number",
    status: "scheduled|paid|failed|skipped",
    paymentId: "foreign-key"
  }],
  autopay: {
    enabled: "boolean",
    method: "payment-method",
    tokenizedCard: "encrypted-string"
  }
}
```

### Payment Processing
```javascript
// Payment processing flow
async function processPayment(invoice, paymentMethod, amount) {
  // Validate payment amount
  if (amount > invoice.balance) {
    return { error: 'Overpayment not allowed' };
  }
  
  // Process based on method
  let result;
  switch(paymentMethod.type) {
    case 'credit':
      result = await processCreditCard(paymentMethod, amount);
      break;
    case 'cash':
      result = processCash(amount, paymentMethod.tendered);
      break;
    case 'payment-plan':
      result = await setupPaymentPlan(invoice, paymentMethod.terms);
      break;
  }
  
  // Update invoice
  if (result.success) {
    await updateInvoiceBalance(invoice, amount);
    await createPaymentRecord(invoice, result);
  }
  
  return result;
}

// Tax calculation engine
function calculateTax(lineItem, jurisdiction) {
  const taxRules = getTaxRules(jurisdiction);
  let taxRate = 0;
  
  if (lineItem.type === 'service') {
    taxRate = taxRules.serviceRate;
  } else if (lineItem.type === 'product') {
    taxRate = taxRules.productRate;
  } else if (lineItem.type === 'medication') {
    taxRate = taxRules.medicationRate;
  }
  
  // Apply exemptions
  if (lineItem.taxExempt) {
    taxRate = 0;
  }
  
  return {
    rate: taxRate,
    amount: lineItem.total * taxRate
  };
}
```

## Success Criteria

- Average checkout time under 3 minutes
- Payment processing success rate above 99%
- Zero calculation errors in invoices
- Receipt delivery within 30 seconds
- Support for 10+ payment methods
- Daily reconciliation accuracy at 100%
- Payment plan default rate below 5%

## Risks and Mitigations

### Financial Risks
- **Payment failures**: Multiple gateway redundancy and offline mode
- **Calculation errors**: Automated testing and validation rules
- **Fraud attempts**: PCI compliance and fraud detection

### Technical Risks
- **Gateway downtime**: Offline payment queuing with later processing
- **Data synchronization**: Real-time backup and transaction logging
- **Receipt delivery failures**: Multiple delivery methods and retry logic

### Compliance Risks
- **PCI non-compliance**: No local card storage, tokenization only
- **Tax calculation errors**: Regular tax table updates and validation
- **Audit trail gaps**: Comprehensive transaction logging

## Future Considerations

- Cryptocurrency payment acceptance
- International payment processing
- Advanced fraud detection AI
- Instant payment financing options
- Loyalty points as payment method
- Insurance claim integration
- Automated payment reminders
- Client payment portal
- Mobile point-of-sale
- Contactless payment options
- Subscription billing models
- Dynamic pricing based on demand
- Integration with accounting software
- Predictive payment behavior analysis