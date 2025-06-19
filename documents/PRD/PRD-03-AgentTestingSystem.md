# Product Requirements Document: AI Agent Testing & Logging System

## Overview
This PRD outlines the plan to implement a comprehensive testing and logging system for the veterinary AI assistant. This system will track, analyze, and report on the AI agent's performance as it interacts with the Vet Clinic App, providing valuable insights for improving the agent's capabilities and identifying areas of weakness.

## Current State
The Vet Clinic App functions as a sandbox for AI agent training but lacks structured testing capabilities and performance metrics. Without a formal testing framework, it's difficult to:
1. Measure the AI agent's success rate
2. Identify common failure points
3. Track improvements over time
4. Compare performance across different PIMS interfaces

## Goals
- Create a structured testing framework for AI agent interactions
- Implement detailed logging of agent actions and outcomes
- Develop metrics to measure agent performance
- Support test case creation and repeated execution
- Generate reports on agent efficiency and success rates
- Identify breakpoints and areas for improvement

## 2025-06 Sandbox Enhancements (Human-In-The-Loop Testing)

The following refinements are based on hands-on feedback while using the Vet-Clinic Sandbox with the computer-use agent.

1. **One-Click Boundary Controls**
   • Add a floating "Test Manager" panel that is always visible on top of the PIMS UI.
   • Controls: *Scenario selector* ➜ *Start Test* ➜ *End Test & Download Logs*.
   • Prevent multiple tests running at the same time.

2. **Event Capture v1 (Client-Side Only)**
   • When a test is active, the system captures DOM‐level `click`, `keydown`, and (optionally) coarse `mousemove` events with a millisecond-relative timestamp.
   • Each record includes a concise CSS selector for the target element and the chosen **Scenario ID** so downstream tools can correlate logs to a workflow.
   • No server storage is required in Phase 1; all data are downloaded locally as a plain-text `.json` file on *End Test*.

3. **Fixed Scenario Catalogue**
   The initial release ships with ten predefined workflows that represent progressively complex clinic tasks. They can later be turned into full test-case objects, but for Phase 1 a simple static list is sufficient.

   | ID | Scenario | Key Steps |
   |----|----------|-----------|
   | workflow-1 | New Client + Patient Registration | Search for duplicates → create client → add multiple pets → capture consent forms |
   | workflow-2 | Appointment Scheduling & Confirmation | Find open slot ➜ book visit type ➜ auto-confirm via SMS/email ➜ update calendar |
   | workflow-3 | Patient Check-In | Arrive patient ➜ verify info ➜ weigh ➜ triage notes ➜ place in exam room |
   | workflow-4 | Doctor Exam & Medical Record Entry | SOAP entry ➜ add problems & diagnoses ➜ prescribe meds ➜ add follow-up |
   | workflow-5 | Diagnostics Ordering | Select lab/imaging ➜ generate requisition ➜ simulate result return ➜ attach to record |
   | workflow-6 | Treatment Plan & Estimate | Build estimate ➜ present to owner ➜ capture electronic approval ➜ convert to invoice |
   | workflow-7 | Pharmacy Dispensing | Check prescription ➜ deduct inventory ➜ print label ➜ record lot/expiry |
   | workflow-8 | Invoice & Payment Processing | Add charges ➜ apply discounts/taxes ➜ split payment (cash/Card/on-account) ➜ email receipt |
   | workflow-9 | Reminder Generation & Outreach | Auto-create vaccine/med reminders ➜ batch send ➜ track responses |
   | workflow-10 | End-of-Day Reconciliation & Reporting | Close invoices ➜ cash drawer balance ➜ inventory adjustments ➜ generate financial & productivity reports |

4. **Downloadable Log Format**
   ```json
   {
     "testId": "workflow-3",
     "startedAt": "2025-06-19T17:30:22.456Z",
     "logs": [
       { "timestamp": 0,    "type": "click",   "selector": "button#create-client" },
       { "timestamp": 357,  "type": "keydown", "key": "J", "selector": "input#firstName" }
       // …
     ]
   }
   ```

