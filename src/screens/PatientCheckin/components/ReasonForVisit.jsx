import React from 'react';

function ReasonForVisit({ formData, handleInputChange }) {
  return (
    <fieldset>
      <legend>Reason for Visit</legend>

      <div className="form-row">
        <label>Primary:</label>
        <input
          type="text"
          name="primaryReason"
          value={formData.primaryReason}
          onChange={handleInputChange}
          style={{ backgroundColor: '#ffbffb' }} // highlight
        />
      </div>

      <div className="form-row">
        <label>Secondary:</label>
        <input
          type="text"
          name="secondaryReason"
          value={formData.secondaryReason}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Room:</label>
        <input
          type="text"
          name="room"
          value={formData.room}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Type:</label>
        <select
          name="visitType"
          value={formData.visitType}
          onChange={handleInputChange}
        >
          <option value="Outpatient">Outpatient</option>
          <option value="Inpatient">Inpatient</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="form-row">
        <label>Status:</label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Ward:</label>
        <input
          type="text"
          name="ward"
          value={formData.ward}
          onChange={handleInputChange}
        />
        <label>Cage:</label>
        <input
          type="text"
          name="cage"
          value={formData.cage}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>RDVM:</label>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <input
            type="text"
            name="rdvmName"
            value={formData.rdvmName}
            onChange={handleInputChange}
          />
          <a href="#editRDVMs" style={{ fontSize: '12px' }}>add/edit RDVMs</a>
        </div>
      </div>

      <div className="form-row">
        <div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            name="referralRecheck"
            checked={formData.referralRecheck}
            onChange={handleInputChange}
          />
          <label style={{ fontSize: '12px' }}>Referral Recheck</label>
        </div>
      </div>
    </fieldset>
  );
}

export default ReasonForVisit;