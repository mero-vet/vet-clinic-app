# Product Requirements Document: Multi-PIMS Simulation

## Overview
This PRD outlines the plan to enhance the Vet Clinic App by implementing the ability to switch between different Practice Information Management System (PIMS) simulations. This will allow our AI veterinary clinic assistant to be trained on multiple veterinary software interfaces, improving its versatility and effectiveness across different clinical environments.

## Current State
The application currently simulates a single PIMS (Cornerstone) with a specific UI/UX design and workflow. This limits training to one software system, while real veterinary practices use various PIMS platforms with different interfaces and workflows.

## Goals
- Create the ability to switch between five different PIMS simulations
- Implement unique UI/UX for each PIMS while maintaining a consistent data model
- Support training the AI agent on multiple software interfaces
- Allow seamless switching between PIMS for testing and training purposes
- Support the following PIMS platforms:
  1. Cornerstone (current)
  2. Avimark
  3. EasyVet
  4. IntraVet
  5. Covetrus Pulse

## Proposed Solution

### System Architecture

#### 1. PIMS Configuration Registry
Create a configuration system that defines the UI/UX elements, workflows, and terminology for each PIMS:

```javascript
const pimsConfigurations = {
  cornerstone: {
    name: "Cornerstone",
    theme: cornerstoneTheme,
    icons: cornerstoneIcons,
    screenLabels: {
      checkin: "Check-In/Out",
      scheduler: "Scheduler",
      // ...other screen mappings
    },
    terminology: {
      patient: "Patient",
      client: "Client",
      // ...other term mappings
    },
    // ...other PIMS-specific configurations
  },
  avimark: {
    // Avimark configuration
  },
  // ...other PIMS configurations
};
```

#### 2. ThemeProvider Component
Create a theme provider that applies the appropriate styling based on the selected PIMS:

```jsx
<PIMSThemeProvider pims={selectedPIMS}>
  <App />
</PIMSThemeProvider>
```

#### 3. PIMS Context
Implement a context provider that makes the current PIMS configuration available throughout the application:

```jsx
const PIMSContext = createContext();

export const PIMSProvider = ({ children }) => {
  const [currentPIMS, setCurrentPIMS] = useState('cornerstone');
  
  // Function to switch PIMS
  const switchPIMS = (pimsName) => {
    if (pimsConfigurations[pimsName]) {
      setCurrentPIMS(pimsName);
    }
  };
  
  return (
    <PIMSContext.Provider value={{ 
      currentPIMS, 
      switchPIMS,
      config: pimsConfigurations[currentPIMS] 
    }}>
      {children}
    </PIMSContext.Provider>
  );
};
```

#### 4. PIMS Selector Component
Create a UI component to change the active PIMS:

```jsx
const PIMSSelector = () => {
  const { currentPIMS, switchPIMS } = usePIMS();
  
  return (
    <div className="pims-selector">
      <select 
        value={currentPIMS}
        onChange={(e) => switchPIMS(e.target.value)}
      >
        <option value="cornerstone">Cornerstone</option>
        <option value="avimark">Avimark</option>
        <option value="easyvet">EasyVet</option>
        <option value="intravet">IntraVet</option>
        <option value="covetrus">Covetrus Pulse</option>
      </select>
    </div>
  );
};
```

### UI/UX Differentiation Between PIMS

#### Cornerstone (Current)
- Windows Classic theme
- Top menu bar with dropdown menus
- Icon bar for main navigation
- Blue and gray color scheme

#### Avimark
- Windows Modern theme
- Ribbon interface (like Microsoft Office)
- Side navigation tabs
- Red and white color scheme

#### EasyVet
- Web-based modern UI
- Card-based interface
- Bottom navigation bar
- Green and white color scheme

#### IntraVet
- Windows/Web hybrid interface
- Tree navigation on left side
- Tab-based workspaces
- Orange and blue color scheme

#### Covetrus Pulse
- Cloud-based modern SaaS interface
- Minimal, clean design
- Top navigation with mega-menus
- Purple and white color scheme

### Implementation Strategy

#### 1. Component Structure
Create a component hierarchy that separates layout from content:

```
/components
  /layouts
    /cornerstone
      CornerstoneLayout.jsx
    /avimark
      AvimarkLayout.jsx
    /easyvet
      EasyVetLayout.jsx
    // ...other layouts
  /screens
    /checkin
      CheckinContent.jsx  // Core functionality
    /scheduler
      SchedulerContent.jsx  // Core functionality
    // ...other screen content
```

