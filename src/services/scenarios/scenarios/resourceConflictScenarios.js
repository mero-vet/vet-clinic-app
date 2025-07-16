export const doubleBookedRoomScenario = {
  id: 'resource-double-booked-room',
  title: 'Double-Booked Surgery Room',
  description: 'Two critical surgeries are scheduled for the same OR at the same time',
  difficulty: 'medium',
  category: 'resource-conflict',
  tags: ['scheduling', 'resource-management', 'decision-making'],
  initialPhase: 'conflict-detected',
  initialVariables: {
    surgery1: {
      patient: 'Max (Dog)',
      procedure: 'Foreign body removal',
      urgency: 'urgent',
      prepTime: 30,
      surgeryTime: 90,
      surgeon: 'Dr. Smith'
    },
    surgery2: {
      patient: 'Luna (Cat)',
      procedure: 'Emergency C-section',
      urgency: 'critical',
      prepTime: 15,
      surgeryTime: 60,
      surgeon: 'Dr. Johnson'
    },
    availableRooms: ['OR-1 (occupied)', 'OR-2 (scheduled)', 'Treatment Room (limited equipment)'],
    resolution: null,
    delayedSurgery: null,
    complications: false
  },
  phases: {
    'conflict-detected': {
      description: 'Scheduling system shows double-booking alert',
      transitions: [
        {
          to: 'assess-priorities',
          label: 'Assess Case Priorities',
          description: 'Review both cases for urgency'
        },
        {
          to: 'check-alternatives',
          label: 'Check Alternative Resources',
          description: 'Look for other available rooms'
        },
        {
          to: 'contact-surgeons',
          label: 'Contact Surgeons',
          description: 'Discuss with both surgeons'
        }
      ]
    },
    'assess-priorities': {
      description: 'Reviewing medical urgency of both cases',
      transitions: [
        {
          to: 'prioritize-csection',
          label: 'Prioritize C-Section',
          description: 'C-section is more time-critical'
        },
        {
          to: 'prioritize-foreign-body',
          label: 'Prioritize Foreign Body',
          description: 'Foreign body case is deteriorating'
        },
        {
          to: 'seek-compromise',
          label: 'Find Compromise',
          description: 'Both cases equally urgent'
        }
      ]
    },
    'check-alternatives': {
      description: 'Searching for alternative solutions',
      transitions: [
        {
          to: 'setup-treatment-room',
          label: 'Convert Treatment Room',
          description: 'Set up treatment room for surgery'
        },
        {
          to: 'negotiate-or1',
          label: 'Negotiate OR-1 Time',
          description: 'Check if current surgery finishing soon'
        },
        {
          to: 'external-referral',
          label: 'Consider Referral',
          description: 'Contact nearby emergency clinic'
        }
      ]
    },
    'contact-surgeons': {
      description: 'Discussing options with both surgeons',
      onEnter: [
        {
          type: 'emit',
          event: 'communication:initiated',
          data: { parties: ['Dr. Smith', 'Dr. Johnson'] }
        }
      ],
      transitions: [
        {
          to: 'surgeon-agreement',
          label: 'Surgeons Agree on Plan',
          description: 'Collaborative solution found'
        },
        {
          to: 'surgeon-conflict',
          label: 'Surgeons Disagree',
          description: 'Both insist on priority'
        }
      ]
    },
    'prioritize-csection': {
      description: 'C-section given priority',
      onEnter: [
        {
          type: 'setVariable',
          name: 'resolution',
          value: 'csection-first'
        },
        {
          type: 'setVariable',
          name: 'delayedSurgery',
          value: 'foreign-body'
        }
      ],
      transitions: [
        {
          to: 'implement-decision',
          label: 'Implement Decision',
          description: 'Proceed with C-section'
        }
      ]
    },
    'prioritize-foreign-body': {
      description: 'Foreign body removal given priority',
      onEnter: [
        {
          type: 'setVariable',
          name: 'resolution',
          value: 'foreign-body-first'
        },
        {
          type: 'setVariable',
          name: 'delayedSurgery',
          value: 'csection'
        }
      ],
      transitions: [
        {
          to: 'implement-decision',
          label: 'Implement Decision',
          description: 'Proceed with foreign body removal'
        }
      ]
    },
    'seek-compromise': {
      description: 'Finding a compromise solution',
      transitions: [
        {
          to: 'staggered-schedule',
          label: 'Stagger Procedures',
          description: 'Quick procedure first, then second'
        },
        {
          to: 'dual-team-approach',
          label: 'Dual Team Approach',
          description: 'Run both with available resources'
        }
      ]
    },
    'setup-treatment-room': {
      description: 'Converting treatment room for surgery',
      onEnter: [
        {
          type: 'setVariable',
          name: 'resolution',
          value: 'use-treatment-room'
        }
      ],
      transitions: [
        {
          to: 'equipment-check',
          label: 'Verify Equipment',
          description: 'Ensure adequate equipment'
        },
        {
          to: 'implement-decision',
          label: 'Proceed with Setup',
          description: 'Room is adequate'
        }
      ]
    },
    'negotiate-or1': {
      description: 'Checking OR-1 availability',
      transitions: [
        {
          to: 'or1-available-soon',
          label: 'OR-1 Available in 30min',
          description: 'Current surgery finishing'
        },
        {
          to: 'or1-unavailable',
          label: 'OR-1 Not Available',
          description: 'Surgery will take hours'
        }
      ]
    },
    'external-referral': {
      description: 'Contacting external facilities',
      transitions: [
        {
          to: 'referral-accepted',
          label: 'Referral Accepted',
          description: 'External clinic can take case'
        },
        {
          to: 'referral-declined',
          label: 'No External Options',
          description: 'Must handle internally'
        }
      ]
    },
    'surgeon-agreement': {
      description: 'Surgeons reached agreement',
      onEnter: [
        {
          type: 'setVariable',
          name: 'resolution',
          value: 'collaborative-solution'
        }
      ],
      transitions: [
        {
          to: 'implement-decision',
          label: 'Execute Plan',
          description: 'Implement agreed solution'
        }
      ]
    },
    'surgeon-conflict': {
      description: 'Surgeons cannot agree',
      transitions: [
        {
          to: 'escalate-to-chief',
          label: 'Escalate to Chief of Staff',
          description: 'Need higher authority decision'
        },
        {
          to: 'medical-director-decision',
          label: 'Medical Director Decision',
          description: 'Get final ruling'
        }
      ]
    },
    'staggered-schedule': {
      description: 'Scheduling procedures back-to-back',
      onEnter: [
        {
          type: 'setVariable',
          name: 'resolution',
          value: 'staggered-timing'
        }
      ],
      transitions: [
        {
          to: 'implement-decision',
          label: 'Implement Schedule',
          description: 'Begin with first procedure'
        }
      ]
    },
    'equipment-check': {
      description: 'Verifying equipment availability',
      transitions: [
        {
          to: 'equipment-adequate',
          label: 'Equipment Sufficient',
          description: 'Can proceed safely'
        },
        {
          to: 'equipment-insufficient',
          label: 'Missing Critical Equipment',
          description: 'Cannot proceed safely'
        }
      ]
    },
    'or1-available-soon': {
      description: 'OR-1 will be available shortly',
      onEnter: [
        {
          type: 'setVariable',
          name: 'resolution',
          value: 'wait-for-or1'
        }
      ],
      transitions: [
        {
          to: 'implement-decision',
          label: 'Plan Confirmed',
          description: 'Wait for OR-1'
        }
      ]
    },
    'implement-decision': {
      description: 'Executing the decided plan',
      transitions: [
        {
          to: 'monitor-delayed-case',
          label: 'Monitor Delayed Patient',
          description: 'Ensure stable while waiting'
        },
        {
          to: 'begin-procedures',
          label: 'Start Procedures',
          description: 'Initiate surgical plan'
        }
      ]
    },
    'monitor-delayed-case': {
      description: 'Monitoring the delayed surgery patient',
      transitions: [
        {
          to: 'delayed-patient-stable',
          label: 'Patient Stable',
          description: 'Can wait safely'
        },
        {
          to: 'delayed-patient-deteriorating',
          label: 'Patient Deteriorating',
          description: 'Condition worsening'
        }
      ]
    },
    'delayed-patient-deteriorating': {
      description: 'Delayed patient condition worsening',
      onEnter: [
        {
          type: 'setVariable',
          name: 'complications',
          value: true
        }
      ],
      transitions: [
        {
          to: 'emergency-intervention',
          label: 'Emergency Intervention',
          description: 'Immediate action needed'
        }
      ]
    },
    'begin-procedures': {
      description: 'Surgeries proceeding as planned',
      transitions: [
        {
          to: 'successful-resolution',
          label: 'Both Surgeries Complete',
          description: 'All patients treated'
        }
      ]
    },
    'successful-resolution': {
      description: 'Conflict resolved successfully',
      isEnd: true
    },
    'emergency-intervention': {
      description: 'Emergency measures taken',
      isEnd: true
    },
    'referral-accepted': {
      description: 'Patient transferred to external facility',
      isEnd: true
    },
    'escalate-to-chief': {
      description: 'Chief of staff makes decision',
      transitions: [
        {
          to: 'implement-decision',
          label: 'Follow Chief Decision',
          description: 'Execute as directed'
        }
      ]
    }
  },
  events: [
    {
      id: 'time-pressure',
      type: 'timed',
      delay: 300000, // 5 minutes
      actions: [
        {
          type: 'emit',
          event: 'urgency:increasing',
          data: { message: 'Both surgeries becoming more urgent' }
        }
      ]
    }
  ],
  optimalPath: ['conflict-detected', 'assess-priorities', 'seek-compromise', 'staggered-schedule', 'implement-decision', 'begin-procedures', 'successful-resolution']
};