5. **Out-Of-Scope For Phase 1**
   • Automated success-criteria checking (manual visual inspection for now).
   • Server-side persistence, analytics & dashboard; those remain in later phases of the existing roadmap.

---

## Proposed Solution

### System Architecture

#### 1. Test Management System
The core of the testing system will be a test management interface that allows:
- Creating and managing test scenarios
- Setting test parameters and expectations
- Executing tests with the AI agent
- Reviewing test results and metrics

#### 2. Logging Subsystem
A comprehensive logging system that captures:
- All agent actions and inputs
- System responses
- Time spent on each action
- Success/failure of specific tasks
- Screen transitions and navigation paths

#### 3. Analytics Dashboard
A reporting interface that provides:
- Success rate metrics
- Time-to-completion statistics
- Comparative analysis between test runs
- Breakpoint visualization
- Performance trends over time

### Detailed Requirements

#### Test Management

##### Test Case Definition Interface
```jsx
const TestCase = {
  id: 'test-123',
  name: 'New Client Registration',
  description: 'Test the agent's ability to register a new client and patient',
  startingScreen: 'checkin',
  startingPIMS: 'cornerstone',
  expectedActions: [
    { type: 'navigation', target: 'createNewClient', description: 'Navigate to new client form' },
    { type: 'input', field: 'clientFirstName', value: '[ANY]', description: 'Enter first name' },
    // Additional expected actions...
  ],
  successCriteria: [
    { type: 'data', field: 'clientId', condition: 'exists', description: 'Client ID is generated' },
    { type: 'navigation', destination: 'checkin', description: 'Returns to check-in screen' },
    // Additional success criteria...
  ],
  timeLimit: 120, // seconds
};
```

##### Test Execution Controller
- Start/stop/pause test execution
- Load predefined test cases
- Real-time monitoring of test progress
- Manual intervention capabilities
- Test recording for creating new test cases

##### Test Results Storage
- Test execution history
- Performance metrics by test case
- Agent performance over time
- Comparison between different agent versions

#### Logging System

##### Action Logger
Captures all interactions between the agent and the application:
```javascript
{
  timestamp: '2024-03-19T13:45:22.123Z',
  agentId: 'agent-001',
  action: 'click',
  element: 'input[name="clientFirstName"]',
  value: 'John',
  screenName: 'createNewClient',
  pimsName: 'cornerstone',
  elapsedTime: 3.2, // seconds since last action
  testId: 'test-123',
  executionId: 'exec-456'
}
```

##### Error Logger
Records exceptions and deviations from expected behavior:
```javascript
{
  timestamp: '2024-03-19T13:46:05.789Z',
  agentId: 'agent-001',
  errorType: 'navigationFailure',
  description: 'Expected navigation to scheduling screen did not occur',
  context: {
    currentScreen: 'checkin',
    expectedScreen: 'scheduler',
    lastAction: { /* action details */ }
  },
  testId: 'test-123',
  executionId: 'exec-456'
}
```

##### Screen Transition Logger
Tracks navigation between application screens:
```javascript
{
  timestamp: '2024-03-19T13:45:31.456Z',
  agentId: 'agent-001',
  fromScreen: 'checkin',
  toScreen: 'createNewClient',
  transitionMethod: 'button-click',
  elapsedTime: 1.8, // seconds
  testId: 'test-123',
  executionId: 'exec-456'
}
```

##### Test Completion Logger
Records overall test results:
```javascript
{
  timestamp: '2024-03-19T13:48:12.789Z',
  agentId: 'agent-001',
  testId: 'test-123',
  executionId: 'exec-456',
  pimsName: 'cornerstone',
  result: 'success', // or 'failure', 'partial'
  completionTime: 170.5, // seconds
  actionsPerformed: 24,
  successCriteriaMet: 8,
  successCriteriaFailed: 0,
  breakpoints: [
    { 
      action: 15, 
      description: 'Delay in finding prescription field',
      timeSpent: 12.5 // seconds
    }
    // Other breakpoints...
  ]
}
```

