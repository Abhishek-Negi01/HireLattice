import React from 'react';
import styles from './style/Input.module.scss';

export const Input = React.forwardRef(({
  label,
  name,
  type = 'text',
  placeholder = '',
  error,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && <label htmlFor={name} className={styles.label}>{label}</label>}
      <input
        ref={ref}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.inputField} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
