# PRD-16: Scenario Management Enhancements

Current Status: COMPLETED
Next Action Item: Test scenario creation and management flow
Blocking Issues: None

## Key Files and Components

### Files to Update
- `src/tests/testDefinitions.js`
  - Convert from hard-coded array to dynamic store
- `src/components/TestManager/ScenarioSelector.jsx`
  - Fetch scenario list from new source
- `src/services/ScenarioService.js` (NEW)
  - CRUD operations for scenarios (local JSON → future server API)
- `src/context/TestLoggerContext.jsx`
  - Include `scenarioId` + metadata in session header

### Editor (new)
- `src/components/TestManager/ScenarioEditor.jsx`
  - Form-driven interface to create / edit / delete scenarios
  - Validation of required fields and expected outcome notes

## Objective

Allow product owners and QA to add, remove and modify test scenarios without touching source code. A flexible scenario catalogue ensures the AI agent can be evaluated on new workflows (e.g., "Check inventory levels and order stock") while retaining the original 10 core competencies.

## Implementation Plan

### Phase 1: Data Model & Storage
- [x] 1.1 Define `Scenario` JSON schema (id, name, description, steps, tags, enabled)
- [x] 1.2 Implement `ScenarioService` with IndexedDB persistence
- [x] 1.3 Provide migration script to seed existing 10 scenarios

### Phase 2: UI Integration
- [x] 2.1 Replace hard-coded list in `ScenarioSelector` with reactive fetch
- [x] 2.2 Add **"Add Scenario"** button leading to `ScenarioEditor`
- [x] 2.3 Allow enable/disable switch to hide unstable scenarios

### Phase 3: Validation & Workflow Mapping
- [x] 3.1 Add pre-test checklist ensuring all referenced screens/components exist in app
- [x] 3.2 Provide warning if new scenario lacks corresponding UI workflow

## Technical Design

### Scenario JSON Example
```jsonc
{
  "id": "inventory-order",
  "name": "Check Inventory & Place Order",
  "description": "Verifies stock levels and creates a purchase order for low items.",
  "pims": ["cornerstone", "avimark"],
  "steps": [
    { "screen": "inventory", "action": "navigate" },
    { "selector": "input#search", "action": "type", "value": "Amoxicillin" },
    { "selector": "button#order", "action": "click" }
  ],
  "expectedResult": "Purchase order saved and visible in Orders History",
  "enabled": true
}
```

### Validation Routine
```ts
function validateScenario(scn: Scenario): ValidationIssue[] {
  // ensure referenced screens exist
  // ensure selectors are non-empty CSS strings
  // verify expectedResult is described
}
```

## Success Criteria
- Non-dev user can add new scenario in under 2 minutes
- Existing tests run unchanged after migration
- Disabling a scenario removes it from selector instantly
- Validation catches 95% of invalid selectors before runtime

## Risks and Mitigations
- **Scenario bloat** leading to long test runs → add tags + multi-select filter to limit active set
- **Inconsistent workflows across PIMS** → `Scenario` schema includes required PIMS list; skip if not active
- **Complex step definitions** → keep v1 simple; revisit programmable steps later

## Implementation Notes

### Completed Features (All Phases)
1. **ScenarioService.js** - Full CRUD operations with IndexedDB persistence
   - getAllScenarios, getEnabledScenarios, saveScenario, deleteScenario
   - Built-in validation of scenario structure
   - Migration script to seed existing 10 scenarios

2. **ScenarioSelector.jsx** - Dynamic scenario selection component
   - Fetches enabled scenarios from IndexedDB
   - Add scenario button integration
   - Auto-selects first scenario if current is invalid

3. **ScenarioEditor.jsx** - Full-featured scenario authoring interface
   - Form-driven UI for all scenario fields
   - Success criteria builder with URL and selector types
   - PIMS compatibility selection
   - Real-time validation with warnings
   - Enable/disable toggle

4. **ScenarioManager.jsx** - Scenario management dashboard
   - List all scenarios with enable/disable toggles
   - Edit and delete functionality
   - Create new scenarios
   - Shows PIMS compatibility and tags

5. **ScenarioValidationService.js** - Comprehensive validation
   - Validates CSS selectors and URL patterns
   - Checks for known screens in the app
   - Provides warnings for potential issues
   - Lists available screens for reference

6. **TestManager Integration**
   - Replaced hard-coded scenario list with dynamic selector
   - Added "Manage Scenarios" button
   - Modal view for scenario management
   - Automatic migration on startup

### Key Achievements
- ✅ Non-developers can create/edit scenarios through UI
- ✅ Scenarios persist in browser storage (IndexedDB)
- ✅ Validation prevents common errors
- ✅ Enable/disable functionality for unstable scenarios
- ✅ PIMS compatibility filtering ready (though not yet integrated with PIMS context)
- ✅ Migration preserves all existing test scenarios

## Future Considerations
- Cloud-hosted shared scenario library
- Versioning & git backing for scenarios
- Parameterised scenarios (e.g., random patient data)
- Integration with PIMS context for automatic filtering
- Export/import scenario sets
- Scenario templates for common workflows 