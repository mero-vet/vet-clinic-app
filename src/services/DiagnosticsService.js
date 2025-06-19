// Diagnostics Service - Manages test ordering, results, and lab integration
class DiagnosticsService {
  constructor() {
    this.testCatalog = [
      // In-House Tests
      {
        id: 'CBC',
        name: 'Complete Blood Count',
        category: 'Hematology',
        type: 'in-house',
        turnaroundTime: '30 minutes',
        sampleType: 'EDTA Blood',
        sampleVolume: '1 mL',
        price: 45.00,
        speciesSpecific: false,
        components: ['RBC', 'WBC', 'HGB', 'HCT', 'Platelets', 'Differential'],
        referenceRanges: {
          canine: {
            RBC: { min: 5.5, max: 8.5, unit: 'M/μL' },
            WBC: { min: 6.0, max: 17.0, unit: 'K/μL' },
            HGB: { min: 12.0, max: 18.0, unit: 'g/dL' },
            HCT: { min: 37, max: 55, unit: '%' },
            Platelets: { min: 200, max: 500, unit: 'K/μL' }
          },
          feline: {
            RBC: { min: 5.0, max: 10.0, unit: 'M/μL' },
            WBC: { min: 5.5, max: 19.5, unit: 'K/μL' },
            HGB: { min: 8.0, max: 15.0, unit: 'g/dL' },
            HCT: { min: 24, max: 45, unit: '%' },
            Platelets: { min: 300, max: 700, unit: 'K/μL' }
          }
        }
      },
      {
        id: 'CHEM',
        name: 'Chemistry Panel',
        category: 'Chemistry',
        type: 'in-house',
        turnaroundTime: '45 minutes',
        sampleType: 'Serum',
        sampleVolume: '1 mL',
        price: 65.00,
        speciesSpecific: false,
        components: ['ALT', 'AST', 'ALP', 'GGT', 'BUN', 'Creatinine', 'Glucose', 'Total Protein', 'Albumin', 'Globulin'],
        aliases: ['Comprehensive Metabolic Panel', 'Blood Chemistry']
      },
      {
        id: 'UA',
        name: 'Urinalysis',
        category: 'Urinalysis',
        type: 'in-house',
        turnaroundTime: '20 minutes',
        sampleType: 'Urine',
        sampleVolume: '5 mL',
        price: 35.00,
        speciesSpecific: false,
        components: ['Color', 'Clarity', 'Specific Gravity', 'pH', 'Protein', 'Glucose', 'Ketones', 'Blood', 'Bilirubin', 'Sediment']
      },
      {
        id: 'FECAL',
        name: 'Fecal Examination',
        category: 'Parasitology',
        type: 'in-house',
        turnaroundTime: '15 minutes',
        sampleType: 'Feces',
        sampleVolume: '1 gram',
        price: 25.00,
        speciesSpecific: false,
        components: ['Direct Smear', 'Float', 'Parasite Identification']
      },
      {
        id: 'HWT',
        name: 'Heartworm Test',
        category: 'Serology',
        type: 'in-house',
        turnaroundTime: '10 minutes',
        sampleType: 'Serum/Plasma',
        sampleVolume: '0.5 mL',
        price: 40.00,
        speciesSpecific: true,
        species: ['canine']
      },
      {
        id: 'FELV_FIV',
        name: 'FeLV/FIV Test',
        category: 'Serology',
        type: 'in-house',
        turnaroundTime: '10 minutes',
        sampleType: 'Serum/Plasma',
        sampleVolume: '0.5 mL',
        price: 45.00,
        speciesSpecific: true,
        species: ['feline']
      },
      // Reference Lab Tests
      {
        id: 'THYROID',
        name: 'Thyroid Panel',
        category: 'Endocrinology',
        type: 'reference',
        turnaroundTime: '2-3 days',
        sampleType: 'Serum',
        sampleVolume: '1 mL',
        price: 85.00,
        speciesSpecific: false,
        components: ['T4', 'Free T4', 'TSH'],
        referenceLabCode: 'ENDO-THY'
      },
      {
        id: 'CUSHINGS',
        name: 'Cushings Disease Panel',
        category: 'Endocrinology',
        type: 'reference',
        turnaroundTime: '2-3 days',
        sampleType: 'Serum',
        sampleVolume: '2 mL',
        price: 120.00,
        speciesSpecific: false,
        components: ['Cortisol (baseline)', 'ACTH Stimulation', 'Dexamethasone Suppression'],
        referenceLabCode: 'ENDO-CUSH'
      },
      {
        id: 'CULTURE',
        name: 'Culture & Sensitivity',
        category: 'Microbiology',
        type: 'reference',
        turnaroundTime: '3-5 days',
        sampleType: 'Various',
        sampleVolume: 'Varies',
        price: 95.00,
        speciesSpecific: false,
        subtypes: ['Urine', 'Skin', 'Ear', 'Wound', 'Blood'],
        referenceLabCode: 'MICRO-CS'
      },
      {
        id: 'HISTOPATH',
        name: 'Histopathology',
        category: 'Pathology',
        type: 'reference',
        turnaroundTime: '5-7 days',
        sampleType: 'Tissue/Biopsy',
        sampleVolume: 'Varies',
        price: 150.00,
        speciesSpecific: false,
        referenceLabCode: 'PATH-HISTO'
      }
    ];

    this.diagnosticPanels = [
      {
        id: 'WELLNESS-CANINE',
        name: 'Canine Wellness Panel',
        species: 'canine',
        age: 'adult',
        tests: ['CBC', 'CHEM', 'UA', 'HWT', 'FECAL'],
        price: 180.00,
        discount: 10
      },
      {
        id: 'WELLNESS-FELINE',
        name: 'Feline Wellness Panel',
        species: 'feline',
        age: 'adult',
        tests: ['CBC', 'CHEM', 'UA', 'FELV_FIV', 'FECAL'],
        price: 185.00,
        discount: 10
      },
      {
        id: 'SENIOR-CANINE',
        name: 'Senior Canine Panel',
        species: 'canine',
        age: 'senior',
        tests: ['CBC', 'CHEM', 'UA', 'THYROID', 'HWT'],
        price: 240.00,
        discount: 15
      },
      {
        id: 'SENIOR-FELINE',
        name: 'Senior Feline Panel',
        species: 'feline',
        age: 'senior',
        tests: ['CBC', 'CHEM', 'UA', 'THYROID', 'FELV_FIV'],
        price: 245.00,
        discount: 15
      },
      {
        id: 'PREANESTHETIC',
        name: 'Pre-Anesthetic Panel',
        species: 'all',
        tests: ['CBC', 'CHEM'],
        price: 95.00,
        discount: 5
      }
    ];

    this.activeOrders = [];
    this.orderResults = [];
  }

