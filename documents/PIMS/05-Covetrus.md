# Covetrus Pulse PIMS Interface

## Overview
Covetrus Pulse is a modern, cloud-based veterinary practice management system. Our simulation replicates its sleek, minimalist SaaS interface with mega-menu navigation and clean card-based content.

## Visual Characteristics
- **Theme**: Modern SaaS (purple and white)
- **Layout**: Top navigation with mega-menus, content cards
- **Colors**: Deep purple (#6200EA) primary, white (#FFFFFF) background
- **Typography**: Montserrat, Roboto
- **UI Elements**: Floating action buttons, material cards, outlined icons

## Navigation Structure
- **Primary Navigation**: Top navigation bar with mega-menu dropdowns
- **Secondary Navigation**: Side drawer for context-specific options
- **Screen Flow**: Single-page application feel with dynamic content loading

## Terminology
- **Patient**: "Patient"
- **Client**: "Pet Parent"
- **Appointment**: "Visit"
- **Service**: "Care Item"
- **Medication**: "Product"
- **Prescription**: "Rx"
- **Invoice**: "Transaction"

## Screen Labels
- **Check-in**: "Reception"
- **Scheduler**: "Appointment Hub"
- **Notes**: "Clinical Workspace"
- **Services**: "Care Items"
- **Invoices**: "Transactions"
- **Records**: "Patient Hub"
- **Inventory**: "Inventory Center"
- **Communications**: "Client Connections"
- **Pharmacy**: "Pharmacy Suite"
- **Reports**: "Insights"

## Workflow Characteristics
- **Data Entry**: Clean forms with real-time validation and auto-save
- **Search**: Global search bar with smart filtering
- **Records Access**: Unified patient view with contextual actions
- **Notifications**: In-app notifications for workflow events
- **Collaboration**: Real-time collaboration features

## AI Agent Training Considerations
- Modern SaaS interface with extensive use of icon-only buttons requires icon recognition
- Mega-menus expose a large number of options at once, requiring careful navigation
- Single-page application behavior means content changes without full page reloads
- Material design patterns with floating action buttons, cards, and subtle animations
- Heavy use of modals and side drawers for contextual information

## Implementation Details
- Base CSS class: `.pims-covetrus`
- Layout component: `CovetrusLayout.jsx`
- Theme variables defined in `pimsThemes.css`
- Configuration in `pimsConfigurations.js` 