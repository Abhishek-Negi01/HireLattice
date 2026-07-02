import React from 'react';
import styles from './style/Loader.module.scss';

export const Loader = ({
  text = 'Loading...',
  fullscreen = false,
  className = '',
}) => {
  return (
    <div className={`${styles.loaderContainer} ${fullscreen ? styles.fullscreen : ''} ${className}`}>
      <div className={styles.spinner} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default Loader;
