# PRD-18: Computer Use Agent Testing Optimization

## Current Status Block

**Status**: DRAFT  
**Last Updated**: 2025-07-16  
**Implementation Date**: TBD  
**Type**: Agent Testing Optimization  
**Complexity**: Low-Medium  
**Estimated Effort**: 15-20 developer days  

## Overview

This PRD focuses on optimizing the veterinary clinic sandbox application specifically for computer use agent testing. The goal is to improve element targeting, interaction reliability, and test stability without adding new features. All improvements are frontend-only, maintaining the sandbox nature of the app while making it more reliable for automated testing.

## Problem Statement

Current computer use agents experience failures when testing the application due to:
- Missing or non-unique element identifiers
- Inconsistent ARIA labels across similar components  
- Ambiguous clickable elements (divs acting as buttons)
- Missing loading state indicators causing timing issues
- Inconsistent error states that agents cannot detect

## Key Areas for Agent Testing Optimization

### 1. **Element Identification & Targeting** (Critical)
- Add unique IDs to all interactive elements
- Implement consistent data-testid attributes
- Replace div-based buttons with semantic HTML
- Add proper ARIA labels for form inputs

### 2. **State Detection & Timing** (Critical)
- Add explicit loading indicators agents can detect
- Implement data attributes for component states
- Add ARIA live regions for dynamic updates
- Standardize error message patterns

### 3. **Form Interaction Reliability** (High)
- Consistent form field identification
- Predictable validation behavior
- Clear required field indicators
- Stable focus management

## Implementation Phases

### Phase 1: Element Identification (Days 1-5)

**Effort**: 5 developer days  
**Risk**: Low  
**Impact**: High  

**1.1 Add Unique Identifiers to All Interactive Elements**

Standardized naming convention: `{component}-{element}-{context}`

Examples:
```javascript
// Before
<input type="text" name="weight" value={weight} />

// After
<input 
  type="text"
  id="checkin-weight-input"
  name="weight"
  value={weight}
  data-testid="patient-weight-field"
  aria-label="Patient weight in pounds"
  aria-required="true"
/>
```

**Files to Update** (13 files):
- `src/components/CheckInScreen.tsx` - 8 form inputs, 3 buttons
- `src/components/EnhancedCheckInScreen.tsx` - 6 inputs, 5 buttons  
- `src/components/scheduling/AppointmentForm.jsx` - 7 inputs, 2 buttons
- `src/components/scheduling/CalendarView.jsx` - 15+ appointment slots
- `src/components/PatientSearchBar.tsx` - 1 input, 1 button
- `src/components/CheckInModal.tsx` - 5 inputs, 2 buttons
- `src/components/NewPatientModal.tsx` - 8 inputs, 2 buttons
- `src/components/PIMSLayout.tsx` - 4 navigation links
- `src/components/Navigation.tsx` - 6 navigation items
- `src/components/scheduling/SchedulingDashboard.jsx` - 5 control buttons
- `src/components/WelcomeScreen.tsx` - 4 PIMS selection buttons
- `src/components/PainAssessmentModal.tsx` - 10 inputs, 2 buttons
- `src/components/OwnershipTransferModal.tsx` - 3 inputs, 2 buttons

**1.2 Convert Non-Semantic Elements**

Replace all clickable divs with proper buttons:
```javascript
// Before  
<div className="appointment-slot" onClick={handleClick}>
  {slot.time}
</div>

// After
<button 
  className="appointment-slot"
  id={`slot-${slot.date}-${slot.time}`}
  data-testid="appointment-slot"
  data-time={slot.time}
  data-date={slot.date}
  data-available={slot.available}
  onClick={handleClick}
  aria-label={`Book appointment at ${slot.time} on ${slot.date}`}
>
  {slot.time}
</button>
```

### Phase 2: State Detection (Days 6-9)

**Effort**: 4 developer days  
**Risk**: Low  
**Impact**: High  

**2.1 Implement Loading State Detection**

Create standardized loading component:
```javascript
// src/components/common/LoadingState.jsx
export const LoadingState = ({ loading, children, testId }) => {
  return (
    <div 
      data-loading={loading} 
      data-testid={testId}
      aria-busy={loading}
    >
      {loading && (
        <div 
          className="loading-indicator" 
          role="status"
          aria-live="polite"
        >
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {children}
    </div>
  );
};
```

**Files to Update** (8 files):
- `src/components/scheduling/AppointmentForm.jsx` - Wrap save operation
- `src/components/CheckInScreen.tsx` - Wrap check-in submission
- `src/components/EnhancedCheckInScreen.tsx` - Wrap form submission
- `src/components/PatientSearchBar.tsx` - Wrap search operation
- `src/components/scheduling/CalendarView.jsx` - Wrap calendar loading
- `src/components/scheduling/SchedulingDashboard.jsx` - Wrap data fetch
- `src/components/CheckInModal.tsx` - Wrap submission
- `src/components/NewPatientModal.tsx` - Wrap creation

**2.2 Standardize Error States**

Implement consistent error display:
```javascript
// src/components/common/ErrorState.jsx
export const ErrorState = ({ error, fieldId, testId }) => {
  if (!error) return null;
  
  return (
    <div 
      className="error-state"
      data-error="true"
      data-testid={testId || `${fieldId}-error`}
      role="alert"
      aria-live="assertive"
    >
      <span className="error-icon" aria-hidden="true">⚠</span>
      <span id={`${fieldId}-error-message`}>{error}</span>
    </div>
  );
};
```

### Phase 3: Form Reliability (Days 10-15)

**Effort**: 6 developer days  
**Risk**: Medium (requires careful testing)  
**Impact**: High  

**3.1 Standardize Form Fields**

