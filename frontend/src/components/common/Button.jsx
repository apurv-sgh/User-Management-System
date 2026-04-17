import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const btnClass = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      className={btnClass}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <span className="loader"></span>}
      {children}
    </button>
  );
};
