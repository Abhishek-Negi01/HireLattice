import React from 'react';
import styles from './style/Chip.module.scss';
import { FiX } from 'react-icons/fi';

export const Chip = ({
  label,
  active = false,
  onClick,
  onDelete,
  className = '',
}) => {
  const isClickable = !!onClick;

  return (
    <span
      className={`
        ${styles.chip}
        ${active ? styles.active : ''}
        ${isClickable ? styles.clickable : ''}
        ${className}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      <span>{label}</span>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={styles.deleteButton}
        >
          <FiX />
        </button>
      )}
    </span>
  );
};

export default Chip;
