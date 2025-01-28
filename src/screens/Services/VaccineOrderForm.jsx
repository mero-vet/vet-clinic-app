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
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
          <div>
            <label>Client ID:&nbsp;</label>
            <input
              type="text"
              name="clientId"
              value={vaccineData.clientId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Patient ID:&nbsp;</label>
            <input
              type="text"
              name="patientId"
              value={vaccineData.patientId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Vaccine Type:&nbsp;</label>
          <select name="vaccineType" value={vaccineData.vaccineType} onChange={handleChange} required>
            <option value="">-- Select a Vaccine --</option>
            <option value="rabies">Rabies</option>
            <option value="distemper">Distemper/Parvo</option>
            <option value="bordetella">Bordetella</option>
            <option value="felineFVRCP">Feline FVRCP</option>
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Desired Date:&nbsp;</label>
          <input
            type="date"
            name="desiredDate"
            value={vaccineData.desiredDate}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Notes:&nbsp;</label>
          <textarea
            name="notes"
            value={vaccineData.notes}
            onChange={handleChange}
            rows={3}
            cols={30}
          />
        </div>

        <button type="submit" className="windows-button">
          Submit Vaccine Order
        </button>
      </form>
    </fieldset>
  );
}

export default VaccineOrderForm;