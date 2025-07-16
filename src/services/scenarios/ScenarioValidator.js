class ScenarioValidator {
  constructor() {
    this.requiredFields = ['id', 'title', 'difficulty', 'phases'];
    this.difficultyLevels = ['easy', 'medium', 'hard', 'expert'];
    this.actionTypes = ['setVariable', 'emit', 'startTimer', 'stopTimer', 'triggerEvent'];
    this.eventTypes = ['timed', 'conditional'];
    this.conditionTypes = ['variable', 'phase', 'time', 'and', 'or'];
    this.operators = ['==', '!=', '>', '<', '>=', '<=', 'contains', 'in'];
  }

  validate(scenario) {
    const errors = [];
    
    this.validateRequiredFields(scenario, errors);
    
    if (scenario.id && !/^[a-z0-9-_]+$/.test(scenario.id)) {
      errors.push('Scenario ID must contain only lowercase letters, numbers, hyphens, and underscores');
    }
    
    if (scenario.difficulty && !this.difficultyLevels.includes(scenario.difficulty)) {
      errors.push(`Difficulty must be one of: ${this.difficultyLevels.join(', ')}`);
    }
    
    if (scenario.phases) {
      this.validatePhases(scenario.phases, errors);
    }
    
    if (scenario.events) {
      this.validateEvents(scenario.events, errors);
    }
    
    if (scenario.initialVariables) {
      this.validateInitialVariables(scenario.initialVariables, errors);
    }
    
    if (scenario.optimalPath) {
      this.validateOptimalPath(scenario.optimalPath, scenario.phases, errors);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateRequiredFields(scenario, errors) {
    this.requiredFields.forEach(field => {
      if (!scenario[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }

  validatePhases(phases, errors) {
    if (typeof phases !== 'object') {
      errors.push('Phases must be an object');
      return;
    }
    
    const phaseNames = Object.keys(phases);
    if (phaseNames.length === 0) {
      errors.push('At least one phase is required');
    }
    
    let hasEndPhase = false;
    
    phaseNames.forEach(phaseName => {
      const phase = phases[phaseName];
      
      if (phase.isEnd) {
        hasEndPhase = true;
      }
      
      if (phase.transitions) {
        this.validateTransitions(phase.transitions, phaseNames, errors, phaseName);
      }
      
      if (phase.onEnter) {
        this.validateActions(phase.onEnter, errors, `${phaseName}.onEnter`);
      }
      
      if (phase.onExit) {
        this.validateActions(phase.onExit, errors, `${phaseName}.onExit`);
      }
    });
    
    if (!hasEndPhase) {
      errors.push('At least one phase must be marked as an end phase (isEnd: true)');
    }
  }

  validateTransitions(transitions, validPhases, errors, phaseName) {
    if (!Array.isArray(transitions)) {
      errors.push(`${phaseName}.transitions must be an array`);
      return;
    }
    
    transitions.forEach((transition, index) => {
      if (!transition.to) {
        errors.push(`${phaseName}.transitions[${index}] missing 'to' field`);
      } else if (!validPhases.includes(transition.to)) {
        errors.push(`${phaseName}.transitions[${index}] references unknown phase: ${transition.to}`);
      }
      
      if (transition.condition) {
        this.validateCondition(transition.condition, errors, `${phaseName}.transitions[${index}].condition`);
      }
    });
  }

  validateActions(actions, errors, path) {
    if (!Array.isArray(actions)) {
      errors.push(`${path} must be an array`);
      return;
    }
    
    actions.forEach((action, index) => {
      if (!action.type) {
        errors.push(`${path}[${index}] missing 'type' field`);
      } else if (!this.actionTypes.includes(action.type)) {
        errors.push(`${path}[${index}] invalid action type: ${action.type}`);
      }
      
      switch (action.type) {
        case 'setVariable':
          if (!action.name) {
            errors.push(`${path}[${index}] setVariable action missing 'name' field`);
          }
          if (action.value === undefined) {
            errors.push(`${path}[${index}] setVariable action missing 'value' field`);
          }
          break;
        case 'emit':
          if (!action.event) {
            errors.push(`${path}[${index}] emit action missing 'event' field`);
          }
          break;
        case 'startTimer':
          if (!action.name) {
            errors.push(`${path}[${index}] startTimer action missing 'name' field`);
          }
          if (!action.duration) {
            errors.push(`${path}[${index}] startTimer action missing 'duration' field`);
          }
          break;
        case 'stopTimer':
          if (!action.name) {
            errors.push(`${path}[${index}] stopTimer action missing 'name' field`);
          }
          break;
        case 'triggerEvent':
          if (!action.eventId) {
            errors.push(`${path}[${index}] triggerEvent action missing 'eventId' field`);
          }
          break;
      }
    });
  }

  validateEvents(events, errors) {
    if (!Array.isArray(events)) {
      errors.push('Events must be an array');
      return;
    }
    
    const eventIds = new Set();
    
    events.forEach((event, index) => {
      if (!event.id) {
        errors.push(`events[${index}] missing 'id' field`);
      } else if (eventIds.has(event.id)) {
        errors.push(`Duplicate event ID: ${event.id}`);
      } else {
        eventIds.add(event.id);
      }
      
      if (!event.type) {
        errors.push(`events[${index}] missing 'type' field`);
      } else if (!this.eventTypes.includes(event.type)) {
        errors.push(`events[${index}] invalid event type: ${event.type}`);
      }
      
      if (event.type === 'timed' && !event.delay) {
        errors.push(`events[${index}] timed event missing 'delay' field`);
      }
      
      if (event.type === 'conditional' && !event.condition) {
        errors.push(`events[${index}] conditional event missing 'condition' field`);
      } else if (event.condition) {
        this.validateCondition(event.condition, errors, `events[${index}].condition`);
      }
      
      if (event.actions) {
        this.validateActions(event.actions, errors, `events[${index}].actions`);
      }
    });
  }

  validateCondition(condition, errors, path) {
    if (!condition.type) {
      errors.push(`${path} missing 'type' field`);
      return;
    }
    
    if (!this.conditionTypes.includes(condition.type)) {
      errors.push(`${path} invalid condition type: ${condition.type}`);
    }
    
    switch (condition.type) {
      case 'variable':
        if (!condition.variable) {
          errors.push(`${path} variable condition missing 'variable' field`);
        }
        if (!condition.operator) {
          errors.push(`${path} variable condition missing 'operator' field`);
        } else if (!this.operators.includes(condition.operator)) {
          errors.push(`${path} invalid operator: ${condition.operator}`);
        }
        if (condition.value === undefined) {
          errors.push(`${path} variable condition missing 'value' field`);
        }
        break;
      case 'phase':
        if (!condition.phase) {
          errors.push(`${path} phase condition missing 'phase' field`);
        }
        break;
      case 'time':
        if (!condition.elapsed) {
          errors.push(`${path} time condition missing 'elapsed' field`);
        }
        break;
      case 'and':
      case 'or':
        if (!condition.conditions || !Array.isArray(condition.conditions)) {
          errors.push(`${path} ${condition.type} condition missing 'conditions' array`);
        } else {
          condition.conditions.forEach((subCondition, index) => {
            this.validateCondition(subCondition, errors, `${path}.conditions[${index}]`);
          });
        }
        break;
    }
  }

  validateInitialVariables(variables, errors) {
    if (typeof variables !== 'object') {
      errors.push('initialVariables must be an object');
    }
  }

  validateOptimalPath(optimalPath, phases, errors) {
    if (!Array.isArray(optimalPath)) {
      errors.push('optimalPath must be an array');
      return;
    }
    
    const validPhases = Object.keys(phases || {});
    optimalPath.forEach((phase, index) => {
      if (!validPhases.includes(phase)) {
        errors.push(`optimalPath[${index}] references unknown phase: ${phase}`);
      }
    });
  }

  createScenarioTemplate() {
    return {
      id: 'scenario-id',
      title: 'Scenario Title',
      description: 'Scenario description',
      difficulty: 'medium',
      category: 'emergency',
      initialPhase: 'start',
      initialVariables: {
        criticalLevel: 0,
        timeElapsed: 0
      },
      phases: {
        start: {
          description: 'Initial phase description',
          transitions: [
            {
              to: 'assessment',
              label: 'Begin Assessment',
              description: 'Start patient assessment'
            }
          ],
          onEnter: [
            {
              type: 'emit',
              event: 'scenario:phase:entered',
              data: { phase: 'start' }
            }
          ]
        },
        assessment: {
          description: 'Assessment phase',
          transitions: [
            {
              to: 'treatment',
              label: 'Start Treatment',
              condition: {
                type: 'variable',
                variable: 'assessmentComplete',
                operator: '==',
                value: true
              }
            }
          ]
        },
        treatment: {
          description: 'Treatment phase',
          transitions: [
            {
              to: 'complete',
              label: 'Complete Scenario'
            }
          ]
        },
        complete: {
          description: 'Scenario completed',
          isEnd: true
        }
      },
      events: [
        {
          id: 'critical-timer',
          type: 'timed',
          delay: 30000,
          actions: [
            {
              type: 'setVariable',
              name: 'criticalLevel',
              value: 1
            }
          ]
        }
      ],
      optimalPath: ['start', 'assessment', 'treatment', 'complete']
    };
  }
}

export default new ScenarioValidator();