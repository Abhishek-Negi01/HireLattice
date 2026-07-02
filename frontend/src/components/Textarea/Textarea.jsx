import React from 'react';
import styles from './style/Textarea.module.scss';

export const Textarea = React.forwardRef(({
  label,
  name,
  placeholder = '',
  rows = 4,
  error,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && <label htmlFor={name} className={styles.label}>{label}</label>}
      <textarea
        ref={ref}
        name={name}
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.textareaField} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
