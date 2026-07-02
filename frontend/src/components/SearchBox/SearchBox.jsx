import React from 'react';
import styles from './style/SearchBox.module.scss';
import { FiSearch, FiX } from 'react-icons/fi';

export const SearchBox = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search candidates, skills, location...',
  className = '',
}) => {
  return (
    <div className={`${styles.searchWrapper} ${className}`}>
      <FiSearch className={styles.searchIcon} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
      />
      {value && onClear && (
        <button type="button" onClick={onClear} className={styles.clearButton}>
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
