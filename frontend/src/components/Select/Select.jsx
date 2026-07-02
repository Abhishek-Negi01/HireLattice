import React from 'react';
import styles from './style/Select.module.scss';

export const Select = React.forwardRef(({
  label,
  name,
  options = [], // [{ value, label }]
  error,
  disabled = false,
  className = '',
  placeholder = 'Select an option',
  ...props
}, ref) => {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && <label htmlFor={name} className={styles.label}>{label}</label>}
      <select
        ref={ref}
        name={name}
        id={name}
        disabled={disabled}
        className={`${styles.selectField} ${error ? styles.error : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label || opt.value}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
