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
        <label htmlFor="patient-id-input">Patient ID:</label>
        <input
          id="patient-id-input"
          type="text"
          name="patientId"
          value={formData.patientId}
          onChange={handleInputChange}
          data-testid="patient-id-field"
          aria-label="Patient ID number"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="patient-name-input">Name:</label>
        <input
          id="patient-name-input"
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleInputChange}
          data-testid="patient-name-field"
          aria-label="Patient name"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="patient-species-select">Species:</label>
        <select
          id="patient-species-select"
          name="species"
          value={formData.species}
          onChange={handleInputChange}
          data-testid="patient-species-field"
          aria-label="Patient species"
          style={s.select || s.input}
        >
          <option value="">--Select--</option>
          <option value="Canine">Canine</option>
          <option value="Feline">Feline</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="patient-sex-select">Sex:</label>
        <select
          id="patient-sex-select"
          name="sex"
          value={formData.sex}
          onChange={handleInputChange}
          data-testid="patient-sex-field"
          aria-label="Patient sex"
          style={s.select || s.input}
        >
          <option value="">--Select--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div style={s.formRow}>
        <label htmlFor="patient-breed-input">Breed:</label>
        <input
          id="patient-breed-input"
          type="text"
          name="breed"
          value={formData.breed}
          onChange={handleInputChange}
          data-testid="patient-breed-field"
          aria-label="Patient breed"
          style={s.input}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="patient-birthdate-input">Birth Date:</label>
        <input
          id="patient-birthdate-input"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          data-testid="patient-birthdate-field"
          aria-label="Patient birth date"
          style={s.input}
        />
        <label style={{ fontSize: s.input?.fontSize || '12px' }}>
          Age (Y M D):
        </label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            id="patient-age-years-input"
            type="text"
            name="ageYears"
            value={formData.ageYears}
            onChange={handleInputChange}
            data-testid="patient-age-years-field"
            aria-label="Age in years"
            style={{ width: '40px', ...s.input }}
            placeholder="Y"
          />
          <input
            id="patient-age-months-input"
            type="text"
            name="ageMonths"
            value={formData.ageMonths}
            onChange={handleInputChange}
            data-testid="patient-age-months-field"
            aria-label="Age in months"
            style={{ width: '40px', ...s.input }}
            placeholder="M"
          />
          <input
            id="patient-age-days-input"
            type="text"
            name="ageDays"
            value={formData.ageDays}
            onChange={handleInputChange}
            data-testid="patient-age-days-field"
            aria-label="Age in days"
            style={{ width: '40px', ...s.input }}
            placeholder="D"
          />
        </div>
      </div>

      <div style={s.formRow}>
        <label htmlFor="patient-weight-date-input">Weight Date:</label>
        <input
          id="patient-weight-date-input"
          type="date"
          name="weightDate"
          value={formData.weightDate}
          onChange={handleInputChange}
          data-testid="patient-weight-date-field"
          aria-label="Weight measurement date"
          style={s.input}
        />
        <label htmlFor="patient-weight-input" style={{ fontSize: s.input?.fontSize || '12px' }}>
          Lbs:
        </label>
        <input
          id="patient-weight-input"
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          data-testid="patient-weight-field"
          aria-label="Patient weight in pounds"
          style={{ width: '60px', ...s.input }}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="patient-additional-notes">Additional Notes:</label>
        <textarea
          id="patient-additional-notes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
          data-testid="patient-additional-notes-field"
          aria-label="Additional notes about patient"
          style={s.textarea || s.input}
        />
      </div>

      <div style={s.formRow}>
        <label htmlFor="patient-alert-notes">Alert Notes:</label>
        <textarea
          id="patient-alert-notes"
          name="alertNotes"
          value={formData.alertNotes}
          onChange={handleInputChange}
          data-testid="patient-alert-notes-field"
          aria-label="Alert notes for patient"
          style={s.textarea || s.input}
        />
      </div>
    </fieldset>
  );
}

export default PatientInfo;