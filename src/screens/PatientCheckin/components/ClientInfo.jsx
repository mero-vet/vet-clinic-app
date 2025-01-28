import React from 'react';

function ClientInfo({ formData, handleInputChange }) {
  return (
    <fieldset style={{ minWidth: 0, width: '100%', height: 'fit-content' }}>
      <legend>Client Information</legend>

      <div className="form-row" style={{ flexWrap: 'wrap' }}>
        <label>Client ID:</label>
        <input
          type="text"
          name="clientId"
          value={formData.clientId}
          onChange={handleInputChange}
          style={{ flex: 1, minWidth: '120px' }}
        />
      </div>

      <div className="form-row" style={{ flexWrap: 'wrap' }}>
        <label>First:</label>
        <input
          type="text"
          name="clientFirstName"
          value={formData.clientFirstName}
          onChange={handleInputChange}
          style={{ flex: 1, minWidth: '120px' }}
        />
        <label style={{ minWidth: '50px' }}>Last:</label>
        <input
          type="text"
          name="clientLastName"
          value={formData.clientLastName}
          onChange={handleInputChange}
          style={{ flex: 1, minWidth: '120px' }}
        />
      </div>

      <div className="form-row" style={{ flexWrap: 'wrap' }}>
        <label>Email:</label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          flex: 1,
          minWidth: '200px',
          flexWrap: 'wrap'
        }}>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
            style={{ flex: 1, minWidth: '150px' }}
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

      <div className="form-row" style={{ flexWrap: 'wrap' }}>
        <label>Phone(s):</label>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
          minWidth: '200px'
        }}>
          <div style={{
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              name="phoneHome"
              value={formData.phoneHome}
              onChange={handleInputChange}
              placeholder="(xxx)xxx-xxxx"
              style={{ flex: 1, minWidth: '120px' }}
            />
            <label style={{ fontSize: '12px', minWidth: 'auto' }}>Ext:</label>
            <input
              type="text"
              name="phoneExt"
              value={formData.phoneExt}
              onChange={handleInputChange}
              style={{ width: '50px', minWidth: '50px' }}
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
      </div>
    </fieldset>
  );
}

export default ClientInfo;