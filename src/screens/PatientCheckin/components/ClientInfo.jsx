import React from 'react';

function ClientInfo({ formData, handleInputChange }) {
  return (
    <fieldset>
      <legend>Client Information</legend>

      <div className="form-row">
        <label>Client ID:</label>
        <input
          type="text"
          name="clientId"
          value={formData.clientId}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>First:</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
          <input
            type="text"
            name="clientFirstName"
            value={formData.clientFirstName}
            onChange={handleInputChange}
          />
          <label style={{ minWidth: 'auto' }}>Last:</label>
          <input
            type="text"
            name="clientLastName"
            value={formData.clientLastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-row">
        <label>Email:</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
          />
          <label style={{ fontSize: '12px', minWidth: 'auto' }}>
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

      <div className="form-row">
        <label>Phone(s):</label>
        <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
          <input
            type="text"
            name="phoneHome"
            value={formData.phoneHome}
            onChange={handleInputChange}
            placeholder="(xxx)xxx-xxxx"
          />
          <label style={{ fontSize: '12px', minWidth: 'auto' }}>Ext:</label>
          <input
            type="text"
            name="phoneExt"
            value={formData.phoneExt}
            onChange={handleInputChange}
            style={{ width: '50px' }}
          />
          <label style={{ fontSize: '12px', minWidth: 'auto' }}>
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