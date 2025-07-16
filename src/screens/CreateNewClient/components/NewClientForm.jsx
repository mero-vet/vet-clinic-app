import React, { useState } from 'react';
import { validationRules, formatters, validateForm } from '../../../utils/validationRules';

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

function NewClientForm({ onSubmit }) {
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    preferredContact: 'phone',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const fieldRules = {
    firstName: [validationRules.required, validationRules.alphaOnly, validationRules.minLength(2)],
    lastName: [validationRules.required, validationRules.alphaOnly, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone],
    alternatePhone: [validationRules.phone],
    street: [validationRules.required],
    city: [validationRules.required, validationRules.alphaOnly],
    state: [validationRules.required],
    zip: [validationRules.required, validationRules.zipCode]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply formatters
    if (name === 'phone' || name === 'alternatePhone') {
      formattedValue = formatters.phone(value);
    } else if (name === 'zip') {
      formattedValue = formatters.zipCode(value);
    } else if (name === 'firstName' || name === 'lastName' || name === 'city') {
      formattedValue = formatters.capitalize(value);
    }

    setClientData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      validateField(name, formattedValue);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, clientData[name]);
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

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldErrors.length > 0 ? fieldErrors[0] : null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(fieldRules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const { isValid, errors: validationErrors } = validateForm(clientData, fieldRules);
    setErrors(validationErrors);

    if (isValid && onSubmit) {
      onSubmit({
        ...clientData,
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString()
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

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', textAlign: 'left' }}>
      <h3 style={{ marginBottom: '1rem' }}>Client Information</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="firstName">{requiredLabel('First Name')}:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={clientData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid="client-first-name-input"
            aria-label="Client first name"
            aria-required="true"
            aria-invalid={!!errors.firstName}
            style={{
              ...inputStyle,
              borderColor: errors.firstName ? '#c00' : '#000'
            }}
          />
          {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
        </div>

        <div>
          <label htmlFor="lastName">{requiredLabel('Last Name')}:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={clientData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid="client-last-name-input"
            aria-label="Client last name"
            aria-required="true"
            aria-invalid={!!errors.lastName}
            style={{
              ...inputStyle,
              borderColor: errors.lastName ? '#c00' : '#000'
            }}
          />
          {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="email">{requiredLabel('Email')}:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={clientData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="client-email-input"
          aria-label="Client email address"
          aria-required="true"
          aria-invalid={!!errors.email}
          style={{
            ...inputStyle,
            borderColor: errors.email ? '#c00' : '#000'
          }}
        />
        {errors.email && <div style={errorStyle}>{errors.email}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label htmlFor="phone">{requiredLabel('Primary Phone')}:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={clientData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(555) 123-4567"
            data-testid="client-phone-input"
            aria-label="Client primary phone number"
            aria-required="true"
            aria-invalid={!!errors.phone}
            style={{
              ...inputStyle,
              borderColor: errors.phone ? '#c00' : '#000'
            }}
          />
          {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
        </div>

        <div>
          <label htmlFor="alternatePhone">Alternate Phone:</label>
          <input
            type="tel"
            id="alternatePhone"
            name="alternatePhone"
            value={clientData.alternatePhone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(555) 123-4567"
            data-testid="client-alternate-phone-input"
            aria-label="Client alternate phone number"
            aria-invalid={!!errors.alternatePhone}
            style={{
              ...inputStyle,
              borderColor: errors.alternatePhone ? '#c00' : '#000'
            }}
          />
          {errors.alternatePhone && <div style={errorStyle}>{errors.alternatePhone}</div>}
        </div>
      </div>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Address</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="street">{requiredLabel('Street Address')}:</label>
        <input
          type="text"
          id="street"
          name="street"
          value={clientData.street}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="client-street-input"
          aria-label="Client street address"
          aria-required="true"
          aria-invalid={!!errors.street}
          style={{
            ...inputStyle,
            borderColor: errors.street ? '#c00' : '#000'
          }}
        />
        {errors.street && <div style={errorStyle}>{errors.street}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="city">{requiredLabel('City')}:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={clientData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid="client-city-input"
            aria-label="Client city"
            aria-required="true"
            aria-invalid={!!errors.city}
            style={{
              ...inputStyle,
              borderColor: errors.city ? '#c00' : '#000'
            }}
          />
          {errors.city && <div style={errorStyle}>{errors.city}</div>}
        </div>

        <div>
          <label htmlFor="state">{requiredLabel('State')}:</label>
          <select
            id="state"
            name="state"
            value={clientData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid="client-state-select"
            aria-label="Client state"
            aria-required="true"
            aria-invalid={!!errors.state}
            style={{
              ...inputStyle,
              borderColor: errors.state ? '#c00' : '#000'
            }}
          >
            <option value="">Select...</option>
            {US_STATES.map(state => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <div style={errorStyle}>{errors.state}</div>}
        </div>

        <div>
          <label htmlFor="zip">{requiredLabel('ZIP Code')}:</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={clientData.zip}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="12345"
            data-testid="client-zip-input"
            aria-label="Client ZIP code"
            aria-required="true"
            aria-invalid={!!errors.zip}
            style={{
              ...inputStyle,
              borderColor: errors.zip ? '#c00' : '#000'
            }}
          />
          {errors.zip && <div style={errorStyle}>{errors.zip}</div>}
        </div>
      </div>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Preferences</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="preferredContact">Preferred Contact Method:</label>
        <select
          id="preferredContact"
          name="preferredContact"
          value={clientData.preferredContact}
          onChange={handleChange}
          data-testid="client-preferred-contact-select"
          aria-label="Client preferred contact method"
          style={inputStyle}
        >
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="text">Text Message</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="notes">Additional Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={clientData.notes}
          onChange={handleChange}
          rows="3"
          data-testid="client-notes-textarea"
          aria-label="Additional client notes"
          style={{
            ...inputStyle,
            resize: 'vertical'
          }}
          placeholder="Any special instructions or preferences..."
        />
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
        <span style={{ color: '#c00' }}>*</span> Required fields
      </div>

      <button 
        type="submit" 
        id="create-client-button"
        data-testid="client-submit-button"
        aria-label="Create new client"
        style={{ 
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#000080',
          color: '#fff',
          border: '2px solid #000',
          cursor: 'pointer'
        }}
      >
        Create Client
      </button>
    </form>
  );
}

export default NewClientForm;