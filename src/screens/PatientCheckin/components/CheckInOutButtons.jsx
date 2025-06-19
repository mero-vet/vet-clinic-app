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
          <label>Staff ID:</label>
          <input
            type="text"
            name="staffId"
            value={formData.staffId}
            onChange={handleInputChange}
            style={s.input}
          />
        </div>
        <div style={s.formRow}>
          <label>Checked In By:</label>
          <input
            type="text"
            name="checkedInBy"
            value={formData.checkedInBy}
            onChange={handleInputChange}
            style={s.input}
          />
        </div>
        <div style={s.formRow}>
          <label>Check-In Date:</label>
          <input
            type="datetime-local"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleInputChange}
            style={s.input}
          />
        </div>
        <div style={s.formRow}>
          <label>Check-Out Date:</label>
          <input
            type="datetime-local"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleInputChange}
            style={s.input}
          />
        </div>
      </fieldset>

      <button type="button">Check-in</button>
      <button type="button">Check-out</button>
      <button type="button">Travel Sheet</button>
      <button type="button">Make Appt</button>
      <button type="button">Cancel</button>
    </div>
  );
}

export default CheckInOutButtons;