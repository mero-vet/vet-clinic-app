import React, { useState } from 'react';

/**
 * LabTestOrderForm
 * 
 * Allows users to specify which lab tests to order,
 * collect required info, and submit the order.
 */
function LabTestOrderForm() {
  const [labData, setLabData] = useState({
    testType: '',
    additionalNotes: '',
    collectionDate: '',
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
    // In a future iteration, submit the data to context or an API.
    alert('Lab test order submitted:\n' + JSON.stringify(labData, null, 2));
  };

  return (
    <fieldset style={{ margin: '10px' }}>
      <legend>Order Lab Test</legend>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '8px' }}>
          <label>Test Type:&nbsp;</label>
          <select name="testType" value={labData.testType} onChange={handleChange}>
            <option value="">-- Select a Test --</option>
            <option value="cbc">CBC (Complete Blood Count)</option>
            <option value="chemPanel">Chemistry Panel</option>
            <option value="fecal">Fecal Examination</option>
            <option value="urinalysis">Urinalysis</option>
          </select>
        </div>

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

        <button type="submit" className="windows-button">
          Submit Lab Order
        </button>
      </form>
    </fieldset>
  );
}

export default LabTestOrderForm;