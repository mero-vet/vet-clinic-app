# PRD-17: Scheduling System Frontend-Only Fix

## Current Status Block

**Status**: IN PROGRESS  
**Last Updated**: 2025-07-16  
**Type**: Frontend Sandbox Fix  
**Complexity**: Simple  

## Overview

This PRD focuses exclusively on fixing the broken scheduling system in the vet clinic sandbox application. This is a **frontend-only** implementation with no backend, database, or authentication requirements. All data is hardcoded and the app serves as a demonstration/prototype.

## Key Issues to Fix

1. **Config Access Errors**: Undefined config properties causing blank pages
2. **Browser Prompts**: Replace `prompt()` calls with proper modal dialogs
3. **Missing Error Boundaries**: Add error handling to prevent crashes
4. **Provider Lookup Failures**: Fix provider data access with hardcoded fallbacks

## Existing Files to Fix

### Core Scheduling Components
- `src/screens/SchedulingScreen.jsx` - Main scheduling interface (remove auth dependencies)
- `src/components/AppointmentScheduler/` - Scheduling UI components
- `src/services/SchedulingService.js` - Simplify to use hardcoded data
- `src/context/SchedulingContext.jsx` - State management (localStorage only)

### Supporting Files
- `src/config/pimsConfig.js` - Fix undefined access patterns
- `src/config/mockProviders.js` - Ensure fallback data always available

## Implementation Plan

### Phase 1: Fix Critical Errors (Immediate)

**1.1 Fix Config Access Errors**
```javascript
// Before: Causes errors when config properties are undefined
const providers = config.providers || [];

// After: Safe access with defaults
const providers = config?.providers || FALLBACK_PROVIDERS;
```

**1.2 Add Error Boundaries**
- Create simple `ErrorBoundary.jsx` component
- Wrap SchedulingScreen and sub-components
- Show user-friendly error messages

**1.3 Fix Provider Lookups**
- Add hardcoded provider data fallbacks
- Remove database queries
- Use mock data arrays

### Phase 2: Replace Browser Prompts (Day 1)

**2.1 Create Modal Components**
- `AppointmentCancelModal.jsx` - Replace cancel prompt
- `AppointmentRescheduleModal.jsx` - Replace reschedule prompt
- `ConfirmationModal.jsx` - Generic confirmation dialog

**2.2 Update Interaction Patterns**
- Replace all `window.prompt()` calls
- Use state-driven modals
- Add proper form validation

### Phase 3: Simplify Data Layer (Day 1-2)

**3.1 Hardcode All Data**
```javascript
// Mock appointment data
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patientName: 'Fluffy',
    ownerName: 'John Doe',
    date: '2025-07-17',
    time: '09:00',
    provider: 'Dr. Smith',
    type: 'Checkup',
    status: 'scheduled'
  },
  // ... more appointments
];

// Mock providers
const MOCK_PROVIDERS = [
  { id: '1', name: 'Dr. Smith', type: 'Veterinarian' },
  { id: '2', name: 'Dr. Johnson', type: 'Veterinarian' },
  { id: '3', name: 'Tech Sarah', type: 'Technician' }
];
```

**3.2 Use localStorage for Demo Persistence**
- Store appointments in localStorage
- No server calls
- Clear data on demo reset

### Phase 4: Ensure Core Workflows Work (Day 2)

**4.1 Test Slot Selection Workflow**
- User clicks calendar slot
- Modal appears with appointment form
- Appointment saves to localStorage
- Calendar updates immediately

**4.2 Test New Appointment Workflow**
- User clicks "New Appointment"
- Form appears with all fields
- Validation works properly
- Saves and displays correctly

**4.3 Test Find Available Workflow**
- User selects criteria
- System shows available slots
- User can book from results
- Updates reflect immediately

## Technical Approach

### Data Structure (Frontend Only)
```javascript
// All data stored in component state and localStorage
const SchedulingContext = {
  appointments: [], // Array of appointment objects
  providers: [],    // Array of provider objects
  selectedDate: new Date(),
  viewMode: 'day', // day, week, month
  
  // Methods
  addAppointment: (appointment) => {
    // Add to state
    // Save to localStorage
  },
  updateAppointment: (id, updates) => {
    // Update state
    // Save to localStorage
  },
  deleteAppointment: (id) => {
    // Remove from state
    // Update localStorage
  }
};
```

### Error Handling Pattern
```javascript
// Simple error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Modal Pattern
```javascript
// Replace prompt() with state-driven modals
const [showCancelModal, setShowCancelModal] = useState(false);
const [appointmentToCancel, setAppointmentToCancel] = useState(null);

const handleCancelClick = (appointment) => {
  setAppointmentToCancel(appointment);
  setShowCancelModal(true);
};

// In render
{showCancelModal && (
  <CancelModal
    appointment={appointmentToCancel}
    onConfirm={handleCancelConfirm}
    onCancel={() => setShowCancelModal(false)}
  />
)}
```

## What We're NOT Doing

- ❌ No Firebase or any backend
- ❌ No authentication system
- ❌ No real database
- ❌ No API calls
- ❌ No user accounts
- ❌ No production features
- ❌ No complex state management (Redux, etc.)
- ❌ No real-time sync

## Success Criteria

1. **No Runtime Errors**: App loads without errors
2. **No Browser Prompts**: All interactions use proper UI components
3. **Data Persistence**: Appointments survive page refresh (localStorage)
4. **All Workflows Function**: Three main workflows work correctly
5. **Clean Error Handling**: Errors show user-friendly messages

## Testing Approach

Simple manual testing checklist:
- [ ] App loads without errors
- [ ] Can create new appointment
- [ ] Can view appointments on calendar
- [ ] Can cancel appointment (with modal)
- [ ] Can reschedule appointment (with modal)
- [ ] Can find available slots
- [ ] Data persists on refresh
- [ ] Errors don't crash the app

## Files to Create/Modify

### New Files
1. `src/components/ErrorBoundary.jsx`
2. `src/components/Modals/CancelModal.jsx`
3. `src/components/Modals/RescheduleModal.jsx`
4. `src/components/Modals/ConfirmationModal.jsx`
5. `src/data/mockData.js` (consolidated mock data)

### Files to Modify
1. `src/screens/SchedulingScreen.jsx` - Remove auth, fix config access
2. `src/services/SchedulingService.js` - Use mock data only
3. `src/context/SchedulingContext.jsx` - Simplify to localStorage
4. `src/config/pimsConfig.js` - Add safe defaults
5. `src/App.jsx` - Add error boundary wrapper

## Implementation Notes

This is a focused fix to make the sandbox scheduling system functional. The goal is a working demo that:
- Shows the scheduling UI
- Allows basic CRUD operations
- Persists data locally
- Handles errors gracefully
- Uses proper React patterns (no browser prompts)

Keep it simple, keep it working.