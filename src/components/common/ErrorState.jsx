import React from 'react';

/**
 * ErrorState component for consistent error display across the app
 * Provides accessible error messages that computer use agents can detect
 */
export const ErrorState = ({ error, fieldId, testId, severity = 'error' }) => {
  if (!error) return null;
  
  const getSeverityStyles = () => {
    switch (severity) {
      case 'warning':
        return {
          backgroundColor: '#FFF3CD',
          borderColor: '#FFC107',
          color: '#856404',
          iconColor: '#FFC107'
        };
      case 'info':
        return {
          backgroundColor: '#D1ECF1',
          borderColor: '#17A2B8',
          color: '#0C5460',
          iconColor: '#17A2B8'
        };
      default: // error
        return {
          backgroundColor: '#F8D7DA',
          borderColor: '#DC3545',
          color: '#721C24',
          iconColor: '#DC3545'
        };
    }
  };

  const styles = getSeverityStyles();
  const errorId = fieldId ? `${fieldId}-error-message` : undefined;
  const dataTestId = testId || (fieldId ? `${fieldId}-error` : 'error-state');
  
  return (
    <div 
      className="error-state"
      data-error="true"
      data-severity={severity}
      data-testid={dataTestId}
      role="alert"
      aria-live={severity === 'error' ? 'assertive' : 'polite'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        marginTop: '8px',
        backgroundColor: styles.backgroundColor,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: '4px',
        fontSize: '14px',
        color: styles.color
      }}
    >
      <span 
        className="error-icon" 
        aria-hidden="true"
        style={{
          fontSize: '16px',
          color: styles.iconColor,
          fontWeight: 'bold'
        }}
      >
        {severity === 'warning' ? '⚠' : severity === 'info' ? 'ℹ' : '⚠'}
      </span>
      <span id={errorId}>{error}</span>
    </div>
  );
};

export default ErrorState;