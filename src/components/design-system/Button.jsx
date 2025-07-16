import React, { forwardRef } from 'react';
import './Button.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}, ref) => {
  const buttonClasses = [
    'ds-button',
    `ds-button--${variant}`,
    `ds-button--${size}`,
    fullWidth && 'ds-button--full-width',
    loading && 'ds-button--loading',
    disabled && 'ds-button--disabled',
    icon && 'ds-button--with-icon',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="ds-button__spinner" aria-label="Loading" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="ds-button__icon ds-button__icon--left">{icon}</span>
          )}
          <span className="ds-button__content">{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="ds-button__icon ds-button__icon--right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;