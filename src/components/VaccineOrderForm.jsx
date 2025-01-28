import React, { useState } from 'react';

/**
 * VaccineOrderForm
 *
 * Manages vaccine selection and scheduling.
 * Future expansions could track booster shots, lot numbers, etc.
 */
function VaccineOrderForm() {
  const [vaccineData, setVaccineData] = useState({
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
    // In a real implementation, we'd handle the submission logic here.
    alert('Vaccine order submitted:\n' + JSON.stringify(vaccineData, null, 2));
  };

  return (
    <fieldset style={{ margin: '10px' }}>
      <legend>Order Vaccine</legend>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '8px' }}>
          <label>Vaccine Type:&nbsp;</label>
          <select name="vaccineType" value={vaccineData.vaccineType} onChange={handleChange}>
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