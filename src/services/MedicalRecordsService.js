// Medical Records Service - Manages SOAP notes, templates, and medical history
class MedicalRecordsService {
  constructor() {
    this.examTemplates = [
      {
        id: 'wellness-canine',
        name: 'Canine Wellness Exam',
        species: 'canine',
        variables: {
          weight: '',
          temperature: '',
          heartRate: '',
          respiratoryRate: '',
          bcs: '',
        },
        sections: {
          subjective: 'Patient presents for annual wellness exam. Owner reports {ownerConcerns}. Appetite: {appetite}, Water intake: {waterIntake}, BM/Urination: Normal',
          objective: 'T: {temperature}°F, HR: {heartRate} bpm, RR: {respiratoryRate} brpm, Weight: {weight} lbs, BCS: {bcs}/9\nPhysical Exam:\n- General: BAR, well-hydrated\n- EENT: Clear eyes, clean ears, no nasal discharge\n- Cardiovascular: NSR, no murmurs\n- Respiratory: Clear lung sounds bilaterally\n- GI: Soft, non-painful abdomen\n- MS: Normal gait, no lameness\n- Skin: No lesions noted\n- LN: No lymphadenopathy',
          assessment: 'Healthy adult canine presenting for routine wellness exam',
          plan: '1. Update vaccinations as needed\n2. Recommend annual bloodwork\n3. Continue current diet\n4. Recheck in 1 year'
        }
      },
      {
        id: 'wellness-feline',
        name: 'Feline Wellness Exam',
        species: 'feline',
        variables: {
          weight: '',
          temperature: '',
          heartRate: '',
          respiratoryRate: '',
          bcs: '',
        },
        sections: {
          subjective: 'Patient presents for annual wellness exam. Owner reports {ownerConcerns}. Appetite: {appetite}, Water intake: {waterIntake}, Litter box habits: Normal',
          objective: 'T: {temperature}°F, HR: {heartRate} bpm, RR: {respiratoryRate} brpm, Weight: {weight} lbs, BCS: {bcs}/9\nPhysical Exam:\n- General: QAR, well-hydrated\n- EENT: Clear eyes, clean ears, no nasal discharge\n- Cardiovascular: NSR, no murmurs\n- Respiratory: Clear lung sounds bilaterally\n- GI: Soft, non-painful abdomen\n- MS: Normal gait\n- Skin: No lesions noted\n- Oral: Mild tartar accumulation',
          assessment: 'Healthy adult feline presenting for routine wellness exam',
          plan: '1. Update vaccinations as needed\n2. Recommend annual bloodwork and urinalysis\n3. Dental cleaning recommended\n4. Recheck in 1 year'
        }
      },
      {
        id: 'sick-visit',
        name: 'Sick Visit Template',
        species: 'all',
        variables: {
          chiefComplaint: '',
          duration: '',
          symptoms: '',
        },
        sections: {
          subjective: 'Patient presents for {chiefComplaint}. Duration: {duration}. Associated symptoms: {symptoms}',
          objective: 'Physical exam findings...',
          assessment: 'Differential diagnoses: ',
          plan: 'Diagnostic and treatment plan...'
        }
      }
    ];

    this.abbreviations = {
      'BAR': 'Bright, Alert, and Responsive',
      'QAR': 'Quiet, Alert, and Responsive',
      'NSR': 'Normal Sinus Rhythm',
      'BCS': 'Body Condition Score',
      'EENT': 'Eyes, Ears, Nose, Throat',
      'HR': 'Heart Rate',
      'RR': 'Respiratory Rate',
      'T': 'Temperature',
      'bpm': 'beats per minute',
      'brpm': 'breaths per minute',
      'LN': 'Lymph Nodes',
      'MS': 'Musculoskeletal',
      'GI': 'Gastrointestinal'
    };

    this.physicalExamSystems = [
      {
        system: 'General Appearance',
        normalFindings: ['BAR', 'QAR', 'Well-hydrated', 'Normal mentation'],
        abnormalFindings: ['Lethargic', 'Depressed', 'Dehydrated', 'Painful']
      },
      {
        system: 'EENT',
        normalFindings: ['Clear eyes', 'Clean ears', 'No nasal discharge', 'Normal oral exam'],
        abnormalFindings: ['Ocular discharge', 'Ear infection', 'Nasal discharge', 'Dental disease']
      },
      {
        system: 'Cardiovascular',
        normalFindings: ['NSR', 'No murmurs', 'Strong pulses', 'Normal CRT'],
        abnormalFindings: ['Murmur', 'Arrhythmia', 'Weak pulses', 'Prolonged CRT']
      },
      {
        system: 'Respiratory',
        normalFindings: ['Clear lung sounds', 'Normal respiratory effort'],
        abnormalFindings: ['Crackles', 'Wheezes', 'Increased effort', 'Coughing']
      },
      {
        system: 'Gastrointestinal',
        normalFindings: ['Soft abdomen', 'No organomegaly', 'Normal bowel sounds'],
        abnormalFindings: ['Painful abdomen', 'Mass palpated', 'Decreased bowel sounds']
      },
      {
        system: 'Musculoskeletal',
        normalFindings: ['Normal gait', 'No lameness', 'Normal muscle mass'],
        abnormalFindings: ['Lameness', 'Joint effusion', 'Muscle atrophy', 'Pain on palpation']
      },
      {
        system: 'Integument',
        normalFindings: ['No lesions', 'Normal coat', 'No parasites'],
        abnormalFindings: ['Alopecia', 'Pruritus', 'Mass', 'Fleas present']
      },
      {
        system: 'Neurologic',
        normalFindings: ['Normal mentation', 'Normal gait', 'Normal reflexes'],
        abnormalFindings: ['Ataxia', 'Seizures', 'Decreased reflexes', 'Head tilt']
      }
    ];

    this.currentExam = null;
    this.autoSaveInterval = null;
  }