#### 2. Styling System
Implement a flexible styling system using CSS-in-JS or CSS variables:

```jsx
// Example using CSS variables
const applyPIMSTheme = (pims) => {
  document.documentElement.style.setProperty('--primary-color', pims.colors.primary);
  document.documentElement.style.setProperty('--secondary-color', pims.colors.secondary);
  document.documentElement.style.setProperty('--font-family', pims.typography.fontFamily);
  // ...other theme variables
};
```

#### 3. Screen Mapping
Create a mapping system to connect generic functionality to PIMS-specific screens:

```jsx
const screenMap = {
  cornerstone: {
    checkin: CheckInScreen,
    scheduler: SchedulerScreen,
    // ...other screen mappings
  },
  avimark: {
    checkin: AvimarkCheckInScreen,
    scheduler: AvimarkSchedulerScreen,
    // ...other screen mappings
  },
  // ...other PIMS mappings
};

// In the router
const CurrentScreen = screenMap[currentPIMS][screenName];
```

## Detailed Implementation Checklist

### Phase 1: Research and Architecture Design (3 weeks)
- [x] **Week 1: PIMS Research & Analysis**
  - [x] Research UI/UX patterns of all 5 target PIMS platforms
  - [x] Document key features and workflows of each PIMS
  - [x] Create screenshots library of each PIMS for reference
  - [x] Identify common functionality across all systems
  - [x] Document terminology differences between systems

- [x] **Week 2: Architecture Design**
  - [x] Define configuration schema for PIMS registry
  - [x] Design theme system and style variables
  - [x] Create component abstraction plan
  - [x] Design layout switching mechanism
  - [x] Plan data flow between PIMS-agnostic and PIMS-specific components

- [x] **Week 3: Prototype & Proof of Concept**
  - [x] Create PIMSContext provider
  - [x] Build basic theme provider with CSS variables
  - [x] Develop simple PIMS selector component
  - [x] Implement basic layout switching for one screen
  - [x] Test proof of concept with two PIMS (Cornerstone + one other)

### Phase 2: Core Infrastructure Development (4 weeks)
- [x] **Week 4: Configuration System**
  - [x] Create cornerstone configuration in registry
  - [x] Create avimark configuration in registry
  - [x] Create easyvet configuration in registry
  - [x] Create intravet configuration in registry
  - [x] Create covetrus configuration in registry
  - [x] Implement configuration loading system

- [x] **Week 5: Theme & Layout System**
  - [x] Develop comprehensive CSS variable system for all UI elements
  - [x] Create base layout components for each PIMS
  - [x] Implement dynamic style application based on selected PIMS
  - [x] Create animation transitions between layouts
  - [x] Build theme testing tools

- [x] **Week 6: Component Architecture Part 1**
  - [x] Refactor existing screens to separate content from layout
  - [x] Create screen content components for check-in functionality
  - [x] Create screen content components for scheduling functionality
  - [x] Create screen content components for notes functionality
  - [x] Implement content-to-layout mapping system

- [x] **Week 7: Component Architecture Part 2**
  - [x] Create screen content components for services functionality
  - [x] Create screen content components for invoicing functionality
  - [x] Build component registration system for dynamic loading
  - [x] Create PIMS-specific routing system
  - [x] Implement cross-PIMS navigation handling

### Phase 3: PIMS-Specific Implementation (10 weeks)
- [x] **Week 8-9: Cornerstone Implementation**
  - [x] Refine existing Cornerstone UI components
  - [x] Create specialized Cornerstone layout components
  - [x] Implement Cornerstone-specific terminology
  - [x] Style components according to Cornerstone design
  - [x] Test all workflows in Cornerstone interface

- [x] **Week 10-11: Avimark Implementation**
  - [x] Create Avimark ribbon interface component
  - [x] Implement Avimark navigation system
  - [x] Develop Avimark-specific styling
  - [x] Create specialized Avimark layout components
  - [x] Implement Avimark-specific terminology
  - [x] Test all workflows in Avimark interface

- [x] **Week 12-13: EasyVet Implementation**
  - [x] Create EasyVet card-based interface components
  - [x] Implement EasyVet bottom navigation
  - [x] Develop EasyVet-specific styling
  - [x] Create specialized EasyVet layout components
  - [x] Implement EasyVet-specific terminology
  - [x] Test all workflows in EasyVet interface

