# Toggle Data Feature Plan

## 1. Overview
We want to add a small toggle or dropdown in the top-right corner of our vet clinic demo app, allowing us to switch between:
1. **No Data**: Everything appears blank or uninitialized.
2. **Partial (Thumb) Data**: Minimal fields pre-populated (e.g., basic pet info).
3. **Full Data**: Every field fully populated (mimicking a completed patient visit scenario).

This toggle helps us demonstrate and test different states of the UI—such as an empty new visit vs. a partially or fully filled record.

---

## 2. Requirements

- **UI Placement**: A small UI element (button, toggle, or dropdown) in the top-right header or navigation area.
- **Visibility**: The toggle should be easily accessible, potentially near or integrated with existing UI elements (like the top menu or icon bar).
- **Persistence**: The chosen data state remains consistent until changed again (i.e., if the user navigates elsewhere, the app shouldn’t revert automatically).
- **Global Impact**: Changing the toggle updates the entire application state so that all components reflect the new data state (no data, partial data, or full data).

---

## 3. Data States

### 3.1 No Data
- **Client & Patient Info**: Blank or placeholders.
- **Billing Info**: Zero or empty fields.
- **Documents & Reason for Visit**: No items or text.
- **Reminders & Appointments**: Empty lists.

### 3.2 Partial (Thumb) Data
- **Client**: Basic contact info and partial phone/email.
- **Patient**: Species, name, partial weight data.
- **Billing Info**: Possibly a small balance or address.
- **Reason for Visit**: Only a primary reason, no secondary.
- **Reminders**: Maybe 1–2 upcoming tasks.

### 3.3 Full Data
- **Client**: All fields filled out with realistic data.
- **Patient**: Fully populated breed, birthdate, notes, etc.
- **Billing Info**: Non-zero balance, address, city/state/zip.
- **Documents**: Several example docs attached.
- **Reason for Visit**: Both primary and secondary.
- **Reminders**: Multiple reminders, appointments, or follow-ups.

---

## 4. Implementation Approach

1. **Central State/Context**  
   - Use a new or existing global store (e.g., `PatientContext` or a new context) to store the selected data state.
   - On toggle change, dispatch an action or call a method that overwrites the relevant data in state with the chosen state’s defaults.

2. **Toggle UI**  
   - Could be a small dropdown or set of radio buttons labeled “No Data / Partial / Full.”
   - Placed in the top-right corner near the existing header or nav icons.

3. **Data Injection**  
   - For each state (no data, partial, full), define a small JavaScript object or function that returns the correct default fields.
   - Example:
     ```js
     const noDataDefaults = { ... }
     const partialDataDefaults = { ... }
     const fullDataDefaults = { ... }
     ```
   - After the user changes the toggle, merge or replace current data with the chosen default.

4. **Persistence**  
   - For a simple demo, local state is enough. If needed, store the selection in `localStorage` or keep it ephemeral for live presentations.

5. **Testing**  
   - Switch between states to ensure the UI updates correctly.  
   - Confirm partial data doesn’t blow away custom user inputs if we only want partial merges (or decide it’s always replaced).

---

## 5. Future Considerations
- **Separate Toggles**: Possibly separate toggles for “Blank/Partial/Full” on Patient Info, vs. “Blank/Partial/Full” for Billing or Reminders. But to keep it simple, use a single toggle that sets everything at once.
- **Localization**: If multi-language support is needed, ensure toggles and data presets are localized.
- **Demo Flow**: Potentially highlight the toggle in demos for quickly switching states.

---

## 6. Timeline & Next Steps
1. **Add Toggle UI**: Place a simple dropdown or button group in the top-right corner.  
2. **Implement Data Presets**: Create JavaScript objects for each data state.  
3. **Update Context**: Add logic so toggling updates global context and re-renders all relevant components.  
4. **Test & Refine**: Ensure partial data merges or replaces fields as desired.

Once this is done, we can easily demonstrate how the app behaves with no data, partial data, or a fully populated scenario.