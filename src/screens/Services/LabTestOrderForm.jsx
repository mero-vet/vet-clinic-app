import React, { useState } from 'react';

function LabTestOrderForm() {
  const [labData, setLabData] = useState({
    clientId: '',
    patientId: '',
    testType: '',
    additionalNotes: '',
    collectionDate: '',
    specificTest: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLabData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Lab test order submitted:\n' + JSON.stringify(labData, null, 2));
  };

  return (
    <fieldset style={{ margin: '10px', padding: '8px 12px' }}>
      <legend>Order Lab Test</legend>
      <form onSubmit={handleSubmit} style={{ margin: 0 }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
          <div>
            <label>Client ID:&nbsp;</label>
            <input
              type="text"
              name="clientId"
              value={labData.clientId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Patient ID:&nbsp;</label>
            <input
              type="text"
              name="patientId"
              value={labData.patientId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Test Type:&nbsp;</label>
          <select name="testType" value={labData.testType} onChange={handleChange} required>
            <option value="">-- Select a Test --</option>
            <option value="cbc">CBC (Complete Blood Count)</option>
            <option value="chemPanel">Chemistry Panel</option>
            <option value="fecal">Fecal Examination</option>
            <option value="urinalysis">Urinalysis</option>
            <option value="other">Other</option>
          </select>
        </div>

        {labData.testType === 'other' && (
          <div style={{ marginBottom: '8px' }}>
            <label>Specify Test:&nbsp;</label>
            <input
              type="text"
              name="specificTest"
              value={labData.specificTest}
              onChange={handleChange}
              placeholder="Enter specific test name"
              required
            />
          </div>
        )}

        <div style={{ marginBottom: '8px' }}>
          <label>Collection Date:&nbsp;</label>
          <input
            type="date"
            name="collectionDate"
            value={labData.collectionDate}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Additional Notes:&nbsp;</label>
          <textarea
            name="additionalNotes"
            value={labData.additionalNotes}
            onChange={handleChange}
            rows={3}
            cols={30}
          />
        </div>

        <button type="submit" className="windows-button" style={{ marginBottom: 0 }}>
          Submit Lab Order
        </button>
      </form>
    </fieldset>
  );
}

export default LabTestOrderForm;