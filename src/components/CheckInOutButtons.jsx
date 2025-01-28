import React from 'react';

function CheckInOutButtons({ formData, handleInputChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <fieldset>
        <legend>Check-In/Out Info</legend>
        <div className="form-row">
          <label>Staff ID:</label>
          <input
            type="text"
            name="staffId"
            value={formData.staffId}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <label>Checked In By:</label>
          <input
            type="text"
            name="checkedInBy"
            value={formData.checkedInBy}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <label>Check-In Date:</label>
          <input
            type="datetime-local"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <label>Check-Out Date:</label>
          <input
            type="datetime-local"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleInputChange}
          />
        </div>
      </fieldset>

      <button className="windows-button" type="button">Check-in</button>
      <button className="windows-button" type="button">Check-out</button>
      <button className="windows-button" type="button">Travel Sheet</button>
      <button className="windows-button" type="button">Make Appt</button>
      <button className="windows-button" type="button">Cancel</button>
    </div>
  );
}

export default CheckInOutButtons;