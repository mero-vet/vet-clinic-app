import React from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  shadow = 'default',
  bordered = true,
  hoverable = false,
  clickable = false,
  fullHeight = false,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    'ds-card',
    `ds-card--${variant}`,
    `ds-card--padding-${padding}`,
    `ds-card--shadow-${shadow}`,
    bordered && 'ds-card--bordered',
    hoverable && 'ds-card--hoverable',
    clickable && 'ds-card--clickable',
    fullHeight && 'ds-card--full-height',
    className,
  ].filter(Boolean).join(' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      type={clickable ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`ds-card__header ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`ds-card__body ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`ds-card__footer ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
export default Card;