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
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="lab-client-id">Client ID:&nbsp;</label>
          <input
            id="lab-client-id"
            type="text"
            name="clientId"
            value={labData.clientId}
            onChange={handleChange}
            required
            data-testid="lab-client-id-input"
            aria-label="Client ID for lab test order"
            aria-required="true"
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="lab-patient-id">Patient ID:&nbsp;</label>
          <input
            id="lab-patient-id"
            type="text"
            name="patientId"
            value={labData.patientId}
            onChange={handleChange}
            required
            data-testid="lab-patient-id-input"
            aria-label="Patient ID for lab test order"
            aria-required="true"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="lab-test-type">Test Type:&nbsp;</label>
          <select 
            id="lab-test-type"
            name="testType" 
            value={labData.testType} 
            onChange={handleChange} 
            required
            data-testid="lab-test-type-select"
            aria-label="Select lab test type"
            aria-required="true"
          >
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
            <label htmlFor="lab-specific-test">Specify Test:&nbsp;</label>
            <input
              id="lab-specific-test"
              type="text"
              name="specificTest"
              value={labData.specificTest}
              onChange={handleChange}
              placeholder="Enter specific test name"
              required
              data-testid="lab-specific-test-input"
              aria-label="Specify custom lab test name"
              aria-required="true"
            />
          </div>
        )}

        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="lab-collection-date">Collection Date:&nbsp;</label>
          <input
            id="lab-collection-date"
            type="date"
            name="collectionDate"
            value={labData.collectionDate}
            onChange={handleChange}
            data-testid="lab-collection-date-input"
            aria-label="Date for lab sample collection"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="lab-additional-notes">Additional Notes:&nbsp;</label>
          <textarea
            id="lab-additional-notes"
            name="additionalNotes"
            value={labData.additionalNotes}
            onChange={handleChange}
            rows={3}
            cols={30}
            data-testid="lab-additional-notes-textarea"
            aria-label="Additional notes for lab test order"
            placeholder="Enter any additional notes or instructions"
          />
        </div>

        <button 
          id="lab-submit-button"
          type="submit" 
          className="windows-button" 
          style={{ marginBottom: 0 }}
          data-testid="lab-submit-button"
          aria-label="Submit lab test order"
        >
          Submit Lab Order
        </button>
      </form>
    </fieldset>
  );
}

export default LabTestOrderForm;