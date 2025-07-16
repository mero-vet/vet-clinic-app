export const heartAttackScenario = {
  id: 'emergency-heart-attack',
  title: 'Canine Heart Attack Emergency',
  description: 'A 10-year-old Golden Retriever arrives with acute cardiac distress',
  difficulty: 'hard',
  category: 'emergency',
  tags: ['cardiac', 'critical', 'time-sensitive'],
  initialPhase: 'arrival',
  initialVariables: {
    heartRate: 180,
    breathingRate: 40,
    bloodPressure: 'low',
    consciousness: 'semi-conscious',
    oxygenLevel: 85,
    timeElapsed: 0,
    criticalWindow: 300000, // 5 minutes
    treatmentStarted: false,
    stabilized: false
  },
  phases: {
    arrival: {
      description: 'Patient arrives in critical cardiac distress',
      onEnter: [
        {
          type: 'emit',
          event: 'emergency:alert',
          data: { severity: 'critical', type: 'cardiac' }
        },
        {
          type: 'startTimer',
          name: 'critical-deterioration',
          duration: 60000,
          callback: [
            {
              type: 'setVariable',
              name: 'consciousness',
              value: 'unconscious'
            }
          ]
        }
      ],
      transitions: [
        {
          to: 'triage',
          label: 'Rush to Triage',
          description: 'Immediately move patient to triage'
        },
        {
          to: 'direct-treatment',
          label: 'Skip Triage - Direct to Treatment',
          description: 'Bypass triage for immediate treatment'
        }
      ]
    },
    triage: {
      description: 'Quick assessment of vital signs',
      onEnter: [
        {
          type: 'setVariable',
          name: 'timeElapsed',
          value: 30000
        }
      ],
      transitions: [
        {
          to: 'treatment-room',
          label: 'Move to Treatment',
          description: 'Patient assessed, move to treatment'
        },
        {
          to: 'deterioration',
          condition: {
            type: 'variable',
            variable: 'consciousness',
            operator: '==',
            value: 'unconscious'
          }
        }
      ]
    },
    'direct-treatment': {
      description: 'Bypassed triage for immediate care',
      onEnter: [
        {
          type: 'setVariable',
          name: 'treatmentStarted',
          value: true
        },
        {
          type: 'stopTimer',
          name: 'critical-deterioration'
        }
      ],
      transitions: [
        {
          to: 'stabilization',
          label: 'Begin Stabilization',
          description: 'Start cardiac stabilization protocol'
        }
      ]
    },
    'treatment-room': {
      description: 'In treatment room, ready for intervention',
      transitions: [
        {
          to: 'oxygen-therapy',
          label: 'Start Oxygen Therapy',
          description: 'Administer high-flow oxygen'
        },
        {
          to: 'medication',
          label: 'Administer Cardiac Medication',
          description: 'Give emergency cardiac drugs'
        },
        {
          to: 'ecg-monitoring',
          label: 'Connect ECG Monitor',
          description: 'Start continuous cardiac monitoring'
        }
      ]
    },
    'oxygen-therapy': {
      description: 'Administering oxygen therapy',
      onEnter: [
        {
          type: 'setVariable',
          name: 'oxygenLevel',
          value: 92
        }
      ],
      transitions: [
        {
          to: 'medication',
          label: 'Proceed to Medication',
          description: 'Oxygen started, now give medication'
        }
      ]
    },
    medication: {
      description: 'Administering cardiac medication',
      onEnter: [
        {
          type: 'setVariable',
          name: 'heartRate',
          value: 140
        },
        {
          type: 'setVariable',
          name: 'treatmentStarted',
          value: true
        }
      ],
      transitions: [
        {
          to: 'ecg-monitoring',
          label: 'Set up Monitoring',
          description: 'Connect continuous monitoring'
        },
        {
          to: 'stabilization',
          label: 'Check Stabilization',
          condition: {
            type: 'and',
            conditions: [
              {
                type: 'variable',
                variable: 'heartRate',
                operator: '<',
                value: 150
              },
              {
                type: 'variable',
                variable: 'oxygenLevel',
                operator: '>',
                value: 90
              }
            ]
          }
        }
      ]
    },
    'ecg-monitoring': {
      description: 'Continuous ECG monitoring active',
      transitions: [
        {
          to: 'stabilization',
          label: 'Patient Stabilizing',
          description: 'Vital signs improving'
        },
        {
          to: 'deterioration',
          label: 'Patient Deteriorating',
          condition: {
            type: 'variable',
            variable: 'heartRate',
            operator: '>',
            value: 200
          }
        }
      ]
    },
    stabilization: {
      description: 'Patient showing signs of stabilization',
      onEnter: [
        {
          type: 'setVariable',
          name: 'stabilized',
          value: true
        },
        {
          type: 'setVariable',
          name: 'heartRate',
          value: 120
        },
        {
          type: 'setVariable',
          name: 'bloodPressure',
          value: 'normal'
        }
      ],
      transitions: [
        {
          to: 'observation',
          label: 'Move to Observation',
          description: 'Continue monitoring in ICU'
        },
        {
          to: 'owner-update',
          label: 'Update Owner',
          description: 'Inform owner of stable condition'
        }
      ]
    },
    deterioration: {
      description: 'Patient condition worsening',
      onEnter: [
        {
          type: 'emit',
          event: 'emergency:critical',
          data: { code: 'red' }
        }
      ],
      transitions: [
        {
          to: 'cpr',
          label: 'Start CPR',
          description: 'Begin cardiopulmonary resuscitation'
        },
        {
          to: 'advanced-life-support',
          label: 'Advanced Life Support',
          description: 'Initiate advanced protocols'
        }
      ]
    },
    cpr: {
      description: 'Performing CPR',
      transitions: [
        {
          to: 'recovery',
          label: 'Patient Responding',
          description: 'Signs of recovery'
        },
        {
          to: 'critical-decision',
          label: 'No Response',
          description: 'Patient not responding to CPR'
        }
      ]
    },
    observation: {
      description: 'Patient in ICU for observation',
      transitions: [
        {
          to: 'recovery',
          label: 'Patient Stable',
          description: 'Ready for recovery phase'
        }
      ]
    },
    'owner-update': {
      description: 'Updating owner on patient status',
      transitions: [
        {
          to: 'observation',
          label: 'Return to Patient',
          description: 'Continue patient care'
        }
      ]
    },
    recovery: {
      description: 'Patient in recovery',
      isEnd: true
    },
    'critical-decision': {
      description: 'Critical decision point',
      isEnd: true
    },
    'advanced-life-support': {
      description: 'Advanced interventions',
      transitions: [
        {
          to: 'recovery',
          label: 'Patient Stabilized'
        },
        {
          to: 'critical-decision',
          label: 'Continue Efforts'
        }
      ]
    }
  },
  events: [
    {
      id: 'vitals-deterioration',
      type: 'timed',
      delay: 120000,
      repeatable: false,
      condition: {
        type: 'variable',
        variable: 'treatmentStarted',
        operator: '==',
        value: false
      },
      actions: [
        {
          type: 'setVariable',
          name: 'heartRate',
          value: 220
        },
        {
          type: 'emit',
          event: 'patient:critical',
          data: { reason: 'delayed treatment' }
        }
      ]
    },
    {
      id: 'medication-effect',
      type: 'conditional',
      condition: {
        type: 'and',
        conditions: [
          {
            type: 'variable',
            variable: 'treatmentStarted',
            operator: '==',
            value: true
          },
          {
            type: 'time',
            elapsed: 60000
          }
        ]
      },
      actions: [
        {
          type: 'setVariable',
          name: 'heartRate',
          value: 110
        },
        {
          type: 'setVariable',
          name: 'oxygenLevel',
          value: 95
        }
      ]
    }
  ],
  optimalPath: ['arrival', 'direct-treatment', 'stabilization', 'observation', 'recovery']
};

