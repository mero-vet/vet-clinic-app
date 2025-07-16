# PRD: Scheduling System Fix

Current Status: IN PROGRESS
Next Action Item: Fix critical runtime errors causing blank pages
Blocking Issues: Missing null checks and error boundaries

## Key Files and Components

### Core Implementation Files
- `src/screens/SchedulingScreen.jsx`
  - Main scheduling interface with calendar view
  - Contains critical config access errors (lines 141, 278)
  - Uses deprecated prompt() for user input
- `src/context/SchedulingContext.jsx`
  - State management for appointments
  - Silent error handling masking initialization issues
  - Performance concerns with appointment generation
- `src/components/AppointmentScheduler/AppointmentForm.jsx`
  - Appointment creation and editing form
  - Working properly but has console.log statements
- `src/components/AppointmentScheduler/AvailabilityGrid.jsx`
  - Visual availability display
  - Functioning correctly
- `src/services/SchedulingService.js`
  - Business logic layer
  - Working as designed

### Referenced Components
- `src/context/PIMSContext.jsx`
  - Provides config object that may be undefined
  - Critical dependency for SchedulingScreen
- `src/context/PatientContext.jsx`
  - Patient selection integration
  - Working correctly
- `src/components/PIMSScreenWrapper.jsx`
  - Layout wrapper expecting valid config
- `src/utils/appointmentRules.js`
  - Appointment configuration
  - Working correctly

### New Files to Create
- `src/components/ErrorBoundary.jsx`
  - Generic error boundary component
  - Prevents blank pages on component errors
- `src/components/AppointmentScheduler/AppointmentDialogs.jsx`
  - Replace prompt() calls with proper modals
  - Better UX and error handling

## Objective

Fix the broken scheduling system that currently shows blank pages due to runtime errors, improve error handling to prevent future failures, and ensure all three main scheduling workflows (slot selection, new appointment, find available) work reliably across all PIMS configurations.

## Implementation Plan

### Phase 1: Critical Bug Fixes [URGENT]
- [ ] 1.1 Fix config access errors in SchedulingScreen
  - Add null checks for config object
  - Provide default values for missing properties
  - Test with all PIMS configurations
  - Dependencies: none
- [ ] 1.2 Add error boundary wrapper
  - Create reusable ErrorBoundary component
  - Wrap SchedulingScreen with error boundary
  - Display meaningful error messages
  - Dependencies: none
- [ ] 1.3 Fix provider lookup issues
  - Add defensive coding for provider searches
  - Handle empty provider lists gracefully
  - Validate selectedProvider state
  - Dependencies: 1.1 must be completed

### Phase 2: User Input Improvements
- [ ] 2.1 Replace prompt() dialogs
  - Create proper modal components
  - Implement cancellation confirmation dialog
  - Add confirmation method selector modal
  - Dependencies: Phase 1 completed
- [ ] 2.2 Add loading states
  - Show loading spinner during initialization
  - Handle async data loading properly
  - Prevent interaction during loading
  - Dependencies: none
- [ ] 2.3 Improve error messaging
  - Replace silent failures with user notifications
  - Log errors for debugging
  - Add retry mechanisms where appropriate
  - Dependencies: 2.1 must be completed

### Phase 3: Workflow Validation
- [ ] 3.1 Test slot selection workflow
  - Click on available slot → show appointment form
  - Click on booked slot → show appointment details
  - Verify all appointment actions work
  - Dependencies: Phase 2 completed
- [ ] 3.2 Test new appointment workflow
  - New Appointment button → blank form
  - Verify patient search works
  - Test appointment creation
  - Dependencies: 3.1 must be completed
- [ ] 3.3 Test find available workflow
  - Find Available button functionality
  - Available slots display
  - Slot selection from suggestions
  - Dependencies: 3.2 must be completed

### Phase 4: Performance Optimization
- [ ] 4.1 Optimize appointment generation
  - Reduce initial appointment count
  - Implement lazy loading for appointments
  - Cache appointment data appropriately
  - Dependencies: Phase 3 completed
- [ ] 4.2 Memory leak prevention
  - Clean up event listeners
  - Implement proper component unmounting
  - Monitor memory usage
  - Dependencies: 4.1 must be completed

## Implementation Notes

### Implementation Note [Phase 1.1]
The primary issue causing blank pages is unsafe access to the config object from PIMSContext. The SchedulingScreen assumes config.name and config.screenLabels are always defined, but they may be undefined during initialization or in certain routing scenarios.

### Implementation Note [Phase 1.2]
Error boundaries are React's way of handling JavaScript errors in component trees. Without them, a single error can crash the entire application, resulting in a blank page.

## Technical Design

### Error Handling Strategy
```javascript
// Safe config access pattern
const safeConfig = {
  name: config?.name || 'cornerstone',
  screenLabels: {
    scheduler: config?.screenLabels?.scheduler || 'Scheduler',
    ...config?.screenLabels
  }
};

// Error boundary implementation
class SchedulingErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Scheduling error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <SchedulingErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Modal Dialog Pattern
```javascript
// Replace prompt() with proper modals
const [showCancelDialog, setShowCancelDialog] = useState(false);
const [cancelReason, setCancelReason] = useState('');

// Instead of: const reason = prompt('Cancellation reason:');
// Use: setShowCancelDialog(true);
```

### Loading State Management
```javascript
const [isLoading, setIsLoading] = useState(true);
const [loadError, setLoadError] = useState(null);

useEffect(() => {
  try {
    // Initialize data
    setIsLoading(false);
  } catch (error) {
    setLoadError(error);
    setIsLoading(false);
  }
}, []);
```

## Success Criteria

- Zero blank page occurrences in scheduling screen
- All three main workflows functioning correctly
- Error messages displayed for user actions that fail
- No console errors during normal operation
- Page load time under 2 seconds
- Memory usage stable over extended use

## Risks and Mitigations

### Technical Risks
- **Config initialization race conditions**: Use default values and loading states
- **Provider data inconsistency**: Implement data validation and fallbacks
- **Browser compatibility with modals**: Test across different browsers

### Integration Risks
- **PIMS-specific variations**: Test with all PIMS configurations
- **Context provider dependencies**: Ensure proper provider nesting
- **Route parameter handling**: Validate route params before use

### User Experience Risks
- **Modal fatigue**: Keep modals minimal and intuitive
- **Lost user input**: Implement confirmation before destructive actions
- **Performance perception**: Add loading indicators for all async operations

## Future Considerations

- Implement proper state management (Redux/Zustand)
- Add comprehensive error tracking (Sentry integration)
- Create unit tests for scheduling components
- Add E2E tests for critical workflows
- Implement offline capability with sync
- Add keyboard shortcuts for power users
- Create scheduling analytics dashboard
- Implement drag-and-drop improvements
- Add recurring appointment templates
- Create appointment conflict resolution UI