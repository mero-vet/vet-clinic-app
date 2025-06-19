// Available screens in the application
const AVAILABLE_SCREENS = [
  'create-client',
  'scheduler',
  'checkin',
  'records',
  'services',
  'invoices',
  'pharmacy',
  'communications',
  'reports',
  'inventory',
  'diagnostics',
  'doctor-exam'
];

// Available components/selectors that are commonly used
const COMMON_SELECTORS = {
  // Forms
  'form': 'Generic form element',
  'input': 'Input field',
  'button': 'Button element',
  'select': 'Dropdown selector',
  'textarea': 'Text area',
  
  // Tables
  'table': 'Data table',
  'table.windows-table': 'Windows-styled table',
  'table.services-table': 'Services table',
  
  // Layout elements
  '.title-bar-text': 'Window title bar',
  '.windows-button': 'Windows-styled button',
  '.patient-checkin-grid': 'Patient check-in grid',
  '.patient-checkin-column': 'Patient check-in column',
  
  // Common elements
  'h1': 'Main heading',
  'h2': 'Subheading',
  'h3': 'Section heading',
  'fieldset': 'Form fieldset',
  'legend': 'Fieldset legend'
};

class ScenarioValidationService {
  validateScenario(scenario) {
    const issues = [];
    
    // Validate success criteria
    if (scenario.successCriteria && Array.isArray(scenario.successCriteria)) {
      scenario.successCriteria.forEach((criteria, index) => {
        const criteriaIssues = this.validateSuccessCriteria(criteria, index);
        issues.push(...criteriaIssues);
      });
    }
    
    // Validate referenced screens in success criteria
    const screenReferences = this.extractScreenReferences(scenario);
    screenReferences.forEach(screen => {
      if (!this.isValidScreen(screen)) {
        issues.push({
          type: 'warning',
          field: 'successCriteria',
          message: `Unknown screen reference: "${screen}". Available screens: ${AVAILABLE_SCREENS.join(', ')}`
        });
      }
    });
    
    // Validate agent prompt
    if (scenario.agentPrompt) {
      const promptIssues = this.validateAgentPrompt(scenario.agentPrompt);
      issues.push(...promptIssues);
    }
    
    return issues;
  }
  
  validateSuccessCriteria(criteria, index) {
    const issues = [];
    
    if (criteria.type === 'selector') {
      if (!criteria.selector) {
        issues.push({
          type: 'error',
          field: `successCriteria[${index}].selector`,
          message: 'Selector is required for selector-type criteria'
        });
      } else {
        // Validate CSS selector syntax
        try {
          document.querySelector(criteria.selector);
        } catch {
          issues.push({
            type: 'error',
            field: `successCriteria[${index}].selector`,
            message: `Invalid CSS selector: "${criteria.selector}"`
          });
        }
        
        // Warn about potentially problematic selectors
        if (criteria.selector.includes(':nth-child') || criteria.selector.includes(':nth-of-type')) {
          issues.push({
            type: 'warning',
            field: `successCriteria[${index}].selector`,
            message: 'nth-child/nth-of-type selectors may be fragile and break easily'
          });
        }
      }
    }
    
    if (criteria.type === 'url-contains') {
      if (!criteria.value) {
        issues.push({
          type: 'error',
          field: `successCriteria[${index}].value`,
          message: 'URL value is required for url-contains criteria'
        });
      } else if (!criteria.value.startsWith('/')) {
        issues.push({
          type: 'warning',
          field: `successCriteria[${index}].value`,
          message: 'URL values should typically start with "/" for path matching'
        });
      }
    }
    
    return issues;
  }
  
  validateAgentPrompt(prompt) {
    const issues = [];
    
    if (prompt.length < 50) {
      issues.push({
        type: 'warning',
        field: 'agentPrompt',
        message: 'Agent prompt seems too short. Consider adding more context for better results.'
      });
    }
    
    if (!prompt.toLowerCase().includes('mero')) {
      issues.push({
        type: 'warning',
        field: 'agentPrompt',
        message: 'Agent prompt should address "Mero" as the AI agent name'
      });
    }
    
    return issues;
  }
  
  extractScreenReferences(scenario) {
    const screens = [];
    
    // Extract from URL success criteria
    if (scenario.successCriteria) {
      scenario.successCriteria.forEach(criteria => {
        if (criteria.type === 'url-contains' && criteria.value) {
          const match = criteria.value.match(/^\/([^/]+)/);
          if (match) {
            screens.push(match[1]);
          }
        }
      });
    }
    
    return [...new Set(screens)]; // Remove duplicates
  }
  
  isValidScreen(screen) {
    return AVAILABLE_SCREENS.includes(screen);
  }
  
  getAvailableScreens() {
    return [...AVAILABLE_SCREENS];
  }
  
  getCommonSelectors() {
    return { ...COMMON_SELECTORS };
  }
  
  // Check if scenario can run on current PIMS
  canRunOnPIMS(scenario, currentPIMS) {
    if (!scenario.pims || scenario.pims.length === 0) {
      return true; // No PIMS restriction means it runs on all
    }
    return scenario.pims.includes(currentPIMS);
  }
}

export default new ScenarioValidationService();