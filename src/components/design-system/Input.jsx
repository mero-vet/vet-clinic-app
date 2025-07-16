import React, { forwardRef, useState } from 'react';
import './Input.css';

const Input = forwardRef(({
  type = 'text',
  size = 'medium',
  variant = 'default',
  label,
  helperText,
  error,
  errorMessage,
  disabled = false,
  required = false,
  fullWidth = false,
  prefix,
  suffix,
  icon,
  className = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const inputClasses = [
    'ds-input__field',
    `ds-input__field--${size}`,
    `ds-input__field--${variant}`,
    error && 'ds-input__field--error',
    disabled && 'ds-input__field--disabled',
    (prefix || icon) && 'ds-input__field--with-prefix',
    suffix && 'ds-input__field--with-suffix',
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    'ds-input',
    fullWidth && 'ds-input--full-width',
    focused && 'ds-input--focused',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="ds-input__label">
          {label}
          {required && <span className="ds-input__required">*</span>}
        </label>
      )}
      
      <div className="ds-input__wrapper">
        {(prefix || icon) && (
          <div className="ds-input__prefix">
            {icon || prefix}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            errorMessage ? 'input-error' : helperText ? 'input-helper' : undefined
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {suffix && (
          <div className="ds-input__suffix">
            {suffix}
          </div>
        )}
      </div>
      
      {(errorMessage || helperText) && (
        <div
          id={errorMessage ? 'input-error' : 'input-helper'}
          className={`ds-input__helper ${error ? 'ds-input__helper--error' : ''}`}
        >
          {errorMessage || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;