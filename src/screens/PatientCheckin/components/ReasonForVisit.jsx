import React from 'react';

function ReasonForVisit({ formData, handleInputChange, styles = {} }) {
  // Default styles if none are provided
  const defaultStyles = {
    fieldset: {},
    legend: {},
    formRow: { display: 'flex', alignItems: 'center', marginBottom: '10px' },
    input: {},
    select: {},
    link: { fontSize: '12px', color: 'blue', textDecoration: 'underline' }
  };

  const s = styles || defaultStyles;

  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>Reason for Visit</legend>

      <div style={s.formRow}>
        <label htmlFor="primary-reason-input">Primary:</label>
        <input
          id="primary-reason-input"
          type="text"
          name="primaryReason"
          value={formData.primaryReason}
          onChange={handleInputChange}
          data-testid="primary-reason-field"
          aria-label="Primary reason for visit"
          aria-required="true"
          style={{ ...s.input, backgroundColor: '#ffbffb' }} // highlight
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="secondary-reason-input">Secondary:</label>
        <input
          id="secondary-reason-input"
          type="text"
          name="secondaryReason"
          value={formData.secondaryReason}
          onChange={handleInputChange}
          data-testid="secondary-reason-field"
          aria-label="Secondary reason for visit"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="room-input">Room:</label>
        <input
          id="room-input"
          type="text"
          name="room"
          value={formData.room}
          onChange={handleInputChange}
          data-testid="room-field"
          aria-label="Examination room number"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="visit-type-select">Type:</label>
        <select
          id="visit-type-select"
          name="visitType"
          value={formData.visitType}
          onChange={handleInputChange}
          data-testid="visit-type-field"
          aria-label="Type of visit"
          style={s.select || s.input}
        >
          <option value="Outpatient">Outpatient</option>
          <option value="Inpatient">Inpatient</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div style={s.formRow}>
        <label htmlFor="status-input">Status:</label>
        <input
          id="status-input"
          type="text"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          data-testid="status-field"
          aria-label="Visit status"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="ward-input">Ward:</label>
        <input
          id="ward-input"
          type="text"
          name="ward"
          value={formData.ward}
          onChange={handleInputChange}
          data-testid="ward-field"
          aria-label="Ward assignment"
          style={s.input}
        />
        <label htmlFor="cage-input">Cage:</label>
        <input
          id="cage-input"
          type="text"
          name="cage"
          value={formData.cage}
          onChange={handleInputChange}
          data-testid="cage-field"
          aria-label="Cage assignment"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>RDVM:</label>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <input
            id="rdvm-name-input"
            type="text"
            name="rdvmName"
            value={formData.rdvmName}
            onChange={handleInputChange}
            data-testid="rdvm-name-field"
            aria-label="Referring veterinarian name"
            style={s.input}
          />
          <a href="#editRDVMs" style={s.link}>add/edit RDVMs</a>
        </div>
      </div>

      <div style={s.formRow}>
        <div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            id="referral-recheck-checkbox"
            type="checkbox"
            name="referralRecheck"
            checked={formData.referralRecheck}
            onChange={handleInputChange}
            data-testid="referral-recheck-checkbox"
            aria-label="Mark as referral recheck"
          />
          <label htmlFor="referral-recheck-checkbox" style={{ fontSize: s.input?.fontSize || '12px' }}>Referral Recheck</label>
        </div>
      </div>
    </fieldset>
  );
}

export default ReasonForVisit;