  // Start a new exam
  startNewExam(patientId, visitType = 'wellness') {
    this.currentExam = {
      id: `exam_${Date.now()}`,
      patientId,
      visitType,
      startTime: new Date().toISOString(),
      status: 'in_progress',
      soap: {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
      },
      vitalSigns: {},
      physicalExam: {},
      problemList: [],
      attachments: [],
      lastAutoSave: null
    };

    // Start auto-save
    this.startAutoSave();
    return this.currentExam;
  }

  // Load exam template
  loadTemplate(templateId) {
    const template = this.examTemplates.find(t => t.id === templateId);
    if (!template) return null;

    if (this.currentExam) {
      // Apply template to current exam
      this.currentExam.soap = { ...template.sections };
      this.currentExam.templateUsed = templateId;
    }

    return template;
  }

  // Update SOAP section
  updateSOAPSection(section, content) {
    if (!this.currentExam || !['subjective', 'objective', 'assessment', 'plan'].includes(section)) {
      return false;
    }

    this.currentExam.soap[section] = content;
    this.currentExam.lastModified = new Date().toISOString();
    return true;
  }

  // Record vital signs
  recordVitalSigns(vitals) {
    if (!this.currentExam) return false;

    this.currentExam.vitalSigns = {
      ...this.currentExam.vitalSigns,
      ...vitals,
      recordedAt: new Date().toISOString()
    };
    return true;
  }

  // Record physical exam findings
  recordPhysicalExam(system, findings) {
    if (!this.currentExam) return false;

    this.currentExam.physicalExam[system] = {
      findings,
      recordedAt: new Date().toISOString()
    };
    return true;
  }

  // Add problem to problem list
  addProblem(problem) {
    if (!this.currentExam) return false;

    this.currentExam.problemList.push({
      id: `problem_${Date.now()}`,
      description: problem.description,
      status: problem.status || 'active',
      priority: problem.priority || 'medium',
      addedAt: new Date().toISOString()
    });
    return true;
  }

  // Expand abbreviation
  expandAbbreviation(text) {
    let expandedText = text;
    Object.entries(this.abbreviations).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'g');
      expandedText = expandedText.replace(regex, `${abbr} (${full})`);
    });
    return expandedText;
  }

  // Auto-save functionality
  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (this.currentExam) {
        this.saveExam();
      }
    }, 30000); // Every 30 seconds
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // Save exam
  saveExam() {
    if (!this.currentExam) return false;

    this.currentExam.lastAutoSave = new Date().toISOString();
    
    // In real app, this would save to backend
    const savedExams = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    const existingIndex = savedExams.findIndex(e => e.id === this.currentExam.id);
    
    if (existingIndex >= 0) {
      savedExams[existingIndex] = this.currentExam;
    } else {
      savedExams.push(this.currentExam);
    }
    
    localStorage.setItem('medicalRecords', JSON.stringify(savedExams));
    return true;
  }

  // Finalize exam
  finalizeExam() {
    if (!this.currentExam) return false;

    this.currentExam.status = 'finalized';
    this.currentExam.finalizedAt = new Date().toISOString();
    this.saveExam();
    this.stopAutoSave();
    
    const finalizedExam = { ...this.currentExam };
    this.currentExam = null;
    return finalizedExam;
  }

  // Get patient's medical history
  getPatientHistory(patientId) {
    const allRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    return allRecords
      .filter(record => record.patientId === patientId)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }

  // Copy previous exam
  copyPreviousExam(examId) {
    const allRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    const previousExam = allRecords.find(e => e.id === examId);
    
    if (!previousExam || !this.currentExam) return false;

    // Copy relevant sections
    this.currentExam.soap = { ...previousExam.soap };
    this.currentExam.copiedFrom = examId;
    return true;
  }

  // Get templates for species
  getTemplatesForSpecies(species) {
    return this.examTemplates.filter(
      t => t.species === species || t.species === 'all'
    );
  }

  // Apply template variables
  applyTemplateVariables(template, variables) {
    const result = { ...template.sections };
    
    Object.entries(result).forEach(([section, content]) => {
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, 'g');
        result[section] = result[section].replace(regex, value);
      });
    });
    
    return result;
  }
}

export default new MedicalRecordsService();