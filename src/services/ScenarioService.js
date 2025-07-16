const DB_NAME = 'VetClinicScenarios';
const DB_VERSION = 1;
const STORE_NAME = 'scenarios';

class ScenarioService {
  constructor() {
    this.db = null;
    this.memoryStore = {}; // fallback in-memory store
    this.isInMemory = false;
    this.initPromise = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        // Fallback to in-memory store to keep the app functional instead of rejecting
        this.isInMemory = true;
        console.warn('[ScenarioService] Falling back to in-memory scenario store');
        resolve(); // resolve the promise so service continues using memory store
        if (this.isInMemory) {
          // Dynamically import default definitions to seed in-memory store.
          import('../tests/testDefinitions.js')
            .then(({ testDefinitions }) => {
              testDefinitions.forEach((scn) => {
                this.memoryStore[scn.id] = {
                  ...scn,
                  enabled: true,
                  pims: scn.pims || ['cornerstone'],
                };
              });
            })
            .catch((seedErr) => {
              console.warn('[ScenarioService] No testDefinitions found to seed defaults:', seedErr);
              // Seed a minimal fallback scenario so the UI has at least one entry
              this.memoryStore['default'] = {
                id: 'default',
                name: 'Example Scenario',
                description: 'Fallback scenario when no definitions are available.',
                expectedResult: 'App executes without errors',
                agentPrompt: 'Run the default workflow.',
                enabled: true,
                pims: ['cornerstone'],
                successCriteria: []
              };
            });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('enabled', 'enabled', { unique: false });
          store.createIndex('pims', 'pims', { unique: false, multiEntry: true });
          store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        }
      };
    });
  }

  async ensureDB() {
    // If in-memory mode, no IndexedDB operations are required
    if (this.isInMemory) return;
    if (!this.db) {
      await this.initPromise;
    }
  }

  async getAllScenarios() {
    await this.ensureDB();

    if (this.isInMemory) {
      return Object.values(this.memoryStore);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getEnabledScenarios() {
    await this.ensureDB();

    if (this.isInMemory) {
      if (Object.keys(this.memoryStore).length === 0) {
        // Seed minimal scenario if none present
        this.memoryStore['default'] = {
          id: 'default',
          name: 'Example Scenario',
          description: 'Fallback scenario when no definitions are available.',
          expectedResult: 'App executes without errors',
          agentPrompt: 'Run the default workflow.',
          enabled: true,
          pims: ['cornerstone'],
          successCriteria: []
        };
      }
      return Object.values(this.memoryStore).filter(s => s.enabled);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('enabled');
      const request = index.getAll(true);

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getScenario(id) {
    await this.ensureDB();

    if (this.isInMemory) {
      return this.memoryStore[id] || null;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveScenario(scenario) {
    await this.ensureDB();

    // Validate scenario structure
    const validationErrors = this.validateScenario(scenario);
    if (validationErrors.length > 0) {
      throw new Error(`Scenario validation failed: ${validationErrors.join(', ')}`);
    }

    if (this.isInMemory) {
      this.memoryStore[scenario.id] = scenario;
      return scenario;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(scenario);

      request.onsuccess = () => {
        resolve(scenario);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteScenario(id) {
    await this.ensureDB();

    if (this.isInMemory) {
      delete this.memoryStore[id];
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  validateScenario(scenario) {
    const errors = [];

    // Required fields
    if (!scenario.id || typeof scenario.id !== 'string') {
      errors.push('id is required and must be a string');
    }
    if (!scenario.name || typeof scenario.name !== 'string') {
      errors.push('name is required and must be a string');
    }
    if (!scenario.description || typeof scenario.description !== 'string') {
      errors.push('description is required and must be a string');
    }
    if (!scenario.expectedResult || typeof scenario.expectedResult !== 'string') {
      errors.push('expectedResult is required and must be a string');
    }
    if (!scenario.agentPrompt || typeof scenario.agentPrompt !== 'string') {
      errors.push('agentPrompt is required and must be a string');
    }
    if (typeof scenario.enabled !== 'boolean') {
      errors.push('enabled must be a boolean');
    }

    // Validate PIMS array
    if (!Array.isArray(scenario.pims)) {
      errors.push('pims must be an array');
    } else {
      const validPims = ['cornerstone', 'avimark', 'easyvet', 'intravet', 'covetrus'];
      scenario.pims.forEach(pim => {
        if (!validPims.includes(pim)) {
          errors.push(`Invalid PIMS: ${pim}`);
        }
      });
    }

    // Validate success criteria
    if (!Array.isArray(scenario.successCriteria)) {
      errors.push('successCriteria must be an array');
    } else {
      scenario.successCriteria.forEach((criteria, index) => {
        if (!criteria.type) {
          errors.push(`successCriteria[${index}] must have a type`);
        }
        if (criteria.type === 'selector' && !criteria.selector) {
          errors.push(`successCriteria[${index}] of type 'selector' must have a selector`);
        }
        if (criteria.type === 'url-contains' && !criteria.value) {
          errors.push(`successCriteria[${index}] of type 'url-contains' must have a value`);
        }
      });
    }

    // Optional fields
    if (scenario.tags && !Array.isArray(scenario.tags)) {
      errors.push('tags must be an array if provided');
    }

    return errors;
  }

  async migrateExistingScenarios(testDefinitions) {
    await this.ensureDB();

    const migrationPromises = testDefinitions.map(async (test) => {
      // Check if scenario already exists
      const existing = await this.getScenario(test.id);
      if (existing) {
        // Migration logging - scenario already exists
        return;
      }

      // Convert test definition to scenario format
      const scenario = {
        id: test.id,
        name: test.name,
        description: test.description,
        agentPrompt: test.agentPrompt,
        successCriteria: test.successCriteria,
        expectedResult: 'Test completed successfully based on defined criteria',
        pims: ['cornerstone', 'avimark', 'easyvet', 'intravet', 'covetrus'], // Default to all PIMS
        enabled: true,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.saveScenario(scenario);
      // Migration completed for scenario
    });

    await Promise.all(migrationPromises);
    // All scenario migrations completed
  }

  async getScenariosByPIMS(pimsName) {
    await this.ensureDB();
    const allScenarios = await this.getEnabledScenarios();
    return allScenarios.filter(scenario => scenario.pims.includes(pimsName));
  }

  async getScenariosByTags(tags) {
    await this.ensureDB();
    const allScenarios = await this.getEnabledScenarios();
    return allScenarios.filter(scenario =>
      tags.some(tag => scenario.tags?.includes(tag))
    );
  }
}

export default new ScenarioService();