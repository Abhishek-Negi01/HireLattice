import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './style/PublicLayout.module.scss';
import { FiHexagon, FiSun, FiMoon } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../contexts/ThemeContext';
import { UserButton } from '@clerk/clerk-react';

export const PublicLayout = () => {
  const { isSignedIn, role } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <FiHexagon className="text-xl" />
          <span>HireLattice</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/about" className={styles.navLink}>About</Link>
          <button onClick={toggleTheme} className={styles.navLink} aria-label="Toggle theme" style={{ display: 'flex', alignItems: 'center' }}>
            {theme === 'light' ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
          </button>
          {isSignedIn ? (
            <>
              <Link
                to={role === 'recruiter' ? '/recruiter' : '/candidate'}
                className={styles.navLink}
                style={{ fontWeight: 600, color: 'var(--primary)' }}
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Sign In</Link>
              <Link
                to="/signup"
                className={styles.navLink}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                }}
              >
                Join Now
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2026 HireLattice. Semantic Intelligence Recruitment Platform.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
