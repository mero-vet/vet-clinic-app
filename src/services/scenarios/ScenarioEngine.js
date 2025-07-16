import EventEmitter from 'events';
import { performanceStore } from '../../stores/performanceStore';

class ScenarioEngine extends EventEmitter {
  constructor() {
    super();
    this.currentScenario = null;
    this.state = null;
    this.startTime = null;
    this.decisions = [];
    this.errors = [];
    this.eventTimers = new Map();
    this.conditionCheckers = new Map();
    this.performanceMetrics = {
      decisionTimes: [],
      errorCount: 0,
      recoveryTimes: [],
      completionTime: null,
      score: 0
    };
  }

  async loadScenario(scenario) {
    this.reset();
    this.currentScenario = scenario;
    this.state = this.createInitialState(scenario);
    this.startTime = Date.now();
    
    this.emit('scenario:loaded', {
      scenario: scenario.id,
      difficulty: scenario.difficulty,
      title: scenario.title
    });

    await this.initializeScenario();
    this.startEventSystem();
    this.startConditionMonitoring();
    
    return this.state;
  }

  createInitialState(scenario) {
    return {
      currentPhase: scenario.initialPhase || 'start',
      variables: { ...scenario.initialVariables },
      completedPhases: [],
      activeEvents: [],
      timestamp: Date.now(),
      scenarioId: scenario.id
    };
  }

  async initializeScenario() {
    const phase = this.getCurrentPhase();
    if (phase?.onEnter) {
      await this.executeActions(phase.onEnter);
    }
  }

  getCurrentPhase() {
    return this.currentScenario?.phases?.[this.state.currentPhase];
  }

  async transitionTo(nextPhase, context = {}) {
    const currentPhase = this.getCurrentPhase();
    const decisionTime = Date.now() - this.state.timestamp;
    
    this.decisions.push({
      from: this.state.currentPhase,
      to: nextPhase,
      timestamp: Date.now(),
      decisionTime,
      context
    });

    this.performanceMetrics.decisionTimes.push(decisionTime);

    if (currentPhase?.onExit) {
      await this.executeActions(currentPhase.onExit);
    }

    this.state.completedPhases.push(this.state.currentPhase);
    this.state.currentPhase = nextPhase;
    this.state.timestamp = Date.now();

    const newPhase = this.getCurrentPhase();
    if (newPhase?.onEnter) {
      await this.executeActions(newPhase.onEnter);
    }

    this.emit('phase:transition', {
      from: currentPhase,
      to: nextPhase,
      state: this.state
    });

    if (this.isScenarioComplete()) {
      await this.completeScenario();
    }
  }

  async executeActions(actions) {
    for (const action of actions) {
      switch (action.type) {
        case 'setVariable':
          this.setVariable(action.name, action.value);
          break;
        case 'emit':
          this.emit(action.event, action.data);
          break;
        case 'startTimer':
          this.startTimer(action.name, action.duration, action.callback);
          break;
        case 'stopTimer':
          this.stopTimer(action.name);
          break;
        case 'triggerEvent':
          await this.triggerEvent(action.eventId);
          break;
      }
    }
  }

  setVariable(name, value) {
    const oldValue = this.state.variables[name];
    this.state.variables[name] = value;
    
    this.emit('variable:changed', {
      name,
      oldValue,
      newValue: value
    });
  }

  getVariable(name) {
    return this.state.variables[name];
  }

  startEventSystem() {
    const events = this.currentScenario.events || [];
    
    events.forEach(event => {
      if (event.type === 'timed') {
        this.scheduleTimedEvent(event);
      } else if (event.type === 'conditional') {
        this.registerConditionalEvent(event);
      }
    });
  }

  scheduleTimedEvent(event) {
    const timer = setTimeout(() => {
      this.triggerEvent(event.id);
    }, event.delay);
    
    this.eventTimers.set(event.id, timer);
  }

  registerConditionalEvent(event) {
    const checker = setInterval(() => {
      if (this.evaluateCondition(event.condition)) {
        this.triggerEvent(event.id);
        if (!event.repeatable) {
          clearInterval(checker);
          this.conditionCheckers.delete(event.id);
        }
      }
    }, event.checkInterval || 1000);
    
    this.conditionCheckers.set(event.id, checker);
  }

  evaluateCondition(condition) {
    switch (condition.type) {
      case 'variable':
        return this.evaluateVariableCondition(condition);
      case 'phase':
        return this.state.currentPhase === condition.phase;
      case 'time':
        return Date.now() - this.startTime >= condition.elapsed;
      case 'and':
        return condition.conditions.every(c => this.evaluateCondition(c));
      case 'or':
        return condition.conditions.some(c => this.evaluateCondition(c));
      default:
        return false;
    }
  }

  evaluateVariableCondition(condition) {
    const value = this.getVariable(condition.variable);
    const compareValue = condition.value;
    
    switch (condition.operator) {
      case '==': return value == compareValue;
      case '!=': return value != compareValue;
      case '>': return value > compareValue;
      case '<': return value < compareValue;
      case '>=': return value >= compareValue;
      case '<=': return value <= compareValue;
      case 'contains': return value?.includes?.(compareValue);
      case 'in': return compareValue?.includes?.(value);
      default: return false;
    }
  }