export const poisoningScenario = {
  id: 'emergency-poisoning',
  title: 'Toxic Substance Ingestion',
  description: 'A young Labrador has ingested chocolate and is showing symptoms',
  difficulty: 'medium',
  category: 'emergency',
  tags: ['toxicology', 'time-sensitive', 'gastric'],
  initialPhase: 'arrival',
  initialVariables: {
    substanceIdentified: false,
    amountIngested: 'unknown',
    timesSinceIngestion: 'unknown',
    vomitingInduced: false,
    activatedCharcoalGiven: false,
    ivFluidStarted: false,
    symptoms: ['vomiting', 'restlessness', 'elevated heart rate']
  },
  phases: {
    arrival: {
      description: 'Owner arrives with pet showing signs of poisoning',
      transitions: [
        {
          to: 'history-taking',
          label: 'Take History',
          description: 'Get details from owner'
        },
        {
          to: 'immediate-assessment',
          label: 'Immediate Assessment',
          description: 'Skip to physical exam'
        }
      ]
    },
    'history-taking': {
      description: 'Gathering information about ingestion',
      onEnter: [
        {
          type: 'setVariable',
          name: 'substanceIdentified',
          value: true
        },
        {
          type: 'setVariable',
          name: 'amountIngested',
          value: '200g dark chocolate'
        },
        {
          type: 'setVariable',
          name: 'timeSinceIngestion',
          value: '2 hours'
        }
      ],
      transitions: [
        {
          to: 'toxicity-calculation',
          label: 'Calculate Toxicity',
          description: 'Determine severity level'
        }
      ]
    },
    'immediate-assessment': {
      description: 'Physical examination without full history',
      transitions: [
        {
          to: 'supportive-care',
          label: 'Start Supportive Care',
          description: 'Begin treatment without knowing substance'
        },
        {
          to: 'diagnostic-tests',
          label: 'Run Diagnostics',
          description: 'Blood work and other tests'
        }
      ]
    },
    'toxicity-calculation': {
      description: 'Calculating toxic dose based on weight',
      transitions: [
        {
          to: 'decontamination',
          label: 'Proceed to Decontamination',
          description: 'Within timeframe for decontamination'
        },
        {
          to: 'supportive-care',
          label: 'Supportive Care Only',
          description: 'Too late for decontamination'
        }
      ]
    },
    decontamination: {
      description: 'Decontamination procedures',
      transitions: [
        {
          to: 'induce-vomiting',
          label: 'Induce Vomiting',
          description: 'Give emetic medication'
        },
        {
          to: 'activated-charcoal',
          label: 'Skip to Activated Charcoal',
          description: 'Contraindicated for emesis'
        }
      ]
    },
    'induce-vomiting': {
      description: 'Administering emetic',
      onEnter: [
        {
          type: 'setVariable',
          name: 'vomitingInduced',
          value: true
        }
      ],
      transitions: [
        {
          to: 'activated-charcoal',
          label: 'Give Activated Charcoal',
          description: 'Follow up with charcoal'
        }
      ]
    },
    'activated-charcoal': {
      description: 'Administering activated charcoal',
      onEnter: [
        {
          type: 'setVariable',
          name: 'activatedCharcoalGiven',
          value: true
        }
      ],
      transitions: [
        {
          to: 'supportive-care',
          label: 'Continue to Supportive Care',
          description: 'Monitor and support'
        }
      ]
    },
    'supportive-care': {
      description: 'Providing supportive treatment',
      transitions: [
        {
          to: 'iv-fluids',
          label: 'Start IV Fluids',
          description: 'Begin fluid therapy'
        },
        {
          to: 'monitoring',
          label: 'Monitor Vital Signs',
          description: 'Continuous monitoring'
        }
      ]
    },
    'iv-fluids': {
      description: 'IV fluid therapy initiated',
      onEnter: [
        {
          type: 'setVariable',
          name: 'ivFluidStarted',
          value: true
        }
      ],
      transitions: [
        {
          to: 'monitoring',
          label: 'Continue Monitoring',
          description: 'Observe for changes'
        }
      ]
    },
    monitoring: {
      description: 'Continuous monitoring of patient',
      transitions: [
        {
          to: 'improvement',
          label: 'Patient Improving',
          description: 'Symptoms resolving'
        },
        {
          to: 'complications',
          label: 'Complications Arising',
          description: 'New symptoms developing'
        }
      ]
    },
    'diagnostic-tests': {
      description: 'Running blood work and diagnostics',
      transitions: [
        {
          to: 'supportive-care',
          label: 'Begin Treatment',
          description: 'Start supportive care'
        }
      ]
    },
    improvement: {
      description: 'Patient showing improvement',
      transitions: [
        {
          to: 'discharge-planning',
          label: 'Plan Discharge',
          description: 'Prepare for home care'
        }
      ]
    },
    complications: {
      description: 'Managing complications',
      transitions: [
        {
          to: 'intensive-care',
          label: 'Transfer to ICU',
          description: 'Needs intensive monitoring'
        }
      ]
    },
    'discharge-planning': {
      description: 'Preparing for discharge',
      isEnd: true
    },
    'intensive-care': {
      description: 'ICU management',
      transitions: [
        {
          to: 'improvement',
          label: 'Patient Stabilizing',
          description: 'Condition improving'
        }
      ]
    }
  },
  events: [
    {
      id: 'symptom-progression',
      type: 'timed',
      delay: 180000,
      condition: {
        type: 'variable',
        variable: 'activatedCharcoalGiven',
        operator: '==',
        value: false
      },
      actions: [
        {
          type: 'emit',
          event: 'symptoms:worsening',
          data: { newSymptoms: ['tremors', 'hyperthermia'] }
        }
      ]
    }
  ],
  optimalPath: ['arrival', 'history-taking', 'toxicity-calculation', 'decontamination', 'induce-vomiting', 'activated-charcoal', 'supportive-care', 'iv-fluids', 'monitoring', 'improvement', 'discharge-planning']
};

