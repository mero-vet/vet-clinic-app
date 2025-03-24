import React from 'react';

function PatientInfo({ formData, handleInputChange, styles = {} }) {
  // Default styles if none are provided
  const defaultStyles = {
    fieldset: {},
    legend: {},
    formRow: { display: 'flex', alignItems: 'center', marginBottom: '10px' },
    input: {},
    select: {},
    textarea: {}
  };

  const s = styles || defaultStyles;

  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>Patient Information</legend>

      <div style={s.formRow}>
        <label>Patient ID:</label>
        <input
          type="text"
          name="patientId"
          value={formData.patientId}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>Name:</label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>Species:</label>
        <select
          name="species"
          value={formData.species}
          onChange={handleInputChange}
          style={s.select || s.input}
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
          style={s.select || s.input}
        >
          <option value="">--Select--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div style={s.formRow}>
        <label>Breed:</label>
        <input
          type="text"
          name="breed"
          value={formData.breed}
          onChange={handleInputChange}
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>Birth Date:</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          style={s.input}
        />
        <label style={{ fontSize: s.input?.fontSize || '12px' }}>
          Age (Y M D):
        </label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            name="ageYears"
            value={formData.ageYears}
            onChange={handleInputChange}
            style={{ width: '40px', ...s.input }}
            placeholder="Y"
          />
          <input
            type="text"
            name="ageMonths"
            value={formData.ageMonths}
            onChange={handleInputChange}
            style={{ width: '40px', ...s.input }}
            placeholder="M"
          />
          <input
            type="text"
            name="ageDays"
            value={formData.ageDays}
            onChange={handleInputChange}
            style={{ width: '40px', ...s.input }}
            placeholder="D"
          />
        </div>
      </div>

      <div style={s.formRow}>
        <label>Weight Date:</label>
        <input
          type="date"
          name="weightDate"
          value={formData.weightDate}
          onChange={handleInputChange}
          style={s.input}
        />
        <label style={{ fontSize: s.input?.fontSize || '12px' }}>
          Lbs:
        </label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          style={{ width: '60px', ...s.input }}
        />
      </div>

      <div style={s.formRow}>
        <label>Additional Notes:</label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
          style={s.textarea || s.input}
        />
      </div>

      <div style={s.formRow}>
        <label>Alert Notes:</label>
        <textarea
          name="alertNotes"
          value={formData.alertNotes}
          onChange={handleInputChange}
          style={s.textarea || s.input}
        />
      </div>
    </fieldset>
  );
}

export default PatientInfo;