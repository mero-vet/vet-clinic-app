# Cornerstone UI Build-Out Plan

This document outlines the plan for the top menu, the icon bar, and the general architecture to replicate a “Cornerstone”-style front-end environment. All remains front-end only (no real backend/database).

---

## 1. Top Menu and Icons

### Menu Bar Items

- **File**  
- **Edit**  
- **Activities**  
- **Lists**  
- **Controls**  
- **Inventory**  
- **Tools**  
- **Reports**  
- **Web Links**  
- **Window**  
- **Help**  

Each menu item has a drop-down sub-menu that appears on hover. Currently, these sub-menu items are placeholders and do not perform any real action.

### Row of Icons

We have at least five icons that tie directly to the new screens:

1. **Check-In/Out** — Leads to the Patient Check-In screen.  
2. **Invoices** — Leads to the Invoice screen for billing, payments, etc.  
3. **Services** — Opens the services screen for lab/vaccine ordering.  
4. **Notes** — Opens the note-taking screen.  
5. **Visit List** — Navigates to the Patient Visit List screen.  

Additional icons can be added or retired as needed.

---

## 2. Project Architecture

1. **UI-Only Approach**  
   - All data is stored in React state or context.  
   - No backend or API calls aside from mock or local data.  

2. **Routing**  
   - React Router handles page navigation.  
   - We have routes for `/checkin`, `/visit-list`, `/services`, `/invoice`, `/create-client`, and `/notes`.  
   - Default `/` also goes to the Check-In screen.

3. **Context/State Management**  
   - `PatientContext` for patient data.  
   - `InvoiceContext` for invoices.  
   - `NoteContext` for notes.  
   - `SchedulingContext` (future) for appointments.  

4. **Components vs. Screens**  
   - **Screens** live under `src/screens`:  
     - **PatientCheckinScreen** (was `PatientCheckin.jsx`)  
     - **ServicesScreen** (was `ServicesMain.jsx`)  
     - **CreateNewClientScreen** (was `CreateNewClient.jsx`)  
     - **ClientCreationSuccessScreen** (was `ClientCreationSuccess.jsx`)  
     - **InvoiceScreen** (was `InvoiceMain.jsx`)  
     - **NoteScreen** (was `NoteTaking.jsx`)  

   - **Reusable Components** remain in `src/components`. Examples include:  
     - `ClientInfo`, `PatientInfo`, `ReasonForVisit`, `DocumentsList`, `RemindersAppointments`  
     - `CheckInOutButtons`, `NewClientForm`, `Scheduling/*`, `invoicing/*`, etc.

---

## 3. Detailed Screen List

Below is a breakdown of each screen and the components it relies on:

1. **PatientCheckinScreen**  
   - Includes `ClientInfo`, `PatientInfo`, `ReasonForVisit`, `DocumentsList`, `RemindersAppointments`, `CheckInOutButtons`.

2. **ServicesScreen**  
   - Integrates `ServicesCatalog`, `LabTestOrderForm`, `VaccineOrderForm`, and `OrdersHistory` (all from `src/components`).

3. **CreateNewClientScreen**  
   - Embeds `NewClientForm`; also shows `ClientCreationSuccessScreen` conditionally.

4. **ClientCreationSuccessScreen**  
   - Simple success confirmation message once a new client is created.

5. **InvoiceScreen**  
   - Provides invoice creation via `InvoiceSearchBar`, `InvoiceLineItems`, `InvoiceTotals`, and `InvoiceActions`.

6. **NoteScreen**  
   - Uses `NoteContext`, plus `AddNoteForm` and `NoteList` for note-taking.

---

## 4. Additional Components Needed

- **SchedulingScreen** (Future) — We may create a dedicated screen for scheduling appointments, leveraging `CalendarView`, `AppointmentList`, `NewAppointmentForm`.  
- **(Optional) PaymentScreen** — If we want a separate screen specifically for payments.  

---

## 5. Components or Icons Potentially Retired

- Certain older icons (e.g., “Pharmacy,” “Reports”) might be removed if not in active use.  
- If a new screen is not planned, the corresponding icon can be hidden or repurposed.

---

## 6. Implementation Steps

1. **Refactor**: Move/rename large container components (screens) into `src/screens`.  
2. **Update Imports**: In `App.jsx`, reference new screen paths and define appropriate routes.  
3. **Cleanup**: Possibly remove or repurpose icons and placeholders if not needed.  
4. **Expand**: Add new screens or contexts as features (e.g., scheduling) are fully built out.

This plan ensures a clear separation between **screens** (top-level pages) and **reusable components**, making the Cornerstone UI more manageable and scalable.