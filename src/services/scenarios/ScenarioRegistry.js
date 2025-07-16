import scenarioValidator from './ScenarioValidator';

class ScenarioRegistry {
  constructor() {
    this.scenarios = new Map();
    this.categories = new Map();
    this.loaded = false;
  }

  async initialize() {
    if (this.loaded) return;
    
    await this.loadBuiltInScenarios();
    this.loaded = true;
  }

  register(scenario) {
    const validation = scenarioValidator.validate(scenario);
    
    if (!validation.valid) {
      throw new Error(`Invalid scenario: ${validation.errors.join(', ')}`);
    }
    
    this.scenarios.set(scenario.id, scenario);
    
    if (scenario.category) {
      if (!this.categories.has(scenario.category)) {
        this.categories.set(scenario.category, new Set());
      }
      this.categories.get(scenario.category).add(scenario.id);
    }
    
    return scenario.id;
  }

  unregister(scenarioId) {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return false;
    
    this.scenarios.delete(scenarioId);
    
    if (scenario.category && this.categories.has(scenario.category)) {
      this.categories.get(scenario.category).delete(scenarioId);
    }
    
    return true;
  }

  get(scenarioId) {
    return this.scenarios.get(scenarioId);
  }

  getAll() {
    return Array.from(this.scenarios.values());
  }

  getByCategory(category) {
    const scenarioIds = this.categories.get(category);
    if (!scenarioIds) return [];
    
    return Array.from(scenarioIds).map(id => this.scenarios.get(id));
  }

  getByDifficulty(difficulty) {
    return this.getAll().filter(scenario => scenario.difficulty === difficulty);
  }

  getCategories() {
    return Array.from(this.categories.keys());
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    
    return this.getAll().filter(scenario => 
      scenario.title.toLowerCase().includes(lowerQuery) ||
      scenario.description?.toLowerCase().includes(lowerQuery) ||
      scenario.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async loadFromFile(filePath) {
    try {
      const response = await fetch(filePath);
      const scenario = await response.json();
      
      const validation = scenarioValidator.validate(scenario);
      if (!validation.valid) {
        throw new Error(`Invalid scenario in ${filePath}: ${validation.errors.join(', ')}`);
      }
      
      this.register(scenario);
      return scenario;
    } catch (error) {
      console.error(`Failed to load scenario from ${filePath}:`, error);
      throw error;
    }
  }

  async loadFromDirectory(directoryPath) {
    const scenarioFiles = await this.getScenarioFiles(directoryPath);
    const loadPromises = scenarioFiles.map(file => this.loadFromFile(file));
    
    const results = await Promise.allSettled(loadPromises);
    
    const loaded = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected').map(r => r.reason);
    
    if (failed.length > 0) {
      console.warn(`Failed to load ${failed.length} scenarios:`, failed);
    }
    
    return {
      loaded,
      failed: failed.length
    };
  }

  async getScenarioFiles(directoryPath) {
    return [];
  }

  async loadBuiltInScenarios() {
    const scenarios = await import('./scenarios/index.js');
    
    Object.values(scenarios.default || scenarios).forEach(scenario => {
      try {
        this.register(scenario);
      } catch (error) {
        console.error('Failed to register built-in scenario:', error);
      }
    });
  }

  exportScenario(scenarioId) {
    const scenario = this.get(scenarioId);
    if (!scenario) return null;
    
    return JSON.stringify(scenario, null, 2);
  }

  importScenario(jsonString) {
    try {
      const scenario = JSON.parse(jsonString);
      this.register(scenario);
      return scenario;
    } catch (error) {
      throw new Error(`Failed to import scenario: ${error.message}`);
    }
  }

  validateScenario(scenario) {
    return scenarioValidator.validate(scenario);
  }

  getScenarioTemplate() {
    return scenarioValidator.createScenarioTemplate();
  }

  getStatistics() {
    const stats = {
      total: this.scenarios.size,
      byCategory: {},
      byDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
        expert: 0
      }
    };
    
    this.categories.forEach((scenarioIds, category) => {
      stats.byCategory[category] = scenarioIds.size;
    });
    
    this.getAll().forEach(scenario => {
      if (stats.byDifficulty.hasOwnProperty(scenario.difficulty)) {
        stats.byDifficulty[scenario.difficulty]++;
      }
    });
    
    return stats;
  }

  clear() {
    this.scenarios.clear();
    this.categories.clear();
  }
}

export { ScenarioRegistry };
export default new ScenarioRegistry();