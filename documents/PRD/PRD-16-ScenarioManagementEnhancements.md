# PRD-16: Scenario Management Enhancements

Current Status: PLANNED
Next Action Item: Define authoring UI wireframes
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
- [ ] 1.1 Define `Scenario` JSON schema (id, name, description, steps, tags, enabled)
- [ ] 1.2 Implement `ScenarioService` with IndexedDB persistence
- [ ] 1.3 Provide migration script to seed existing 10 scenarios

### Phase 2: UI Integration
- [ ] 2.1 Replace hard-coded list in `ScenarioSelector` with reactive fetch
- [ ] 2.2 Add **"Add Scenario"** button leading to `ScenarioEditor`
- [ ] 2.3 Allow enable/disable switch to hide unstable scenarios

### Phase 3: Validation & Workflow Mapping
- [ ] 3.1 Add pre-test checklist ensuring all referenced screens/components exist in app
- [ ] 3.2 Provide warning if new scenario lacks corresponding UI workflow

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

## Future Considerations
- Cloud-hosted shared scenario library
- Versioning & git backing for scenarios
- Parameterised scenarios (e.g., random patient data) 