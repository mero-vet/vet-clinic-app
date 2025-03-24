# AI Agent Training Guide: Working with Multiple PIMS

## Introduction
This guide is designed to help AI agents navigate and operate effectively across different Practice Information Management Systems (PIMS) in the veterinary clinic simulation. Each PIMS has unique interface patterns, terminology, and workflows that require specific approaches.

## Key Challenges in Multi-PIMS Operation

### 1. Interface Pattern Recognition
- Each PIMS uses different UI patterns (menus, ribbons, cards, trees, etc.)
- AI needs to recognize and adapt to interface elements specific to each PIMS
- Navigation paths to the same functionality vary significantly between systems

### 2. Terminology Differences
- Common veterinary concepts use different terms across systems
- The same action may have different labels in different systems
- Documentation and help text will use PIMS-specific terminology

### 3. Workflow Variations
- The sequence of steps to complete tasks differs between systems
- Required fields and validation rules vary across PIMS
- Some systems have multi-step wizards while others use single forms

## General Strategies for Multi-PIMS Proficiency

### 1. Identify the Current PIMS
- Check the interface style to identify which PIMS is active
- Look for branding elements and color schemes
- Use the PIMS selector in the top-right corner to confirm

### 2. Adapt Navigation Strategy
- Cornerstone: Use icon toolbar and dropdown menus
- Avimark: Navigate primarily through ribbon tabs and groups
- EasyVet: Use bottom navigation bar and cards
- IntraVet: Navigate through tree menu on left side
- Covetrus: Use top navigation bar with mega-menus

### 3. Translate Terminology
- Refer to the terminology mappings for each PIMS
- When searching for functionality, try alternative terms
- Use visual cues and context to identify equivalent features

### 4. Follow PIMS-Specific Workflows
- Adapt to the expected sequence of actions for the current PIMS
- Recognize when data entry, search, and other operations follow different patterns
- Pay attention to confirmation dialogs and validation messages

## PIMS-Specific Training Focus Areas

### Cornerstone
- Master the icon toolbar navigation for primary functions
- Learn the dropdown menu structure for secondary functions
- Develop proficiency with modal dialog workflows
- Practice moving between linked patient records and invoices

### Avimark
- Become fluent with the ribbon interface and tab groupings
- Recognize contextual ribbon tabs that appear based on selected content
- Learn the side tab navigation patterns for main modules
- Master the treatment list workflow and invoicing process

### EasyVet
- Practice using bottom navigation bar for main module switching
- Develop proficiency with card-based content navigation
- Learn floating action button patterns for primary actions
- Master responsive layout adaptation between screen sizes

### IntraVet
- Become proficient with tree navigation structure
- Learn tab-based workspace management for multitasking
- Practice drill-down navigation through hierarchical data
- Recognize context menus for additional actions

### Covetrus Pulse
- Master the mega-menu navigation system
- Develop familiarity with material design patterns
- Learn modern SaaS patterns like real-time updates
- Practice using global search as a primary navigation tool

## Testing and Evaluation Criteria

### Task Completion
- Can successfully complete the same task across all PIMS
- Adapts approach based on the specific PIMS interface
- Uses the most efficient navigation path for each system

### Adaptability
- Quickly recognizes which PIMS is currently active
- Switches mental models when the PIMS changes
- Applies appropriate terminology for the current system

### Efficiency
- Minimizes unnecessary navigation steps
- Uses PIMS-specific shortcuts where available
- Completes tasks in reasonable time across all systems

## Training Exercises

### 1. PIMS Identification Drill
- Practice identifying the active PIMS from a screenshot
- Learn to recognize unique elements of each interface
- Associate color schemes and layouts with specific systems

### 2. Terminology Translation
- Given a term in one PIMS, identify the equivalent in others
- Practice translating user requests to PIMS-specific actions
- Create a mental mapping of equivalent concepts

### 3. Cross-PIMS Task Completion
- Complete the same workflow across different PIMS
- Document the different steps required in each system
- Identify common patterns and major differences

### 4. Interface Element Recognition
- Practice identifying UI components specific to each PIMS
- Learn to locate equivalent functions in different interfaces
- Develop a visual library of UI patterns

## Resources
- Individual PIMS documentation in the /documents/PIMS/ directory
- PIMS configuration files in src/config/pimsConfigurations.js
- Layout components in src/components/layouts/
- Theme definitions in src/styles/pimsThemes.css 