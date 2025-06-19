import React, { useState, useEffect } from 'react';
import { validationRules, validateForm } from '../../utils/validationRules';
import { getBreedsBySpecies } from '../../services/PatientService';

function PatientRegistrationForm({ clientId, clientName, onSubmit, onCancel }) {
  const [patientData, setPatientData] = useState({
    name: '',
    species: '',
    breed: '',
    color: '',
    sex: '',
    dateOfBirth: '',
    microchip: '',
    weight: '',
    rabiesTag: '',
    alerts: []
  });

  const [breeds, setBreeds] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [customAlert, setCustomAlert] = useState('');

  const fieldRules = {
    name: [validationRules.required, validationRules.minLength(2)],
    species: [validationRules.required],
    breed: [validationRules.required],
    sex: [validationRules.required],
    dateOfBirth: [validationRules.required],
    weight: [validationRules.numeric]
  };

  // Update breeds when species changes
  useEffect(() => {
    if (patientData.species) {
      const speciesBreeds = getBreedsBySpecies(patientData.species);
      setBreeds(speciesBreeds);
      // Reset breed if it's not in the new list
      if (!speciesBreeds.includes(patientData.breed)) {
        setPatientData(prev => ({ ...prev, breed: '' }));
      }
    }
  }, [patientData.species]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, patientData[name]);
  };

  const validateField = (fieldName, value) => {
    const rules = fieldRules[fieldName];
    if (!rules) return;

    const fieldErrors = [];
    rules.forEach(rule => {
      if (rule.pattern && value) {
        if (!rule.pattern.test(value)) {
          fieldErrors.push(rule.message);
        }
      } else if (rule.validate) {
        if (!rule.validate(value)) {
          fieldErrors.push(rule.message);
        }
      }
    });

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length > 0 ? fieldErrors[0] : null
    }));
  };

  const handleAlertToggle = (alert) => {
    setPatientData(prev => ({
      ...prev,
      alerts: prev.alerts.includes(alert)
        ? prev.alerts.filter(a => a !== alert)
        : [...prev.alerts, alert]
    }));
  };

  const handleAddCustomAlert = () => {
    if (customAlert.trim() && !patientData.alerts.includes(customAlert.trim())) {
      setPatientData(prev => ({
        ...prev,
        alerts: [...prev.alerts, customAlert.trim()]
      }));
      setCustomAlert('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all required fields as touched
    const allTouched = {};
    Object.keys(fieldRules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const { isValid, errors: validationErrors } = validateForm(patientData, fieldRules);
    setErrors(validationErrors);

    if (isValid && onSubmit) {
      onSubmit({
        ...patientData,
        clientId,
        weight: patientData.weight ? parseFloat(patientData.weight) : null
      });
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '4px',
    border: '1px solid #000',
    backgroundColor: '#fff'
  };

  const errorStyle = {
    color: '#c00',
    fontSize: '0.875rem',
    marginTop: '2px'
  };

  const requiredLabel = (label) => (
    <>
      {label} <span style={{ color: '#c00' }}>*</span>
    </>
  );

  const predefinedAlerts = ['Aggressive', 'Nervous', 'Escape Risk', 'Special Handling', 'Medical Alert'];

  // Calculate max date (today) for date of birth
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', textAlign: 'left' }}>
      <h3 style={{ marginBottom: '1rem' }}>New Patient Registration</h3>
      {clientName && (
        <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          Owner: {clientName}
        </p>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="name">{requiredLabel('Pet Name')}:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={patientData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...inputStyle,
              borderColor: errors.name ? '#c00' : '#000'
            }}
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>

        <div>
          <label htmlFor="species">{requiredLabel('Species')}:</label>
          <select
            id="species"
            name="species"
            value={patientData.species}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...inputStyle,
              borderColor: errors.species ? '#c00' : '#000'
            }}
          >
            <option value="">Select...</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="exotic">Exotic/Other</option>
          </select>
          {errors.species && <div style={errorStyle}>{errors.species}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label htmlFor="breed">{requiredLabel('Breed')}:</label>
          <select
            id="breed"
            name="breed"
            value={patientData.breed}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!patientData.species}
            style={{
              ...inputStyle,
              borderColor: errors.breed ? '#c00' : '#000',
              cursor: !patientData.species ? 'not-allowed' : 'pointer'
            }}
          >
            <option value="">Select breed...</option>
            {breeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
          {errors.breed && <div style={errorStyle}>{errors.breed}</div>}
        </div>

        <div>
          <label htmlFor="color">Color/Markings:</label>
          <input
            type="text"
            id="color"
            name="color"
            value={patientData.color}
            onChange={handleChange}
            placeholder="e.g., Black and white"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label htmlFor="sex">{requiredLabel('Sex')}:</label>
          <select
            id="sex"
            name="sex"
            value={patientData.sex}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...inputStyle,
              borderColor: errors.sex ? '#c00' : '#000'
            }}
          >
            <option value="">Select...</option>
            <option value="M">Male (Intact)</option>
            <option value="MN">Male (Neutered)</option>
            <option value="F">Female (Intact)</option>
            <option value="FS">Female (Spayed)</option>
          </select>
          {errors.sex && <div style={errorStyle}>{errors.sex}</div>}
        </div>

        <div>
          <label htmlFor="dateOfBirth">{requiredLabel('Date of Birth')}:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={patientData.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            max={today}
            style={{
              ...inputStyle,
              borderColor: errors.dateOfBirth ? '#c00' : '#000'
            }}
          />
          {errors.dateOfBirth && <div style={errorStyle}>{errors.dateOfBirth}</div>}
        </div>

        <div>
          <label htmlFor="weight">Weight (lbs):</label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={patientData.weight}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.0"
            style={{
              ...inputStyle,
              borderColor: errors.weight ? '#c00' : '#000'
            }}
          />
          {errors.weight && <div style={errorStyle}>{errors.weight}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label htmlFor="microchip">Microchip Number:</label>
          <input
            type="text"
            id="microchip"
            name="microchip"
            value={patientData.microchip}
            onChange={handleChange}
            placeholder="15-digit number"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="rabiesTag">Rabies Tag Number:</label>
          <input
            type="text"
            id="rabiesTag"
            name="rabiesTag"
            value={patientData.rabiesTag}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Alerts & Special Instructions:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {predefinedAlerts.map(alert => (
            <label key={alert} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={patientData.alerts.includes(alert)}
                onChange={() => handleAlertToggle(alert)}
                style={{ marginRight: '0.25rem' }}
              />
              {alert}
            </label>
          ))}
        </div>
        
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={customAlert}
            onChange={(e) => setCustomAlert(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAlert())}
            placeholder="Add custom alert..."
            style={{ flex: 1, padding: '4px', border: '1px solid #000' }}
          />
          <button
            type="button"
            onClick={handleAddCustomAlert}
            style={{ padding: '4px 8px', border: '1px solid #000', cursor: 'pointer' }}
          >
            Add
          </button>
        </div>
        
        {patientData.alerts.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Selected alerts: {patientData.alerts.join(', ')}
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
        <span style={{ color: '#c00' }}>*</span> Required fields
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button 
          type="submit" 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#000080',
            color: '#fff',
            border: '2px solid #000',
            cursor: 'pointer'
          }}
        >
          Register Patient
        </button>
        
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#fff',
              color: '#000',
              border: '2px solid #000',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default PatientRegistrationForm;