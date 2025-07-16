/**
 * Verification script to check if the app is ready for computer use agent testing
 * Run this script in the browser console to verify all agent optimization requirements
 */

const verifyAgentReadiness = () => {
  console.log('🔍 Starting Agent Readiness Verification...\n');
  
  let totalChecks = 0;
  let passedChecks = 0;
  let warnings = [];
  let errors = [];
  
  // Helper function to log results
  const logResult = (test, passed, details = '') => {
    totalChecks++;
    if (passed) {
      passedChecks++;
      console.log(`✅ ${test}`);
      if (details) console.log(`   ${details}`);
    } else {
      console.error(`❌ ${test}`);
      if (details) console.error(`   ${details}`);
      errors.push({ test, details });
    }
  };
  
  // Helper function to log warnings
  const logWarning = (test, details = '') => {
    console.warn(`⚠️  ${test}`);
    if (details) console.warn(`   ${details}`);
    warnings.push({ test, details });
  };
  
  console.log('=== 1. Checking for Unique IDs ===');
  
  // Check for duplicate IDs
  const checkDuplicateIds = () => {
    const ids = document.querySelectorAll('[id]');
    const idMap = new Map();
    let hasDuplicates = false;
    
    ids.forEach(el => {
      const id = el.id;
      if (idMap.has(id)) {
        hasDuplicates = true;
        logWarning(`Duplicate ID found: "${id}"`, 
          `Elements: ${idMap.get(id).tagName} and ${el.tagName}`);
      } else {
        idMap.set(id, el);
      }
    });
    
    logResult('No duplicate IDs', !hasDuplicates, 
      `Checked ${ids.length} elements with IDs`);
  };
  
  checkDuplicateIds();
  
  console.log('\n=== 2. Checking Interactive Elements ===');
  
  // Check form inputs have labels
  const checkInputLabels = () => {
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    let unlabeledCount = 0;
    
    inputs.forEach(input => {
      const hasLabel = input.labels?.length > 0 || 
                      input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby');
      
      if (!hasLabel) {
        unlabeledCount++;
        logWarning(`Input missing label`, 
          `Type: ${input.type || 'text'}, Name: ${input.name || 'unnamed'}, ID: ${input.id || 'no-id'}`);
      }
    });
    
    logResult('All inputs have labels', unlabeledCount === 0, 
      `${inputs.length - unlabeledCount}/${inputs.length} inputs properly labeled`);
  };
  
  checkInputLabels();
  
  // Check for test IDs
  const checkTestIds = () => {
    const testIdElements = document.querySelectorAll('[data-testid]');
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, a[href]');
    const interactiveWithTestId = Array.from(interactiveElements).filter(el => 
      el.hasAttribute('data-testid')
    );
    
    logResult('Interactive elements have test IDs', 
      interactiveWithTestId.length > 0,
      `${interactiveWithTestId.length}/${interactiveElements.length} interactive elements have data-testid`);
  };
  
  checkTestIds();
  
  console.log('\n=== 3. Checking Semantic HTML ===');
  
  // Check for clickable divs
  const checkClickableDivs = () => {
    const clickableDivs = document.querySelectorAll('div[onclick]');
    const divsWithClickListeners = Array.from(document.querySelectorAll('div')).filter(div => {
      // Check if div has cursor:pointer style (common indicator of clickable element)
      const style = window.getComputedStyle(div);
      return style.cursor === 'pointer' && !div.querySelector('button');
    });
    
    if (clickableDivs.length > 0) {
      logWarning(`Found ${clickableDivs.length} divs with onclick attribute`, 
        'Consider converting to buttons');
    }
    
    logResult('No clickable divs with onclick', clickableDivs.length === 0);
  };
  
  checkClickableDivs();
  
  // Check buttons are actual buttons
  const checkButtonElements = () => {
    const buttons = document.querySelectorAll('button');
    const linksAsButtons = document.querySelectorAll('a[role="button"]');
    
    logResult('Using semantic button elements', buttons.length > 0,
      `Found ${buttons.length} <button> elements and ${linksAsButtons.length} links with role="button"`);
  };
  
  checkButtonElements();
  
  console.log('\n=== 4. Checking ARIA Attributes ===');
  
  // Check ARIA attributes
  const checkAriaAttributes = () => {
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-describedby], [aria-labelledby]');
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    const requiredWithAria = Array.from(requiredInputs).filter(el => 
      el.getAttribute('aria-required') === 'true'
    );
    
    logResult('ARIA attributes present', elementsWithAria.length > 0,
      `Found ${elementsWithAria.length} elements with ARIA attributes`);
    
    if (requiredInputs.length > 0) {
      logResult('Required fields have aria-required', 
        requiredWithAria.length === requiredInputs.length,
        `${requiredWithAria.length}/${requiredInputs.length} required fields have aria-required="true"`);
    }
  };
  
  checkAriaAttributes();
  
  console.log('\n=== 5. Checking Loading States ===');
  
  // Check for loading indicators
  const checkLoadingStates = () => {
    const loadingElements = document.querySelectorAll('[data-loading], [aria-busy]');
    const spinners = document.querySelectorAll('.spinner, .loading-indicator, [class*="loading"]');
    
    logResult('Loading state indicators exist', 
      loadingElements.length > 0 || spinners.length > 0,
      `Found ${loadingElements.length} elements with loading attributes and ${spinners.length} spinner elements`);
  };
  
  checkLoadingStates();
  
  console.log('\n=== 6. Checking Error States ===');
  
  // Check for error indicators
  const checkErrorStates = () => {
    const errorElements = document.querySelectorAll('[data-error], [aria-invalid="true"], .error-state');
    const alertElements = document.querySelectorAll('[role="alert"]');
    
    logResult('Error state patterns found', 
      errorElements.length > 0 || alertElements.length > 0,
      `Found ${errorElements.length} error elements and ${alertElements.length} alert elements`);
  };
  
  checkErrorStates();
  
  console.log('\n=== 7. Checking Focus Management ===');
  
  // Check for focus indicators
  const checkFocusManagement = () => {
    // Create a temporary button to test focus styles
    const testButton = document.createElement('button');
    testButton.textContent = 'Test';
    testButton.style.position = 'absolute';
    testButton.style.left = '-9999px';
    document.body.appendChild(testButton);
    testButton.focus();
    
    const focusStyle = window.getComputedStyle(testButton, ':focus');
    const hasFocusStyles = focusStyle.outline !== 'none' || 
                          focusStyle.boxShadow !== 'none' ||
                          focusStyle.border !== focusStyle.border;
    
    document.body.removeChild(testButton);
    
    logResult('Focus indicators present', hasFocusStyles,
      'Elements show visual focus indicators');
  };
  
  checkFocusManagement();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`Passed: ${passedChecks} (${Math.round(passedChecks/totalChecks * 100)}%)`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Failed Checks:');
    errors.forEach(error => {
      console.error(`  - ${error.test}: ${error.details}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => {
      console.warn(`  - ${warning.test}: ${warning.details}`);
    });
  }
  
  const readinessScore = Math.round(passedChecks/totalChecks * 100);
  console.log('\n' + '='.repeat(50));
  if (readinessScore >= 90) {
    console.log('✅ App is READY for computer use agent testing!');
  } else if (readinessScore >= 70) {
    console.log('⚠️  App is MOSTLY READY but could use improvements');
  } else {
    console.log('❌ App needs more work before agent testing');
  }
  console.log('='.repeat(50));
  
  return {
    totalChecks,
    passedChecks,
    warnings,
    errors,
    readinessScore
  };
};

// Auto-run if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyAgentReadiness);
  } else {
    verifyAgentReadiness();
  }
}

// Export for use in Node.js or module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = verifyAgentReadiness;
}