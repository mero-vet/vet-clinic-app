# Cornerstone PIMS Interface

## Overview
Cornerstone is one of the most widely used veterinary practice management systems, developed by IDEXX. Our simulation replicates its classic Windows-style interface with a traditional menu bar, icon toolbar, and form-based workflow.

## Visual Characteristics
- **Theme**: Windows Classic (blue and gray)
- **Layout**: Top menu bar with dropdown menus + icon toolbar
- **Colors**: Navy blue (#000080) primary, silver (#c0c0c0) background
- **Typography**: MS Sans Serif, Segoe UI, Tahoma
- **UI Elements**: 3D buttons, window frames, classic form controls

## Navigation Structure
- **Primary Navigation**: Icon toolbar with main functionality areas
- **Secondary Navigation**: Dropdown menus organized by category
- **Screen Flow**: Modal window-based approach with parent-child relationships

## Terminology
- **Patient**: "Patient"
- **Client**: "Client"
- **Appointment**: "Appointment"
- **Service**: "Service"
- **Medication**: "Medication"
- **Prescription**: "Prescription"
- **Invoice**: "Invoice"

## Screen Labels
- **Check-in**: "Check-In/Out"
- **Scheduler**: "Scheduler"
- **Notes**: "Notes"
- **Services**: "Services"
- **Invoices**: "Invoices"
- **Records**: "Medical Records"
- **Inventory**: "Inventory"
- **Communications**: "Communications"
- **Pharmacy**: "Pharmacy"
- **Reports**: "Reports"

## Workflow Characteristics
- **Data Entry**: Form-based with field tabbing
- **Search**: Basic search fields with separate search screens
- **Records Access**: Hierarchical navigation through patient records
- **Multiple Windows**: Support for multiple open windows/records simultaneously

## AI Agent Training Considerations
- Navigation relies heavily on icon toolbar and menu dropdowns
- Windows-style interface expects precise clicking on controls
- Modal dialog workflow with frequent OK/Cancel confirmations
- Limited visual cues for available actions compared to modern interfaces
- Data entry flows through form fields in a tab order

## Implementation Details
- Base CSS class: `.pims-cornerstone`
- Layout component: `CornerstoneLayout.jsx`
- Theme variables defined in `pimsThemes.css`
- Configuration in `pimsConfigurations.js` 