- [x] **Week 14-15: IntraVet Implementation**
  - [x] Create IntraVet tree navigation component
  - [x] Implement IntraVet tab-based workspace
  - [x] Develop IntraVet-specific styling
  - [x] Create specialized IntraVet layout components
  - [x] Implement IntraVet-specific terminology
  - [x] Test all workflows in IntraVet interface

- [x] **Week 16-17: Covetrus Pulse Implementation**
  - [x] Create Covetrus Pulse mega-menu component
  - [x] Implement Covetrus Pulse navigation system
  - [x] Develop Covetrus Pulse minimal styling
  - [x] Create specialized Covetrus Pulse layout components
  - [x] Implement Covetrus Pulse-specific terminology
  - [x] Test all workflows in Covetrus Pulse interface

### Phase 4: Integration, Testing & Optimization (2 weeks)
- [x] **Week 18: System Integration & Switching Logic**
  - [x] Implement seamless PIMS switching without data loss
  - [x] Create persistent data layer across PIMS switches
  - [x] Add PIMS-specific data mapping for edge cases
  - [x] Optimize loading performance when switching PIMS
  - [x] Implement advanced PIMS selector with previews
  - [x] Create keyboard shortcuts for PIMS switching

- [ ] **Week 19: Testing, Refinement & Documentation**
  - [ ] Conduct comprehensive testing of all PIMS interfaces
  - [ ] Test with AI agent on all PIMS interfaces
  - [x] Fix identified bugs and edge cases
  - [x] Optimize performance for smooth operation
  - [x] Create documentation for each PIMS interface
  - [x] Develop guidance for AI agent training across PIMS

## Success Criteria
- All five PIMS interfaces are functional and visually distinct
- Users can switch between PIMS simulations with no data loss
- The underlying data model remains consistent across PIMS
- The AI agent can successfully operate in all PIMS interfaces
- Each PIMS realistically simulates the actual software's appearance and workflow
- Switching between PIMS is smooth and performant
- All UI features work correctly in each PIMS interface

## Timeline Summary
- Phase 1: Research and Architecture Design - 3 weeks
- Phase 2: Core Infrastructure Development - 4 weeks
- Phase 3: PIMS-Specific Implementation - 10 weeks
- Phase 4: Integration, Testing & Optimization - 2 weeks
- Total estimated time: 19 weeks

## Progress Tracking
Progress will be tracked using a GitHub project board with the implementation checklist items as cards, organized by phase and week. Each PIMS implementation will have its own milestone with specific completion criteria. Status reports will include:
- Percentage completion by phase
- Screenshots of implemented interfaces
- Identified challenges and solutions
- AI agent testing results
- Performance metrics for PIMS switching 

### Current Progress (Updated)

#### Phase 1: Research and Architecture Design - 100% Complete
- [x] **Week 1: PIMS Research & Analysis**
  - [x] Research UI/UX patterns of all 5 target PIMS platforms
  - [x] Document key features and workflows of each PIMS
  - [x] Create screenshots library of each PIMS for reference
  - [x] Identify common functionality across all systems
  - [x] Document terminology differences between systems

- [x] **Week 2: Architecture Design**
  - [x] Define configuration schema for PIMS registry
  - [x] Design theme system and style variables
  - [x] Create component abstraction plan
  - [x] Design layout switching mechanism
  - [x] Plan data flow between PIMS-agnostic and PIMS-specific components

- [x] **Week 3: Prototype & Proof of Concept**
  - [x] Create PIMSContext provider
  - [x] Build basic theme provider with CSS variables
  - [x] Develop simple PIMS selector component
  - [x] Implement basic layout switching for one screen
  - [x] Test proof of concept with two PIMS (Cornerstone + one other)

#### Phase 2: Core Infrastructure Development - 100% Complete
- [x] **Week 4: Configuration System**
  - [x] Create cornerstone configuration in registry
  - [x] Create avimark configuration in registry
  - [x] Create easyvet configuration in registry
  - [x] Create intravet configuration in registry
  - [x] Create covetrus configuration in registry
  - [x] Implement configuration loading system

- [x] **Week 5: Theme & Layout System**
  - [x] Develop comprehensive CSS variable system for all UI elements
  - [x] Create base layout components for each PIMS
  - [x] Implement dynamic style application based on selected PIMS
  - [x] Create animation transitions between layouts
  - [x] Build theme testing tools

