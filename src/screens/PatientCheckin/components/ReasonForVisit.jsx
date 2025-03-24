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
        <label>Primary:</label>
        <input
          type="text"
          name="primaryReason"
          value={formData.primaryReason}
          onChange={handleInputChange}
          style={{ ...s.input, backgroundColor: '#ffbffb' }} // highlight
        />
      </div>

      <div style={s.formRow}>
        <label>Secondary:</label>
        <input
          type="text"
          name="secondaryReason"
          value={formData.secondaryReason}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>Room:</label>
        <input
          type="text"
          name="room"
          value={formData.room}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>Type:</label>
        <select
          name="visitType"
          value={formData.visitType}
          onChange={handleInputChange}
          style={s.select || s.input}
        >
          <option value="Outpatient">Outpatient</option>
          <option value="Inpatient">Inpatient</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div style={s.formRow}>
        <label>Status:</label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>Ward:</label>
        <input
          type="text"
          name="ward"
          value={formData.ward}
          onChange={handleInputChange}
          style={s.input}
        />
        <label>Cage:</label>
        <input
          type="text"
          name="cage"
          value={formData.cage}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>RDVM:</label>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <input
            type="text"
            name="rdvmName"
            value={formData.rdvmName}
            onChange={handleInputChange}
            style={s.input}
          />
          <a href="#editRDVMs" style={s.link}>add/edit RDVMs</a>
        </div>
      </div>

      <div style={s.formRow}>
        <div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            name="referralRecheck"
            checked={formData.referralRecheck}
            onChange={handleInputChange}
          />
          <label style={{ fontSize: s.input?.fontSize || '12px' }}>Referral Recheck</label>
        </div>
      </div>
    </fieldset>
  );
}

export default ReasonForVisit;