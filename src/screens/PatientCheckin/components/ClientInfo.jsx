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
        <label htmlFor="client-id-input">Client ID:</label>
        <input
          id="client-id-input"
          type="text"
          name="clientId"
          value={formData.clientId}
          onChange={handleInputChange}
          data-testid="client-id-field"
          aria-label="Client ID number"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>First:</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
          <input
            id="client-firstname-input"
            type="text"
            name="clientFirstName"
            value={formData.clientFirstName}
            onChange={handleInputChange}
            data-testid="client-firstname-field"
            aria-label="Client first name"
            style={s.input}
          />
          <label htmlFor="client-lastname-input" style={{ minWidth: 'auto' }}>Last:</label>
          <input
            id="client-lastname-input"
            type="text"
            name="clientLastName"
            value={formData.clientLastName}
            onChange={handleInputChange}
            data-testid="client-lastname-field"
            aria-label="Client last name"
            style={s.input}
          />
        </div>
      </div>

      <div style={s.formRow}>
        <label>Email:</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
          <input
            id="client-email-input"
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
            data-testid="client-email-field"
            aria-label="Client email address"
            style={s.input}
          />
          <label htmlFor="email-declined-checkbox" style={{ fontSize: s.input?.fontSize || '12px', minWidth: 'auto' }}>
            <input
              id="email-declined-checkbox"
              type="checkbox"
              name="emailDeclined"
              checked={formData.emailDeclined}
              onChange={handleInputChange}
              data-testid="email-declined-checkbox"
              aria-label="Decline email communications"
            />
            Decline
          </label>
        </div>
      </div>

      <div style={s.formRow}>
        <label>Phone(s):</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
          <input
            id="client-phone-input"
            type="text"
            name="phoneHome"
            value={formData.phoneHome}
            onChange={handleInputChange}
            placeholder="(xxx)xxx-xxxx"
            data-testid="client-phone-field"
            aria-label="Client phone number"
            style={s.input}
          />
          <label htmlFor="phone-ext-input" style={{ fontSize: s.input?.fontSize || '12px', minWidth: 'auto' }}>Ext:</label>
          <input
            id="phone-ext-input"
            type="text"
            name="phoneExt"
            value={formData.phoneExt}
            onChange={handleInputChange}
            data-testid="phone-ext-field"
            aria-label="Phone extension"
            style={{ width: '50px', ...s.input }}
          />
          <label htmlFor="phone-declined-checkbox" style={{ fontSize: s.input?.fontSize || '12px', minWidth: 'auto' }}>
            <input
              id="phone-declined-checkbox"
              type="checkbox"
              name="phoneDeclined"
              checked={formData.phoneDeclined}
              onChange={handleInputChange}
              data-testid="phone-declined-checkbox"
              aria-label="Decline phone communications"
            />
            Decline
          </label>
        </div>
      </div>
    </fieldset>
  );
}

export default ClientInfo;