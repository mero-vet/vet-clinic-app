import React from 'react';
import ErrorState from './ErrorState';

/**
 * FormField component for consistent form field rendering across the app
 * Provides standardized IDs, labels, ARIA attributes, and error handling
 */
export const FormField = ({ 
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  testId,
  helpText,
  placeholder,
  options = [], // For select fields
  min,
  max,
  step,
  disabled = false,
  autoComplete,
  className = '',
  style = {}
}) => {
  // Generate consistent field ID
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const dataTestId = testId || fieldId;
  
  const baseInputStyles = {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: disabled ? '#f5f5f5' : 'white',
    cursor: disabled ? 'not-allowed' : 'text',
    borderColor: error ? '#DC3545' : '#ccc',
    ...style
  };

  const renderInput = () => {
    const commonProps = {
      id: fieldId,
      name: fieldId,
      value: value || '',
      onChange,
      required,
      disabled,
      placeholder,
      autoComplete,
      'data-testid': dataTestId,
      'aria-required': required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${fieldId}-error-message` : helpText ? `${fieldId}-help` : undefined,
      className: `form-input ${error ? 'error' : ''} ${className}`,
      style: baseInputStyles
    };

    switch (type) {
      case 'select':
        return (
          <select
            {...commonProps}
            aria-label={label}
          >
            <option value="">--Select--</option>
            {options.map(option => (
              <option 
                key={option.value || option} 
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            aria-label={label}
            rows={3}
            style={{ ...baseInputStyles, resize: 'vertical' }}
          />
        );

      case 'checkbox':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              {...commonProps}
              type="checkbox"
              checked={value || false}
              aria-label={label}
              style={{ width: 'auto', margin: 0 }}
            />
            <label htmlFor={fieldId} style={{ margin: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}>
              {label}
              {required && (
                <span className="required-indicator" aria-label="required" style={{ color: '#DC3545', marginLeft: '4px' }}>
                  *
                </span>
              )}
            </label>
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            min={min}
            max={max}
            step={step}
            aria-label={label}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="form-field" data-field={fieldId} style={{ marginBottom: '16px' }}>
        {renderInput()}
        {helpText && (
          <span id={`${fieldId}-help`} className="help-text" style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '4px',
            display: 'block',
            marginLeft: '24px'
          }}>
            {helpText}
          </span>
        )}
        <ErrorState error={error} fieldId={fieldId} />
      </div>
    );
  }

  return (
    <div className="form-field" data-field={fieldId} style={{ marginBottom: '16px' }}>
      <label 
        htmlFor={fieldId} 
        className="form-label"
        style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}
      >
        {label}
        {required && (
          <span className="required-indicator" aria-label="required" style={{ color: '#DC3545', marginLeft: '4px' }}>
            *
          </span>
        )}
      </label>
      
      {renderInput()}
      
      {helpText && (
        <span id={`${fieldId}-help`} className="help-text" style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '4px',
          display: 'block'
        }}>
          {helpText}
        </span>
      )}
      
      <ErrorState error={error} fieldId={fieldId} />
    </div>
  );
};

export default FormField;