export const staffShortageScenario = {
  id: 'resource-staff-shortage',
  title: 'Critical Staff Shortage',
  description: 'Multiple staff called in sick during busy day with emergencies',
  difficulty: 'hard',
  category: 'resource-conflict',
  tags: ['staffing', 'resource-management', 'prioritization'],
  initialPhase: 'shortage-alert',
  initialVariables: {
    normalStaffing: {
      vets: 4,
      techs: 6,
      receptionists: 2
    },
    currentStaffing: {
      vets: 2,
      techs: 3,
      receptionists: 1
    },
    scheduledAppointments: 24,
    emergencyCases: 0,
    waitingClients: 8,
    staffMorale: 'stressed',
    overtimeApproved: false,
    tempStaffContacted: false
  },
  phases: {
    'shortage-alert': {
      description: 'Morning staff shortage discovered',
      onEnter: [
        {
          type: 'emit',
          event: 'staffing:critical',
          data: { severity: 'high' }
        }
      ],
      transitions: [
        {
          to: 'immediate-assessment',
          label: 'Assess Situation',
          description: 'Evaluate current workload'
        },
        {
          to: 'emergency-staffing',
          label: 'Call Emergency Staff',
          description: 'Contact on-call personnel'
        }
      ]
    },
    'immediate-assessment': {
      description: 'Evaluating workload and priorities',
      transitions: [
        {
          to: 'triage-appointments',
          label: 'Triage Appointments',
          description: 'Prioritize critical cases'
        },
        {
          to: 'redistribute-tasks',
          label: 'Redistribute Tasks',
          description: 'Reassign responsibilities'
        }
      ]
    },
    'emergency-staffing': {
      description: 'Contacting additional staff',
      onEnter: [
        {
          type: 'setVariable',
          name: 'tempStaffContacted',
          value: true
        }
      ],
      transitions: [
        {
          to: 'staff-responding',
          label: 'Staff Available',
          description: 'Some staff can come in'
        },
        {
          to: 'no-additional-staff',
          label: 'No One Available',
          description: 'Must work with current team'
        }
      ]
    },
    'triage-appointments': {
      description: 'Prioritizing scheduled appointments',
      transitions: [
        {
          to: 'reschedule-routine',
          label: 'Reschedule Non-Urgent',
          description: 'Move routine appointments'
        },
        {
          to: 'condense-schedule',
          label: 'Condense Schedule',
          description: 'Combine similar appointments'
        }
      ]
    },
    'redistribute-tasks': {
      description: 'Reassigning staff responsibilities',
      transitions: [
        {
          to: 'cross-training-needed',
          label: 'Implement Cross-Training',
          description: 'Staff work outside usual roles'
        },
        {
          to: 'priority-tasks-only',
          label: 'Essential Tasks Only',
          description: 'Focus on critical functions'
        }
      ]
    },
    'staff-responding': {
      description: 'Additional staff coming in',
      onEnter: [
        {
          type: 'setVariable',
          name: 'currentStaffing.vets',
          value: 3
        },
        {
          type: 'setVariable',
          name: 'currentStaffing.techs',
          value: 4
        }
      ],
      transitions: [
        {
          to: 'modified-operations',
          label: 'Adjust Operations',
          description: 'Work with partial team'
        }
      ]
    },
    'no-additional-staff': {
      description: 'Working with skeleton crew',
      transitions: [
        {
          to: 'crisis-mode',
          label: 'Activate Crisis Mode',
          description: 'Emergency protocols only'
        },
        {
          to: 'temporary-closure',
          label: 'Consider Partial Closure',
          description: 'Limit services offered'
        }
      ]
    },
    'reschedule-routine': {
      description: 'Contacting clients to reschedule',
      onEnter: [
        {
          type: 'setVariable',
          name: 'scheduledAppointments',
          value: 16
        }
      ],
      transitions: [
        {
          to: 'client-communication',
          label: 'Notify Clients',
          description: 'Call affected appointments'
        }
      ]
    },
    'crisis-mode': {
      description: 'Operating in crisis mode',
      onEnter: [
        {
          type: 'emit',
          event: 'operations:crisis-mode',
          data: { services: 'emergency-only' }
        }
      ],
      transitions: [
        {
          to: 'emergency-incoming',
          label: 'Emergency Arrives',
          description: 'Critical case comes in'
        },
        {
          to: 'manage-waiting-room',
          label: 'Handle Walk-ins',
          description: 'Deal with waiting clients'
        }
      ]
    },
    'emergency-incoming': {
      description: 'Emergency case arrives',
      onEnter: [
        {
          type: 'setVariable',
          name: 'emergencyCases',
          value: 1
        }
      ],
      transitions: [
        {
          to: 'all-hands-emergency',
          label: 'All Hands Response',
          description: 'Everyone assists with emergency'
        },
        {
          to: 'delegate-emergency',
          label: 'Assign Emergency Team',
          description: 'Dedicated team handles case'
        }
      ]
    },
    'modified-operations': {
      description: 'Operating with reduced capacity',
      transitions: [
        {
          to: 'monitor-staff-stress',
          label: 'Check Staff Wellbeing',
          description: 'Monitor team stress levels'
        },
        {
          to: 'adjust-workflow',
          label: 'Optimize Workflow',
          description: 'Streamline processes'
        }
      ]
    },
    'monitor-staff-stress': {
      description: 'Monitoring team wellbeing',
      transitions: [
        {
          to: 'staff-break-rotation',
          label: 'Enforce Break Schedule',
          description: 'Ensure staff get breaks'
        },
        {
          to: 'morale-boosting',
          label: 'Boost Morale',
          description: 'Support stressed team'
        }
      ]
    },
    'client-communication': {
      description: 'Communicating with affected clients',
      transitions: [
        {
          to: 'clients-understanding',
          label: 'Clients Cooperative',
          description: 'Most accept rescheduling'
        },
        {
          to: 'client-complaints',
          label: 'Client Complaints',
          description: 'Some clients upset'
        }
      ]
    },
    'all-hands-emergency': {
      description: 'Entire team handling emergency',
      transitions: [
        {
          to: 'emergency-resolved',
          label: 'Emergency Handled',
          description: 'Patient stabilized'
        },
        {
          to: 'emergency-complications',
          label: 'Complications Arise',
          description: 'Case becomes complex'
        }
      ]
    },
    'staff-break-rotation': {
      description: 'Managing staff breaks',
      onEnter: [
        {
          type: 'setVariable',
          name: 'staffMorale',
          value: 'improving'
        }
      ],
      transitions: [
        {
          to: 'day-progressing',
          label: 'Continue Operations',
          description: 'Day proceeding smoothly'
        }
      ]
    },
    'day-progressing': {
      description: 'Managing through the day',
      transitions: [
        {
          to: 'shift-end-approaching',
          label: 'Near End of Day',
          description: 'Preparing for closure'
        },
        {
          to: 'unexpected-rush',
          label: 'Unexpected Rush',
          description: 'Sudden influx of cases'
        }
      ]
    },
    'shift-end-approaching': {
      description: 'Preparing for end of day',
      transitions: [
        {
          to: 'successful-completion',
          label: 'Day Completed',
          description: 'Team made it through'
        }
      ]
    },
    'successful-completion': {
      description: 'Successfully managed shortage',
      isEnd: true
    },
    'emergency-complications': {
      description: 'Handling complex emergency with limited staff',
      transitions: [
        {
          to: 'call-specialist',
          label: 'Consult Specialist',
          description: 'Get expert advice'
        },
        {
          to: 'transfer-patient',
          label: 'Transfer Patient',
          description: 'Send to equipped facility'
        }
      ]
    }
  },
  events: [
    {
      id: 'lunch-rush',
      type: 'timed',
      delay: 14400000, // 4 hours (lunch time)
      actions: [
        {
          type: 'setVariable',
          name: 'waitingClients',
          value: 12
        },
        {
          type: 'emit',
          event: 'workload:spike',
          data: { time: 'lunch-hour' }
        }
      ]
    },
    {
      id: 'staff-fatigue',
      type: 'conditional',
      condition: {
        type: 'and',
        conditions: [
          {
            type: 'variable',
            variable: 'staffMorale',
            operator: '==',
            value: 'stressed'
          },
          {
            type: 'time',
            elapsed: 21600000 // 6 hours
          }
        ]
      },
      actions: [
        {
          type: 'emit',
          event: 'staff:burnout-risk',
          data: { severity: 'high' }
        }
      ]
    }
  ],
  optimalPath: ['shortage-alert', 'emergency-staffing', 'staff-responding', 'modified-operations', 'monitor-staff-stress', 'staff-break-rotation', 'day-progressing', 'shift-end-approaching', 'successful-completion']
};