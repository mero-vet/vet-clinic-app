import ScenarioService from '../services/ScenarioService';
import { testDefinitions } from '../tests/testDefinitions';

export async function runScenarioMigration() {
  try {
    // Starting scenario migration

    // Check if migration has already been done
    const existingScenarios = await ScenarioService.getAllScenarios();
    if (existingScenarios.length > 0) {
      // Checking for missing scenarios
    }

    // Run migration
    await ScenarioService.migrateExistingScenarios(testDefinitions);

    // Verify migration
    const scenarios = await ScenarioService.getAllScenarios();
    // Migration complete

    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

// Auto-run migration on import if in development
if (import.meta.env.DEV) {
  // Run migration after a short delay to ensure DB is ready
  setTimeout(() => {
    runScenarioMigration().then(success => {
      if (success) {
        // Scenario migration check completed
      }
    });
  }, 1000);
}