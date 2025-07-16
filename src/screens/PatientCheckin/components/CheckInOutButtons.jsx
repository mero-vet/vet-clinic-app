import React from 'react';

function CheckInOutButtons({ formData, handleInputChange, styles = {} }) {
  // Default styles if none are provided
  const defaultStyles = {
    fieldset: {},
    legend: {},
    formRow: { display: 'flex', alignItems: 'center', marginBottom: '10px' },
    input: {},
    button: {}
  };

  const s = styles || defaultStyles;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <fieldset style={s.fieldset}>
        <legend style={s.legend}>Check-In/Out Info</legend>
        <div style={s.formRow}>
          <label htmlFor="staff-id-input">Staff ID:</label>
          <input
            id="staff-id-input"
            type="text"
            name="staffId"
            value={formData.staffId}
            onChange={handleInputChange}
            data-testid="staff-id-field"
            aria-label="Staff ID number"
            style={s.input}
          />
        </div>
        <div style={s.formRow}>
          <label htmlFor="checked-in-by-input">Checked In By:</label>
          <input
            id="checked-in-by-input"
            type="text"
            name="checkedInBy"
            value={formData.checkedInBy}
            onChange={handleInputChange}
            data-testid="checked-in-by-field"
            aria-label="Staff member who checked in patient"
            style={s.input}
          />
        </div>
        <div style={s.formRow}>
          <label htmlFor="check-in-date-input">Check-In Date:</label>
          <input
            id="check-in-date-input"
            type="datetime-local"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleInputChange}
            data-testid="check-in-date-field"
            aria-label="Patient check-in date and time"
            style={s.input}
          />
        </div>
        <div style={s.formRow}>
          <label htmlFor="check-out-date-input">Check-Out Date:</label>
          <input
            id="check-out-date-input"
            type="datetime-local"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleInputChange}
            data-testid="check-out-date-field"
            aria-label="Patient check-out date and time"
            style={s.input}
          />
        </div>
      </fieldset>

      <button 
        id="check-in-button"
        type="button"
        data-testid="check-in-action-button"
        aria-label="Check in patient"
      >
        Check-in
      </button>
      <button 
        id="check-out-button"
        type="button"
        data-testid="check-out-action-button"
        aria-label="Check out patient"
      >
        Check-out
      </button>
      <button 
        id="travel-sheet-button"
        type="button"
        data-testid="travel-sheet-button"
        aria-label="Generate travel sheet"
      >
        Travel Sheet
      </button>
      <button 
        id="make-appointment-button"
        type="button"
        data-testid="make-appointment-button"
        aria-label="Make new appointment"
      >
        Make Appt
      </button>
      <button 
        id="cancel-button"
        type="button"
        data-testid="cancel-button"
        aria-label="Cancel check-in"
      >
        Cancel
      </button>
    </div>
  );
}

export default CheckInOutButtons;