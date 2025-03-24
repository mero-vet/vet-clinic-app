# Avimark PIMS Interface

## Overview
Avimark is a widely used veterinary practice management system developed by McAllister Software Systems (now IDEXX). Our simulation replicates its modern Windows-style interface with a ribbon navigation system inspired by Microsoft Office applications.

## Visual Characteristics
- **Theme**: Windows Modern with ribbon (red and white)
- **Layout**: Ribbon interface with tabs and a tab content area
- **Colors**: Dark red (#A70000) primary, light gray (#F0F0F0) background
- **Typography**: Segoe UI, Arial
- **UI Elements**: Flat buttons with hover effects, modern form controls

## Navigation Structure
- **Primary Navigation**: Ribbon tabs at the top
- **Secondary Navigation**: Ribbon groups within each tab
- **Screen Flow**: Tab-based interface with context-sensitive ribbon options

## Terminology
- **Patient**: "Patient"
- **Client**: "Owner"
- **Appointment**: "Visit"
- **Service**: "Treatment"
- **Medication**: "Drug"
- **Prescription**: "Rx"
- **Invoice**: "Bill"

## Screen Labels
- **Check-in**: "Check-In"
- **Scheduler**: "Appointments"
- **Notes**: "Clinical Notes"
- **Services**: "Treatments"
- **Invoices**: "Billing"
- **Records**: "Patient Records"
- **Inventory**: "Inventory Manager"
- **Communications**: "Client Comm"
- **Pharmacy**: "Prescriptions"
- **Reports**: "Analysis"

## Workflow Characteristics
- **Data Entry**: Form-based with field validation and auto-complete
- **Search**: Integrated search bars with quick filters
- **Records Access**: Patient-centered workflow with tabbed record views
- **Quick Actions**: Contextual actions in the ribbon based on current view

## AI Agent Training Considerations
- Navigation centered on the ribbon interface with contextual tabs
- Hierarchical organization of functions within ribbon groups
- More visual cues for available actions compared to classic interfaces
- Data entry often has validation rules and real-time feedback
- Tab-based workflow for moving between different aspects of a record

## Implementation Details
- Base CSS class: `.pims-avimark`
- Layout component: `AvimarkLayout.jsx`
- Theme variables defined in `pimsThemes.css`
- Configuration in `pimsConfigurations.js` 