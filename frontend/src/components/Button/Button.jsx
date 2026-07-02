import React from 'react';
import styles from './style/Button.module.scss';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, outline
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
      ) : Icon ? (
        <Icon className="mr-2 inline-block text-lg" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
