import React from 'react';
import styles from './style/Card.module.scss';

export const Card = ({
  title,
  subtitle,
  children,
  hoverable = false,
  variant = 'default', // default, primary, success, warning, error
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${styles.card}
        ${hoverable ? styles.hoverable : ''}
        ${variant !== 'default' ? styles[variant] : ''}
        ${className}
      `}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;
