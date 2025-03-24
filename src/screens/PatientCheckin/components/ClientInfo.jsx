import React from 'react';

function ClientInfo({ formData, handleInputChange, styles = {} }) {
  // Default styles if none are provided
  const defaultStyles = {
    fieldset: {},
    legend: {},
    formRow: { display: 'flex', alignItems: 'center', marginBottom: '10px' },
    input: {}
  };

  const s = styles || defaultStyles;

  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>Client Information</legend>

      <div style={s.formRow}>
        <label>Client ID:</label>
        <input
          type="text"
          name="clientId"
          value={formData.clientId}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>First:</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
          <input
            type="text"
            name="clientFirstName"
            value={formData.clientFirstName}
            onChange={handleInputChange}
            style={s.input}
          />
          <label style={{ minWidth: 'auto' }}>Last:</label>
          <input
            type="text"
            name="clientLastName"
            value={formData.clientLastName}
            onChange={handleInputChange}
            style={s.input}
          />
        </div>
      </div>

      <div style={s.formRow}>
        <label>Email:</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
            style={s.input}
          />
          <label style={{ fontSize: s.input?.fontSize || '12px', minWidth: 'auto' }}>
            <input
              type="checkbox"
              name="emailDeclined"
              checked={formData.emailDeclined}
              onChange={handleInputChange}
            />
            Decline
          </label>
        </div>
      </div>

      <div style={s.formRow}>
        <label>Phone(s):</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
          <input
            type="text"
            name="phoneHome"
            value={formData.phoneHome}
            onChange={handleInputChange}
            placeholder="(xxx)xxx-xxxx"
            style={s.input}
          />
          <label style={{ fontSize: s.input?.fontSize || '12px', minWidth: 'auto' }}>Ext:</label>
          <input
            type="text"
            name="phoneExt"
            value={formData.phoneExt}
            onChange={handleInputChange}
            style={{ width: '50px', ...s.input }}
          />
          <label style={{ fontSize: s.input?.fontSize || '12px', minWidth: 'auto' }}>
            <input
              type="checkbox"
              name="phoneDeclined"
              checked={formData.phoneDeclined}
              onChange={handleInputChange}
            />
            Decline
          </label>
        </div>
      </div>
    </fieldset>
  );
}

export default ClientInfo;