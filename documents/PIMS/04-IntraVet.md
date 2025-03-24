# IntraVet PIMS Interface

## Overview
IntraVet is a hybrid Windows/Web-based veterinary practice management system. Our simulation replicates its interface that combines a traditional tree navigation structure with a modern tab-based workspace.

## Visual Characteristics
- **Theme**: Windows/Web hybrid (blue and orange accents)
- **Layout**: Left-side tree navigation with tabbed content area
- **Colors**: Dark blue (#1565C0) primary, amber/orange (#FF8F00) secondary
- **Typography**: Trebuchet MS, Tahoma
- **UI Elements**: Gradient buttons, tabbed interfaces, tree controls

## Navigation Structure
- **Primary Navigation**: Tree menu on left side
- **Secondary Navigation**: Tabs within content area
- **Screen Flow**: Tree-based hierarchical navigation with tabbed workspaces

## Terminology
- **Patient**: "Patient"
- **Client**: "Client"
- **Appointment**: "Visit"
- **Service**: "Procedure"
- **Medication**: "Pharmaceutical"
- **Prescription**: "Script"
- **Invoice**: "Account"

## Screen Labels
- **Check-in**: "Registration"
- **Scheduler**: "Calendar"
- **Notes**: "Visit Notes"
- **Services**: "Procedures"
- **Invoices**: "Accounts"
- **Records**: "Medical Files"
- **Inventory**: "Stock"
- **Communications**: "Client Connect"
- **Pharmacy**: "Medications"
- **Reports**: "Practice Reports"

## Workflow Characteristics
- **Data Entry**: Mixed form styles with validation
- **Search**: Search panels in tree view
- **Records Access**: Hierarchical tree-based access to patient data
- **Multi-Level Views**: Ability to drill down through related data

## AI Agent Training Considerations
- Tree navigation requires understanding of hierarchical data relationships
- Tab-based interface allows working with multiple screens simultaneously
- Need to recognize when actions should be performed in tree vs. content area
- Contextual menus often appear on right-click within specific areas
- Hybrid interface combines elements of both desktop and web applications

## Implementation Details
- Base CSS class: `.pims-intravet`
- Layout component: `IntraVetLayout.jsx`
- Theme variables defined in `pimsThemes.css`
- Configuration in `pimsConfigurations.js` 