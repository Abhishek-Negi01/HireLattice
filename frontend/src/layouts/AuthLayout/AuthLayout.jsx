import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './style/AuthLayout.module.scss';
import { FiHexagon } from 'react-icons/fi';

export const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>
          <FiHexagon />
          <span>HireLattice</span>
        </Link>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
