# EasyVet PIMS Interface

## Overview
EasyVet is a modern, web-based veterinary practice management system. Our simulation replicates its clean, responsive interface with a card-based design and bottom navigation bar typical of modern web applications.

## Visual Characteristics
- **Theme**: Modern web interface (green and white)
- **Layout**: Card-based content with bottom navigation bar
- **Colors**: Green (#4CAF50) primary, white (#FFFFFF) background
- **Typography**: Roboto, Open Sans
- **UI Elements**: Material design-inspired components, floating action buttons

## Navigation Structure
- **Primary Navigation**: Bottom navigation bar with main sections
- **Secondary Navigation**: Card-based interface with content categories
- **Screen Flow**: Flat hierarchy with minimal modal dialogs

## Terminology
- **Patient**: "Animal"
- **Client**: "Owner"
- **Appointment**: "Booking"
- **Service**: "Treatment"
- **Medication**: "Product"
- **Prescription**: "Prescription"
- **Invoice**: "Invoice"

## Screen Labels
- **Check-in**: "Reception"
- **Scheduler**: "Calendar"
- **Notes**: "Clinical Notes"
- **Services**: "Treatments"
- **Invoices**: "Billing"
- **Records**: "Health Records"
- **Inventory**: "Stock Control"
- **Communications**: "Messaging"
- **Pharmacy**: "Pharmacy"
- **Reports**: "Analytics"

## Workflow Characteristics
- **Data Entry**: Clean forms with immediate validation
- **Search**: Prominent search bars with advanced filtering
- **Records Access**: Card-based patient records with expandable sections
- **Mobile-First**: Responsive design works on various screen sizes

## AI Agent Training Considerations
- Mobile-inspired interface with bottom navigation requires different interaction patterns
- Card-based UI with clear visual hierarchy of information
- Material design patterns with floating action buttons for primary actions
- Fewer hidden menus, more immediate visual access to functionality
- Responsive layout may reposition elements based on viewport size

## Implementation Details
- Base CSS class: `.pims-easyvet`
- Layout component: `EasyVetLayout.jsx`
- Theme variables defined in `pimsThemes.css`
- Configuration in `pimsConfigurations.js` 