Create consistent form field wrapper:
```javascript
// src/components/common/FormField.jsx
export const FormField = ({ 
  id,
  label,
  type = 'text',
  value,
  onChange,
  required,
  error,
  testId,
  helpText
}) => {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="form-field" data-field={fieldId}>
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && (
          <span className="required-indicator" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${fieldId}-error-message` : 
          helpText ? `${fieldId}-help` : undefined
        }
        data-testid={testId || fieldId}
        className={`form-input ${error ? 'error' : ''}`}
      />
      
      {helpText && (
        <span id={`${fieldId}-help`} className="help-text">
          {helpText}
        </span>
      )}
      
      <ErrorState error={error} fieldId={fieldId} />
    </div>
  );
};
```

**Files to Refactor** (6 files):
- `src/components/CheckInScreen.tsx` - 8 form fields
- `src/components/EnhancedCheckInScreen.tsx` - 6 form fields
- `src/components/scheduling/AppointmentForm.jsx` - 7 form fields
- `src/components/NewPatientModal.tsx` - 8 form fields
- `src/components/CheckInModal.tsx` - 5 form fields
- `src/components/PainAssessmentModal.tsx` - 10 form fields

**3.2 Implement Focus Management**

Add focus trap for modals:
```javascript
// src/hooks/useFocusTrap.js
export const useFocusTrap = (isActive, containerRef) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Set initial focus
    firstElement?.focus();
    
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTab);
    return () => container.removeEventListener('keydown', handleTab);
  }, [isActive, containerRef]);
};
```

## Success Criteria

### Measurable Metrics
1. **100% of interactive elements have unique IDs** - Automated scan shows no duplicate IDs
2. **100% of forms use semantic HTML** - No clickable divs remain
3. **All async operations show loading states** - data-loading attribute present
4. **Zero ambiguous click targets** - All buttons have descriptive labels
5. **Form submission success rate > 95%** in agent tests

### Agent Test Scenarios
Verify these specific scenarios work reliably:
1. Agent can check in a patient by searching and selecting from results
2. Agent can create a new appointment with all required fields
3. Agent can navigate between PIMS themes without errors
4. Agent can detect and wait for loading states to complete
5. Agent can identify and respond to error messages

## Testing Approach

### Automated Verification
```javascript
// scripts/verify-agent-readiness.js
const verifyAgentReadiness = () => {
  // Check for unique IDs
  const ids = document.querySelectorAll('[id]');
  const idMap = new Map();
  ids.forEach(el => {
    if (idMap.has(el.id)) {
      console.error(`Duplicate ID found: ${el.id}`);
    }
    idMap.set(el.id, el);
  });
  
  // Check for semantic HTML
  const clickableDivs = document.querySelectorAll('div[onclick]');
  if (clickableDivs.length > 0) {
    console.error(`Found ${clickableDivs.length} clickable divs`);
  }
  
  // Check for missing labels
  const inputs = document.querySelectorAll('input:not([type="hidden"])');
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label') && !input.labels.length) {
      console.error(`Input missing label: ${input.name || input.id}`);
    }
  });
};
```

### Manual Testing Checklist
- [ ] Run automated verification script - no errors
- [ ] Test tab navigation through all forms
- [ ] Verify loading states appear during async operations
- [ ] Confirm error messages are announced to screen readers
- [ ] Test with computer use agent on key workflows

## Risk Mitigation

### Identified Risks
1. **Breaking existing functionality** 
   - Mitigation: Comprehensive testing after each component update
   - Rollback: Git revert individual component changes

2. **ID naming conflicts**
   - Mitigation: Use component-prefixed naming convention
   - Prevention: Run duplicate ID checker in CI

3. **Performance impact from additional attributes**
   - Mitigation: Measure bundle size before/after
   - Acceptable increase: < 5KB gzipped

### Rollback Strategy
Each phase can be rolled back independently:
1. Phase 1: Revert ID/testid additions (low risk)
2. Phase 2: Revert loading/error components (medium risk)
3. Phase 3: Revert form standardization (use feature flag)

Feature flag for gradual rollout:
```javascript
// src/config/features.js
export const features = {
  standardizedForms: process.env.REACT_APP_STANDARDIZED_FORMS === 'true'
};

// Usage
import { FormField } from './common/FormField';
import { features } from '../config/features';

const MyComponent = () => {
  if (features.standardizedForms) {
    return <FormField {...props} />;
  }
  // Legacy form code
};
```

## Implementation Notes

### Do's
- ✅ Use semantic HTML elements
- ✅ Add unique, descriptive IDs
- ✅ Include ARIA labels for all inputs
- ✅ Make loading states detectable
- ✅ Test with actual computer use agents

### Don'ts
- ❌ Add animations or transitions
- ❌ Change visual design
- ❌ Add new features
- ❌ Break existing functionality
- ❌ Create overly complex components

### Code Style Guidelines
- IDs: kebab-case with component prefix
- Test IDs: descriptive, lowercase with hyphens
- ARIA labels: Clear, concise descriptions
- Data attributes: boolean or simple strings

## Timeline & Dependencies

### Week 1 (Days 1-5)
- Phase 1: Element Identification
- No dependencies
- Can be tested immediately

### Week 2 (Days 6-10)
- Phase 2: State Detection
- Depends on Phase 1 completion
- Requires loading state component creation first

### Week 3 (Days 11-15)
- Phase 3: Form Reliability
- Depends on Phase 2 components
- Feature flag setup on Day 11

### Buffer (Days 16-20)
- Comprehensive testing
- Agent test validation
- Bug fixes and adjustments

## Summary

This focused PRD addresses specific computer use agent testing failures by improving element identification, state detection, and form reliability. The implementation is low-risk, with clear rollback strategies and measurable success criteria. By focusing only on agent testing needs, we avoid scope creep while delivering maximum value for automated testing scenarios.