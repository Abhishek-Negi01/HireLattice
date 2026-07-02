import React from 'react';
import styles from './style/Badge.module.scss';

export const Badge = ({
  children,
  variant = 'neutral', // success, error, warning, info, neutral
  className = '',
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