#### Analytics System

##### Performance Metrics Dashboard
- Overall success rate
- Average completion time
- Success by test case type
- Common failure points
- Improvement over time

##### Breakpoint Analysis
- Identify actions that take longer than expected
- Track common error patterns
- Highlight UI elements that cause confusion
- Compare breakpoints across different PIMS

##### Comparative Analysis
- Performance across different PIMS
- Efficiency between different agent versions
- Screen-by-screen performance breakdown
- Action success heat maps

### User Interface Design

#### Test Execution Interface
- **Test Selection Panel:** Browse and select test cases
- **Test Configuration:** Set parameters like PIMS, time limits
- **Execution Controls:** Start, stop, pause buttons
- **Live Status Display:** Current action, elapsed time, progress
- **Real-time Logging:** Scrolling log of actions being performed

#### Results Review Interface
- **Test Summary:** Overall results and metrics
- **Action Timeline:** Sequential view of all actions
- **Error Highlight:** Visual indicators of failures
- **Transition Map:** Visual representation of screen navigation
- **Performance Chart:** Time spent on each action

#### Analytics Dashboard
- **Overview Panel:** Key performance indicators
- **Trend Charts:** Performance over time
- **Breakpoint Visualization:** Highlighting problem areas
- **Comparison Tools:** Side-by-side PIMS performance
- **Export Functionality:** Data export for further analysis

## Detailed Implementation Checklist

### Phase 1: Event Capture & Core Logging Infrastructure (4 weeks)
- [ ] **Week 1: Requirements & Architecture**
  - [ ] Document logging requirements for all interactions
  - [ ] Define event capture points throughout application
  - [ ] Design logger architecture and data model
  - [ ] Create schema for all log types
  - [ ] Design storage strategy for logs

- [ ] **Week 2: Core Event Hooks**
  - [ ] Implement DOM event capture system
  - [ ] Create React component hooks for user interactions
  - [ ] Build screen transition detection
  - [ ] Implement form interaction tracking
  - [ ] Create timing measurement utilities

- [ ] **Week 3: Logging Implementation**
  - [ ] Build action logger service
  - [ ] Implement error logger system
  - [ ] Create screen transition logger
  - [ ] Develop test completion logger
  - [ ] Build log aggregation service
  - [ ] Create log storage system (local or cloud)

- [ ] **Week 4: Logging Integration**
  - [ ] Integrate logging hooks with application components
  - [ ] Add logging to all interactive elements
  - [ ] Implement screen navigation tracking
  - [ ] Create log visualization for debugging
  - [ ] Test logging system with manual interactions
  - [ ] Optimize performance of logging system

### Phase 2: Test Management System (5 weeks)
- [ ] **Week 5: Test Case Architecture**
  - [ ] Design test case data model
  - [ ] Create test case storage system
  - [ ] Build test case CRUD operations
  - [ ] Implement test case versioning
  - [ ] Develop test dependency handling

- [ ] **Week 6: Test Creation Interface**
  - [ ] Build test case editor UI
  - [ ] Implement expected action definition tools
  - [ ] Create success criteria editor
  - [ ] Develop test metadata management
  - [ ] Build test case validation system

- [ ] **Week 7: Test Recording System**
  - [ ] Create interaction recording mechanism
  - [ ] Build recording start/stop controls
  - [ ] Implement conversion of recordings to test cases
  - [ ] Create editing tools for recorded tests
  - [ ] Develop test case optimization suggestions