  // Search tests by name or alias
  searchTests(query) {
    const lowerQuery = query.toLowerCase();
    return this.testCatalog.filter(test => 
      test.name.toLowerCase().includes(lowerQuery) ||
      test.category.toLowerCase().includes(lowerQuery) ||
      (test.aliases && test.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)))
    );
  }

  // Get tests by category
  getTestsByCategory(category) {
    return this.testCatalog.filter(test => test.category === category);
  }

  // Get available panels for species/age
  getRecommendedPanels(species, age) {
    return this.diagnosticPanels.filter(panel => 
      (panel.species === species || panel.species === 'all') &&
      (!panel.age || panel.age === age)
    );
  }

  // Create diagnostic order
  createOrder(patientId, doctorId, tests, priority = 'routine') {
    const order = {
      id: `ORDER_${Date.now()}`,
      patientId,
      doctorId,
      orderDate: new Date().toISOString(),
      priority,
      status: 'pending',
      tests: tests.map(testId => {
        const test = this.testCatalog.find(t => t.id === testId);
        return {
          testId,
          name: test.name,
          type: test.type,
          status: 'ordered',
          sampleCollected: false,
          sampleCollectionTime: null,
          resultTime: null,
          result: null
        };
      }),
      totalCost: this.calculateOrderCost(tests),
      requisitionGenerated: false,
      labRequisitionNumber: null
    };

    this.activeOrders.push(order);
    return order;
  }

  // Calculate order cost
  calculateOrderCost(testIds) {
    return testIds.reduce((total, testId) => {
      const test = this.testCatalog.find(t => t.id === testId);
      return total + (test ? test.price : 0);
    }, 0);
  }

  // Mark sample as collected
  markSampleCollected(orderId, testId) {
    const order = this.activeOrders.find(o => o.id === orderId);
    if (!order) return false;

    const test = order.tests.find(t => t.testId === testId);
    if (!test) return false;

    test.sampleCollected = true;
    test.sampleCollectionTime = new Date().toISOString();
    test.status = 'in-progress';

    // Update order status
    const allCollected = order.tests.every(t => t.sampleCollected);
    if (allCollected) {
      order.status = 'samples-collected';
    }

    return true;
  }

  // Generate lab requisition
  generateRequisition(orderId) {
    const order = this.activeOrders.find(o => o.id === orderId);
    if (!order) return null;

    const referenceTests = order.tests.filter(t => {
      const test = this.testCatalog.find(tc => tc.id === t.testId);
      return test && test.type === 'reference';
    });

    if (referenceTests.length > 0) {
      order.labRequisitionNumber = `REQ-${Date.now()}`;
      order.requisitionGenerated = true;
      
      return {
        requisitionNumber: order.labRequisitionNumber,
        tests: referenceTests,
        generatedAt: new Date().toISOString()
      };
    }

    return null;
  }

  // Add test result
  addResult(orderId, testId, resultData) {
    const order = this.activeOrders.find(o => o.id === orderId);
    if (!order) return false;

    const test = order.tests.find(t => t.testId === testId);
    if (!test) return false;

    test.result = resultData;
    test.resultTime = new Date().toISOString();
    test.status = 'completed';

    // Check for critical values
    const criticalFlags = this.checkCriticalValues(testId, resultData);
    if (criticalFlags.length > 0) {
      test.criticalValues = criticalFlags;
      // In real app, trigger alert system
    }

    // Update order status
    const allComplete = order.tests.every(t => t.status === 'completed');
    if (allComplete) {
      order.status = 'completed';
      order.completedAt = new Date().toISOString();
    }

    return true;
  }

  // Check for critical values
  checkCriticalValues(testId, resultData) {
    const criticalFlags = [];
    const test = this.testCatalog.find(t => t.id === testId);
    
    if (!test || !test.referenceRanges || !resultData.values) {
      return criticalFlags;
    }

    // Check each component against reference ranges
    Object.entries(resultData.values).forEach(([component, value]) => {
      const ranges = test.referenceRanges[resultData.species]?.[component];
      if (ranges && typeof value === 'number') {
        if (value < ranges.min || value > ranges.max) {
          criticalFlags.push({
            component,
            value,
            range: `${ranges.min}-${ranges.max} ${ranges.unit}`,
            flag: value < ranges.min ? 'LOW' : 'HIGH'
          });
        }
      }
    });

    return criticalFlags;
  }

  // Get pending orders for patient
  getPatientOrders(patientId) {
    return this.activeOrders.filter(order => order.patientId === patientId);
  }

  // Get order by ID
  getOrder(orderId) {
    return this.activeOrders.find(order => order.id === orderId);
  }

  // Cancel order
  cancelOrder(orderId, reason) {
    const order = this.activeOrders.find(o => o.id === orderId);
    if (!order || order.status === 'completed') return false;

    order.status = 'cancelled';
    order.cancelledAt = new Date().toISOString();
    order.cancellationReason = reason;
    return true;
  }

  // Get test catalog
  getTestCatalog() {
    return this.testCatalog;
  }

  // Get categories
  getCategories() {
    return [...new Set(this.testCatalog.map(test => test.category))];
  }

  // Sample collection guide
  getSampleCollectionGuide(testId) {
    const test = this.testCatalog.find(t => t.id === testId);
    if (!test) return null;

    return {
      testName: test.name,
      sampleType: test.sampleType,
      volume: test.sampleVolume,
      handling: this.getSampleHandlingInstructions(test.sampleType),
      storage: this.getSampleStorageRequirements(test.sampleType)
    };
  }

  // Sample handling instructions
  getSampleHandlingInstructions(sampleType) {
    const instructions = {
      'EDTA Blood': 'Gently invert tube 8-10 times. Do not shake.',
      'Serum': 'Allow to clot for 30 minutes, then centrifuge.',
      'Urine': 'Collect mid-stream sample in sterile container.',
      'Feces': 'Fresh sample preferred, store at 4°C if delayed.',
      'Tissue/Biopsy': 'Place in formalin immediately.'
    };
    return instructions[sampleType] || 'Handle according to standard protocols.';
  }

  // Sample storage requirements
  getSampleStorageRequirements(sampleType) {
    const storage = {
      'EDTA Blood': 'Room temperature for up to 24 hours',
      'Serum': 'Refrigerate at 2-8°C for up to 48 hours',
      'Urine': 'Refrigerate immediately, analyze within 4 hours',
      'Feces': 'Refrigerate if not analyzed immediately',
      'Tissue/Biopsy': 'Room temperature in formalin'
    };
    return storage[sampleType] || 'Follow standard storage protocols.';
  }
}

export default new DiagnosticsService();