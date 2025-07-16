import React, { useState } from 'react';

function VaccineOrderForm() {
  const [vaccineData, setVaccineData] = useState({
    clientId: '',
    patientId: '',
    vaccineType: '',
    desiredDate: '',
    notes: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVaccineData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Vaccine order submitted:\n' + JSON.stringify(vaccineData, null, 2));
  };

  return (
    <fieldset style={{ margin: '10px' }}>
      <legend>Order Vaccine</legend>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="vaccine-client-id">Client ID:&nbsp;</label>
          <input
            id="vaccine-client-id"
            type="text"
            name="clientId"
            value={vaccineData.clientId}
            onChange={handleChange}
            required
            data-testid="vaccine-client-id-input"
            aria-label="Client ID for vaccine order"
            aria-required="true"
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="vaccine-patient-id">Patient ID:&nbsp;</label>
          <input
            id="vaccine-patient-id"
            type="text"
            name="patientId"
            value={vaccineData.patientId}
            onChange={handleChange}
            required
            data-testid="vaccine-patient-id-input"
            aria-label="Patient ID for vaccine order"
            aria-required="true"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="vaccine-type-select">Vaccine Type:&nbsp;</label>
          <select 
            id="vaccine-type-select"
            name="vaccineType" 
            value={vaccineData.vaccineType} 
            onChange={handleChange} 
            required
            data-testid="vaccine-type-select"
            aria-label="Select vaccine type"
            aria-required="true"
          >
            <option value="">-- Select a Vaccine --</option>
            <option value="rabies">Rabies</option>
            <option value="distemper">Distemper/Parvo</option>
            <option value="bordetella">Bordetella</option>
            <option value="felineFVRCP">Feline FVRCP</option>
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="vaccine-desired-date">Desired Date:&nbsp;</label>
          <input
            id="vaccine-desired-date"
            type="date"
            name="desiredDate"
            value={vaccineData.desiredDate}
            onChange={handleChange}
            data-testid="vaccine-desired-date-input"
            aria-label="Desired date for vaccine administration"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="vaccine-notes">Notes:&nbsp;</label>
          <textarea
            id="vaccine-notes"
            name="notes"
            value={vaccineData.notes}
            onChange={handleChange}
            rows={3}
            cols={30}
            data-testid="vaccine-notes-textarea"
            aria-label="Additional notes for vaccine order"
            placeholder="Enter any additional notes"
          />
        </div>

        <button 
          id="vaccine-submit-button"
          type="submit" 
          className="windows-button"
          data-testid="vaccine-submit-button"
          aria-label="Submit vaccine order"
        >
          Submit Vaccine Order
        </button>
      </form>
    </fieldset>
  );
}

export default VaccineOrderForm;