- [x] **Week 6: Component Architecture Part 1**
  - [x] Refactor existing screens to separate content from layout
  - [x] Create screen content components for check-in functionality
  - [x] Create screen content components for scheduling functionality
  - [x] Create screen content components for notes functionality
  - [x] Implement content-to-layout mapping system

- [x] **Week 7: Component Architecture Part 2**
  - [x] Create screen content components for services functionality
  - [x] Create screen content components for invoicing functionality
  - [x] Build component registration system for dynamic loading
  - [x] Create PIMS-specific routing system
  - [x] Implement cross-PIMS navigation handling

#### Phase 3: PIMS-Specific Implementation - In Progress
- [x] **Week 8-9: Cornerstone Implementation**
  - [x] Refine existing Cornerstone UI components
  - [x] Create specialized Cornerstone layout components
  - [x] Implement Cornerstone-specific terminology
  - [x] Style components according to Cornerstone design
  - [x] Test all workflows in Cornerstone interface

- [x] **Week 10-11: Avimark Implementation**
  - [x] Create Avimark ribbon interface component
  - [x] Implement Avimark navigation system
  - [x] Develop Avimark-specific styling
  - [x] Create specialized Avimark layout components
  - [x] Implement Avimark-specific terminology
  - [x] Test all workflows in Avimark interface

- [x] **Week 12-13: EasyVet Implementation**
  - [x] Create EasyVet card-based interface components
  - [x] Implement EasyVet bottom navigation
  - [x] Develop EasyVet-specific styling
  - [x] Create specialized EasyVet layout components
  - [x] Implement EasyVet-specific terminology
  - [x] Test all workflows in EasyVet interface

- [x] **Week 14-15: IntraVet Implementation**
  - [x] Create IntraVet tree navigation component
  - [x] Implement IntraVet tab-based workspace
  - [x] Develop IntraVet-specific styling
  - [x] Create specialized IntraVet layout components
  - [x] Implement IntraVet-specific terminology
  - [x] Test all workflows in IntraVet interface

- [x] **Week 16-17: Covetrus Pulse Implementation**
  - [x] Create Covetrus Pulse mega-menu component
  - [x] Implement Covetrus Pulse navigation system
  - [x] Develop Covetrus Pulse minimal styling
  - [x] Create specialized Covetrus Pulse layout components
  - [x] Implement Covetrus Pulse-specific terminology
  - [x] Test all workflows in Covetrus Pulse interface

#### Phase 4: Integration, Testing & Optimization - 83% Complete
- [x] **Week 18: System Integration & Switching Logic**
  - [x] Implement seamless PIMS switching without data loss
  - [x] Create persistent data layer across PIMS switches
  - [x] Add PIMS-specific data mapping for edge cases
  - [x] Optimize loading performance when switching PIMS
  - [x] Implement advanced PIMS selector with previews
  - [x] Create keyboard shortcuts for PIMS switching

- [ ] **Week 19: Testing, Refinement & Documentation**
  - [ ] Conduct comprehensive testing of all PIMS interfaces
  - [ ] Test with AI agent on all PIMS interfaces
  - [x] Fix identified bugs and edge cases
  - [x] Optimize performance for smooth operation
  - [x] Create documentation for each PIMS interface
  - [x] Develop guidance for AI agent training across PIMS

### Overall Progress Summary
- **Phase 1 (Research and Architecture)**: 100% complete
- **Phase 2 (Core Infrastructure)**: 100% complete
- **Phase 3 (PIMS-Specific Implementation)**: 100% complete
- **Phase 4 (Integration and Testing)**: 83% complete
- **Total Project Completion**: ~96%

### Next Steps
1. Complete testing of all PIMS interfaces
2. Test with AI agent on all PIMS interfaces
3. Fix identified bugs and edge cases ✓ Completed
4. Optimize performance for smooth operation ✓ Completed
5. Create comprehensive documentation ✓ Completed
6. Develop training guidance for AI agents ✓ Completed

### Recent Improvements
- Implemented URL-based navigation for PIMS selection (e.g., `/cornerstone/scheduler`, `/avimark/notes`)
- Added resilience to page refreshes by storing PIMS selection in the URL
- Created keyboard shortcuts (Alt+Shift+1-5) for quickly switching between PIMS
- Improved navigation consistency across different PIMS interfaces
- Added utility functions for PIMS-specific URL handling 