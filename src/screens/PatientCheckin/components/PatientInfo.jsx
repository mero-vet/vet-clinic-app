import React from 'react';

function PatientInfo({ formData, handleInputChange }) {
  return (
    <fieldset>
      <legend>Patient Information</legend>

      <div className="form-row">
        <label>Patient ID:</label>
        <input
          type="text"
          name="patientId"
          value={formData.patientId}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Name:</label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Species:</label>
        <select
          name="species"
          value={formData.species}
          onChange={handleInputChange}
        >
          <option value="">--Select--</option>
          <option value="Canine">Canine</option>
          <option value="Feline">Feline</option>
          <option value="Other">Other</option>
        </select>

        <label>Sex:</label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleInputChange}
        >
          <option value="">--Select--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-row">
        <label>Breed:</label>
        <input
          type="text"
          name="breed"
          value={formData.breed}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Birth Date:</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
        />
        <label style={{ fontSize: '12px' }}>
          Age (Y M D):
        </label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            name="ageYears"
            value={formData.ageYears}
            onChange={handleInputChange}
            style={{ width: '40px' }}
            placeholder="Y"
          />
          <input
            type="text"
            name="ageMonths"
            value={formData.ageMonths}
            onChange={handleInputChange}
            style={{ width: '40px' }}
            placeholder="M"
          />
          <input
            type="text"
            name="ageDays"
            value={formData.ageDays}
            onChange={handleInputChange}
            style={{ width: '40px' }}
            placeholder="D"
          />
        </div>
      </div>

      <div className="form-row">
        <label>Weight Date:</label>
        <input
          type="date"
          name="weightDate"
          value={formData.weightDate}
          onChange={handleInputChange}
        />
        <label style={{ fontSize: '12px' }}>
          Lbs:
        </label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          style={{ width: '60px' }}
        />
      </div>

      <div className="form-row">
        <label>Additional Notes:</label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Alert Notes:</label>
        <textarea
          name="alertNotes"
          value={formData.alertNotes}
          onChange={handleInputChange}
        />
      </div>
    </fieldset>
  );
}

export default PatientInfo;