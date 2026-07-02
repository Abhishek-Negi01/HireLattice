import React from 'react';
import styles from './style/ProgressBar.module.scss';

export const ProgressBar = ({
  progress = 0, // 0 to 100
  variant = 'primary', // primary, success, error, warning
  className = '',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`${styles.track} ${className}`}>
      <div
        className={`${styles.bar} ${styles[variant]}`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