  async triggerEvent(eventId) {
    const event = this.currentScenario.events?.find(e => e.id === eventId);
    if (!event) return;
    
    this.state.activeEvents.push({
      id: eventId,
      timestamp: Date.now()
    });
    
    if (event.actions) {
      await this.executeActions(event.actions);
    }
    
    this.emit('event:triggered', {
      eventId,
      event,
      state: this.state
    });
  }

  startTimer(name, duration, callback) {
    const timer = setTimeout(() => {
      if (callback) {
        this.executeActions(callback);
      }
      this.eventTimers.delete(name);
    }, duration);
    
    this.eventTimers.set(name, timer);
  }

  stopTimer(name) {
    const timer = this.eventTimers.get(name);
    if (timer) {
      clearTimeout(timer);
      this.eventTimers.delete(name);
    }
  }

  startConditionMonitoring() {
    const phase = this.getCurrentPhase();
    if (!phase?.transitions) return;
    
    phase.transitions.forEach(transition => {
      if (transition.condition) {
        this.monitorTransitionCondition(transition);
      }
    });
  }

  monitorTransitionCondition(transition) {
    const checker = setInterval(() => {
      if (this.evaluateCondition(transition.condition)) {
        clearInterval(checker);
        this.transitionTo(transition.to, { automatic: true });
      }
    }, 500);
    
    this.conditionCheckers.set(`transition_${transition.to}`, checker);
  }

  recordError(error) {
    const errorRecord = {
      type: error.type,
      message: error.message,
      timestamp: Date.now(),
      phase: this.state.currentPhase,
      context: error.context
    };
    
    this.errors.push(errorRecord);
    this.performanceMetrics.errorCount++;
    
    this.emit('error:recorded', errorRecord);
  }

  recordRecovery(errorType, recoveryTime) {
    this.performanceMetrics.recoveryTimes.push({
      errorType,
      recoveryTime,
      timestamp: Date.now()
    });
  }

  isScenarioComplete() {
    const phase = this.getCurrentPhase();
    return phase?.isEnd || this.state.currentPhase === 'complete';
  }

  async completeScenario() {
    this.performanceMetrics.completionTime = Date.now() - this.startTime;
    this.performanceMetrics.score = this.calculateScore();
    
    this.clearTimers();
    
    const result = {
      scenarioId: this.currentScenario.id,
      startTime: this.startTime,
      endTime: Date.now(),
      decisions: this.decisions,
      errors: this.errors,
      performanceMetrics: this.performanceMetrics,
      finalState: this.state
    };
    
    this.emit('scenario:completed', result);
    
    performanceStore.recordScenarioResult(result);
    
    return result;
  }

  calculateScore() {
    let score = 100;
    
    score -= this.performanceMetrics.errorCount * 10;
    
    const avgDecisionTime = this.performanceMetrics.decisionTimes.reduce((a, b) => a + b, 0) / 
                           this.performanceMetrics.decisionTimes.length || 0;
    if (avgDecisionTime > 5000) score -= 20;
    else if (avgDecisionTime > 3000) score -= 10;
    
    const optimalPath = this.currentScenario.optimalPath || [];
    const actualPath = this.state.completedPhases;
    const pathDeviation = this.calculatePathDeviation(optimalPath, actualPath);
    score -= pathDeviation * 5;
    
    return Math.max(0, Math.min(100, score));
  }

  calculatePathDeviation(optimal, actual) {
    let deviation = 0;
    const optimalSet = new Set(optimal);
    const actualSet = new Set(actual);
    
    optimalSet.forEach(phase => {
      if (!actualSet.has(phase)) deviation++;
    });
    
    actualSet.forEach(phase => {
      if (!optimalSet.has(phase)) deviation++;
    });
    
    return deviation;
  }

  clearTimers() {
    this.eventTimers.forEach(timer => clearTimeout(timer));
    this.eventTimers.clear();
    
    this.conditionCheckers.forEach(checker => clearInterval(checker));
    this.conditionCheckers.clear();
  }

  reset() {
    this.clearTimers();
    this.currentScenario = null;
    this.state = null;
    this.startTime = null;
    this.decisions = [];
    this.errors = [];
    this.performanceMetrics = {
      decisionTimes: [],
      errorCount: 0,
      recoveryTimes: [],
      completionTime: null,
      score: 0
    };
  }

  pause() {
    this.clearTimers();
    this.emit('scenario:paused', { state: this.state });
  }

  resume() {
    this.startEventSystem();
    this.startConditionMonitoring();
    this.emit('scenario:resumed', { state: this.state });
  }

  getAvailableActions() {
    const phase = this.getCurrentPhase();
    if (!phase) return [];
    
    return phase.transitions?.filter(t => 
      !t.condition || this.evaluateCondition(t.condition)
    ).map(t => ({
      id: t.to,
      label: t.label || t.to,
      description: t.description
    })) || [];
  }
}

export default new ScenarioEngine();