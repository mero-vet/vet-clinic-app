# PIMS Comparison Chart

This document provides a side-by-side comparison of the five PIMS interfaces implemented in the Vet Clinic App simulation.

## Visual Design

| Feature | Cornerstone | Avimark | EasyVet | IntraVet | Covetrus Pulse |
|---------|------------|---------|---------|----------|----------------|
| Theme | Windows Classic | Windows Modern | Web-based Modern | Windows/Web Hybrid | Modern SaaS |
| Primary Color | Navy Blue (#000080) | Dark Red (#A70000) | Green (#4CAF50) | Dark Blue (#1565C0) | Deep Purple (#6200EA) |
| Background | Silver (#c0c0c0) | Light Gray (#F0F0F0) | White (#FFFFFF) | Off-white (#F5F5F5) | Near White (#FAFAFA) |
| Typography | MS Sans Serif, Segoe UI | Segoe UI, Arial | Roboto, Open Sans | Trebuchet MS, Tahoma | Montserrat, Roboto |
| UI Elements | 3D buttons | Flat buttons | Material design | Gradient buttons | Floating buttons |
| Border Radius | 0px | 2px | 4px | 3px | 8px |

## Navigation

| Feature | Cornerstone | Avimark | EasyVet | IntraVet | Covetrus Pulse |
|---------|------------|---------|---------|----------|----------------|
| Primary Navigation | Icon toolbar | Ribbon tabs | Bottom nav bar | Tree menu | Top nav with mega-menus |
| Secondary Navigation | Dropdown menus | Ribbon groups | Cards | Tabs | Side drawer |
| Layout Style | Windows-classic | Ribbon | Card-based | Tree-tabs | Modern-SaaS |
| Menu Position | Top | Top | Bottom | Left | Top |

## Terminology Differences

| Concept | Cornerstone | Avimark | EasyVet | IntraVet | Covetrus Pulse |
|---------|------------|---------|---------|----------|----------------|
| Patient | Patient | Patient | Animal | Patient | Patient |
| Client | Client | Owner | Owner | Client | Pet Parent |
| Appointment | Appointment | Visit | Booking | Visit | Visit |
| Service | Service | Treatment | Treatment | Procedure | Care Item |
| Medication | Medication | Drug | Product | Pharmaceutical | Product |
| Prescription | Prescription | Rx | Prescription | Script | Rx |
| Invoice | Invoice | Bill | Invoice | Account | Transaction |

## Screen Labels

| Screen | Cornerstone | Avimark | EasyVet | IntraVet | Covetrus Pulse |
|--------|------------|---------|---------|----------|----------------|
| Check-in | Check-In/Out | Check-In | Reception | Registration | Reception |
| Scheduler | Scheduler | Appointments | Calendar | Calendar | Appointment Hub |
| Notes | Notes | Clinical Notes | Clinical Notes | Visit Notes | Clinical Workspace |
| Services | Services | Treatments | Treatments | Procedures | Care Items |
| Invoices | Invoices | Billing | Billing | Accounts | Transactions |
| Records | Medical Records | Patient Records | Health Records | Medical Files | Patient Hub |
| Inventory | Inventory | Inventory Manager | Stock Control | Stock | Inventory Center |
| Communications | Communications | Client Comm | Messaging | Client Connect | Client Connections |
| Pharmacy | Pharmacy | Prescriptions | Pharmacy | Medications | Pharmacy Suite |
| Reports | Reports | Analysis | Analytics | Practice Reports | Insights |

## Workflow Characteristics

| Feature | Cornerstone | Avimark | EasyVet | IntraVet | Covetrus Pulse |
|---------|------------|---------|---------|----------|----------------|
| Data Entry | Form-based with tabbing | Form-based with validation | Clean forms with validation | Mixed form styles | Forms with auto-save |
| Search | Basic search fields | Integrated search bars | Prominent search bars | Search panels | Global search bar |
| Records Access | Hierarchical navigation | Patient-centered tabs | Card-based expandable | Tree-based | Unified view |
| Dialog Style | Modal windows | Modal dialogs | Minimal modals | Mixed approach | Side drawers |
| Multi-tasking | Multiple windows | Tabbed interface | Limited | Tab-based workspaces | Single-page app |

## Implementation Details

| Aspect | Cornerstone | Avimark | EasyVet | IntraVet | Covetrus Pulse |
|--------|------------|---------|---------|----------|----------------|
| CSS Class | .pims-cornerstone | .pims-avimark | .pims-easyvet | .pims-intravet | .pims-covetrus |
| Layout Component | CornerstoneLayout.jsx | AvimarkLayout.jsx | EasyVetLayout.jsx | IntraVetLayout.jsx | CovetrusLayout.jsx |
| Config Key | cornerstone | avimark | easyvet | intravet | covetrus | 