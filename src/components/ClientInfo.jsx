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
        <label style={{ width: '40px' }}></label>
        <div></div>
      </div>

      <div className="form-row">
        <label>First:</label>
        <input
          type="text"
          name="clientFirstName"
          value={formData.clientFirstName}
          onChange={handleInputChange}
        />
        <label>Last:</label>
        <input
          type="text"
          name="clientLastName"
          value={formData.clientLastName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Email:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
            style={{ width: '150px' }}
          />
          <label style={{ fontSize: '12px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <input
              type="text"
              name="phoneHome"
              value={formData.phoneHome}
              onChange={handleInputChange}
              placeholder="(xxx)xxx-xxxx"
            />
            <label style={{ fontSize: '12px' }}>Ext:</label>
            <input
              type="text"
              name="phoneExt"
              value={formData.phoneExt}
              onChange={handleInputChange}
              style={{ width: '50px' }}
            />
            <label style={{ fontSize: '12px' }}>
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
      </div>
    </fieldset>
  );
}

export default ClientInfo;