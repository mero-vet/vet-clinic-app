# Cornerstone UI Build-Out Plan

This document outlines the plan for the top menu, the 10 icons, and the general architecture to replicate a “Cornerstone”-style front-end environment. Everything is front-end only (no real backend/database).

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

Each menu item has a drop-down sub-menu that appears on hover. For now, these sub-menu items are placeholders and do not perform any action.

### Row of 10 Icons

Below are the 10 icons we’re featuring, each potentially mapping to its own screen or function:

1. **Appointments**  
   - Opens a scheduling or calendar view to manage appointments.  

2. **Invoices**  
   - Displays invoice creation, editing, and payment interfaces.  

3. **Patient Records**  
   - Navigates to patient record management or summary.  

4. **Lab Orders**  
   - Offers a form/UI for ordering lab tests.  

5. **Pharmacy**  
   - Opens a medication prescribing interface or pharmacy management UI.  

6. **Payments**  
   - Handles various payment options, transaction logs, or receipts.  

7. **Check-In/Out**  
   - Manages patient arrivals and departures, plus staff check-in/out if needed.  

8. **Notes**  
   - Displays or creates new notes pertaining to patients or general tasks.  

9. **Reminders**  
   - Sets or views reminders for follow-up visits, vaccinations, etc.  

10. **Reports**  
   - Accesses different report types, analytics, or daily summaries.  

All are placeholders now, but each icon can route to a distinct component/page as the project evolves.

---

## 2. Project Architecture

1. **UI-Only Approach**  
   - All data is stored in React state or local objects.  
   - No backend or API calls are involved.

2. **Routing**  
   - React Router handles page navigation.  
   - `/` for Patient Check-In by default, plus other routes (e.g., `/visit-list`).  
   - Each icon (Appointments, Invoices, etc.) may eventually have its own path or screen.

3. **Context/State Management**  
   - `PatientContext` (already existing) for patient data.  
   - Potential additional contexts for scheduling, inventory, etc. as needed.

4. **Components**  
   - **Main Menu & Icon Bar**: Implemented in `App.jsx` with Windows Classic styling.  
   - **Screen Components**: Each icon can load a specialized component.  
   - **Shared Styles**: `WindowsClassic.css` & `PatientForms.css`.

5. **Documents Folder**  
   - Holds design docs, architecture proposals, and step-by-step build guides.

---

## 3. Step-by-Step Implementation Plan

1. **Create Windows Classic Parent Window** – *Done*: Top-level window with “Cornerstone” title, minimize/max/close.  
2. **Add Dropdown Menus** – *Done*: Hover-based drop-down menus for the top bar.  
3. **Implement 10 Icon Bar** – *Done*: Real icon images with placeholders for future screens.  
4. **Route Configuration** – Continue expanding `App.jsx` with `Routes` for each new screen.  
5. **Screen Components** – Build out the functionality for each icon step by step.  
6. **Expand Context or Redux** – As new features require global state.  
7. **Refine UI/UX** – Revisit styling, reorganize layout for better user experience.  
8. **Documentation** – Update this plan and detail every new feature as it’s developed.

We will keep everything modular and consistent with the Windows Classic theme while adding new features over time.