export const hitByCarScenario = {
  id: 'emergency-hit-by-car',
  title: 'Vehicular Trauma Emergency',
  description: 'A cat has been hit by a car and requires immediate trauma assessment',
  difficulty: 'expert',
  category: 'emergency',
  tags: ['trauma', 'critical', 'surgical'],
  initialPhase: 'arrival',
  initialVariables: {
    airwayPatent: true,
    breathingAdequate: false,
    circulationStable: false,
    consciousnessLevel: 'responsive',
    painLevel: 'severe',
    visibleInjuries: ['road rash', 'limping', 'bloody nose'],
    xraysTaken: false,
    surgeryNeeded: null,
    shockTreated: false
  },
  phases: {
    arrival: {
      description: 'Patient arrives after being hit by vehicle',
      onEnter: [
        {
          type: 'emit',
          event: 'trauma:alert',
          data: { severity: 'major' }
        }
      ],
      transitions: [
        {
          to: 'primary-survey',
          label: 'Begin Primary Survey',
          description: 'Start ABC assessment'
        }
      ]
    },
    'primary-survey': {
      description: 'ABC assessment (Airway, Breathing, Circulation)',
      transitions: [
        {
          to: 'airway-management',
          label: 'Secure Airway',
          condition: {
            type: 'variable',
            variable: 'airwayPatent',
            operator: '==',
            value: false
          }
        },
        {
          to: 'breathing-support',
          label: 'Support Breathing',
          condition: {
            type: 'variable',
            variable: 'breathingAdequate',
            operator: '==',
            value: false
          }
        },
        {
          to: 'circulation-support',
          label: 'Address Circulation',
          condition: {
            type: 'variable',
            variable: 'circulationStable',
            operator: '==',
            value: false
          }
        },
        {
          to: 'secondary-survey',
          label: 'Proceed to Secondary Survey',
          description: 'ABC stable, continue assessment'
        }
      ]
    },
    'airway-management': {
      description: 'Securing the airway',
      onEnter: [
        {
          type: 'setVariable',
          name: 'airwayPatent',
          value: true
        }
      ],
      transitions: [
        {
          to: 'breathing-support',
          label: 'Check Breathing',
          description: 'Airway secured'
        }
      ]
    },
    'breathing-support': {
      description: 'Supporting respiration',
      onEnter: [
        {
          type: 'setVariable',
          name: 'breathingAdequate',
          value: true
        }
      ],
      transitions: [
        {
          to: 'circulation-support',
          label: 'Check Circulation',
          description: 'Breathing stabilized'
        }
      ]
    },
    'circulation-support': {
      description: 'Managing circulation and shock',
      onEnter: [
        {
          type: 'setVariable',
          name: 'circulationStable',
          value: true
        },
        {
          type: 'setVariable',
          name: 'shockTreated',
          value: true
        }
      ],
      transitions: [
        {
          to: 'secondary-survey',
          label: 'Continue Assessment',
          description: 'Patient stabilized'
        }
      ]
    },
    'secondary-survey': {
      description: 'Complete trauma assessment',
      transitions: [
        {
          to: 'pain-management',
          label: 'Manage Pain',
          description: 'Administer pain relief'
        },
        {
          to: 'diagnostic-imaging',
          label: 'Order Imaging',
          description: 'X-rays and ultrasound'
        }
      ]
    },
    'pain-management': {
      description: 'Administering pain medication',
      onEnter: [
        {
          type: 'setVariable',
          name: 'painLevel',
          value: 'controlled'
        }
      ],
      transitions: [
        {
          to: 'diagnostic-imaging',
          label: 'Proceed to Imaging',
          description: 'Pain controlled'
        }
      ]
    },
    'diagnostic-imaging': {
      description: 'Performing x-rays and ultrasound',
      onEnter: [
        {
          type: 'setVariable',
          name: 'xraysTaken',
          value: true
        }
      ],
      transitions: [
        {
          to: 'injury-assessment',
          label: 'Review Results',
          description: 'Analyze imaging findings'
        }
      ]
    },
    'injury-assessment': {
      description: 'Reviewing diagnostic results',
      onEnter: [
        {
          type: 'setVariable',
          name: 'visibleInjuries',
          value: ['fractured pelvis', 'pulmonary contusions', 'road rash']
        }
      ],
      transitions: [
        {
          to: 'surgical-planning',
          label: 'Plan Surgery',
          description: 'Surgical intervention needed'
        },
        {
          to: 'conservative-treatment',
          label: 'Conservative Management',
          description: 'Non-surgical approach'
        }
      ]
    },
    'surgical-planning': {
      description: 'Preparing for surgery',
      onEnter: [
        {
          type: 'setVariable',
          name: 'surgeryNeeded',
          value: true
        }
      ],
      transitions: [
        {
          to: 'pre-surgical-prep',
          label: 'Prepare for Surgery',
          description: 'Begin pre-op protocols'
        }
      ]
    },
    'conservative-treatment': {
      description: 'Non-surgical management',
      onEnter: [
        {
          type: 'setVariable',
          name: 'surgeryNeeded',
          value: false
        }
      ],
      transitions: [
        {
          to: 'hospitalization',
          label: 'Admit for Observation',
          description: 'Monitor in hospital'
        }
      ]
    },
    'pre-surgical-prep': {
      description: 'Pre-operative preparation',
      transitions: [
        {
          to: 'surgery',
          label: 'Proceed to Surgery',
          description: 'Patient ready for OR'
        }
      ]
    },
    surgery: {
      description: 'Surgical intervention',
      transitions: [
        {
          to: 'post-operative',
          label: 'Surgery Complete',
          description: 'Move to recovery'
        }
      ]
    },
    'post-operative': {
      description: 'Post-surgical recovery',
      transitions: [
        {
          to: 'icu-care',
          label: 'Transfer to ICU',
          description: 'Intensive monitoring needed'
        }
      ]
    },
    hospitalization: {
      description: 'Hospital care and monitoring',
      transitions: [
        {
          to: 'recovery-monitoring',
          label: 'Continue Monitoring',
          description: 'Observe progress'
        }
      ]
    },
    'icu-care': {
      description: 'Intensive care unit management',
      transitions: [
        {
          to: 'recovery-monitoring',
          label: 'Stable for Ward',
          description: 'Transfer to regular ward'
        }
      ]
    },
    'recovery-monitoring': {
      description: 'Ongoing recovery monitoring',
      isEnd: true
    }
  },
  events: [
    {
      id: 'shock-development',
      type: 'conditional',
      condition: {
        type: 'and',
        conditions: [
          {
            type: 'variable',
            variable: 'shockTreated',
            operator: '==',
            value: false
          },
          {
            type: 'time',
            elapsed: 300000
          }
        ]
      },
      actions: [
        {
          type: 'emit',
          event: 'patient:decompensating',
          data: { reason: 'untreated shock' }
        }
      ]
    }
  ],
  optimalPath: ['arrival', 'primary-survey', 'circulation-support', 'secondary-survey', 'pain-management', 'diagnostic-imaging', 'injury-assessment', 'surgical-planning', 'pre-surgical-prep', 'surgery', 'post-operative', 'icu-care', 'recovery-monitoring']
};