- [ ] **Week 8: Test Execution Engine**
  - [ ] Build test initialization system
  - [ ] Create execution monitoring subsystem
  - [ ] Implement real-time progress tracking
  - [ ] Develop test results calculation
  - [ ] Build timeouts and error handling
  - [ ] Create manual intervention capabilities

- [ ] **Week 9: Test Results Management**
  - [ ] Design test results storage system
  - [ ] Implement results comparison tools
  - [ ] Build test history visualization
  - [ ] Create test run export functionality
  - [ ] Develop detailed result inspection tools
  - [ ] Implement test case improvement suggestions

### Phase 3: Analytics & Reporting System (4 weeks)
- [ ] **Week 10: Metrics Engine**
  - [ ] Define key performance indicators
  - [ ] Create metrics calculation engine
  - [ ] Implement trend analysis algorithms
  - [ ] Develop breakpoint detection system
  - [ ] Build comparative analysis tools
  - [ ] Create statistical significance tests

- [ ] **Week 11: Dashboard Framework**
  - [ ] Design analytics dashboard layout
  - [ ] Implement dashboard component infrastructure
  - [ ] Create widget system for metrics displays
  - [ ] Build data filtering and time range selection
  - [ ] Develop dashboard customization options
  - [ ] Create dashboard export functionality

- [ ] **Week 12: Visualization Components**
  - [ ] Build performance trend charts
  - [ ] Create success rate visualizations
  - [ ] Implement breakpoint heat maps
  - [ ] Develop screen transition flow diagrams
  - [ ] Create comparative PIMS performance charts
  - [ ] Build agent version comparison tools

- [ ] **Week 13: Reporting System**
  - [ ] Design automated report templates
  - [ ] Implement scheduled reporting
  - [ ] Create custom report builder
  - [ ] Develop report export formats (PDF, CSV, JSON)
  - [ ] Build report sharing capabilities
  - [ ] Create report annotation system

### Phase 4: Integration & System Refinement (3 weeks)
- [ ] **Week 14: System Integration**
  - [ ] Connect all system components
  - [ ] Implement end-to-end test workflows
  - [ ] Create unified API for external tools
  - [ ] Develop system health monitoring
  - [ ] Build configuration management
  - [ ] Implement user permissions and access control

- [ ] **Week 15: Performance Optimization**
  - [ ] Conduct performance testing under load
  - [ ] Optimize logging for minimal performance impact
  - [ ] Implement log rotation and archiving
  - [ ] Optimize query performance for analytics
  - [ ] Create caching mechanisms for dashboard data
  - [ ] Develop background processing for intensive operations

- [ ] **Week 16: Final Testing & Documentation**
  - [ ] Conduct comprehensive system testing
  - [ ] Create documentation for test creation
  - [ ] Develop documentation for analytics interpretation
  - [ ] Build interactive tutorials for system usage
  - [ ] Create admin guide for system maintenance
  - [ ] Develop API documentation for integration

## Success Criteria
- All agent actions are accurately logged without impacting performance
- Test cases can be created both manually and via recording
- Tests can be executed with real-time progress monitoring
- Performance metrics provide actionable insights for agent improvement
- System can identify specific breakpoints and problem patterns
- Comparison between test runs shows clear improvement trends
- Reports can be generated for stakeholder review
- All components work seamlessly together in a unified workflow

## Timeline Summary
- Phase 1: Event Capture & Core Logging Infrastructure - 4 weeks
- Phase 2: Test Management System - 5 weeks
- Phase 3: Analytics & Reporting System - 4 weeks
- Phase 4: Integration & System Refinement - 3 weeks
- Total estimated time: 16 weeks

## Progress Tracking
Progress will be tracked in a dedicated GitHub project with the following:
- Implementation checklist items as issues
- Weekly milestones for each phase
- Automated tests to verify functionality
- Regular demos of implemented features
- Burndown charts for velocity tracking
- Integration with continuous deployment system

Each completed feature will include:
- Unit and integration tests
- Documentation
- Example usage
- Performance metrics 