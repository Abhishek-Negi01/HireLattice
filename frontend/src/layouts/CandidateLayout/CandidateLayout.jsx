import React, { useContext, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import styles from './style/CandidateLayout.module.scss';
import {
  FiHexagon, FiGrid, FiUser, FiUploadCloud, FiClock, FiSettings, FiMenu, FiX, FiSun, FiMoon
} from 'react-icons/fi';
import { ThemeContext } from '../../contexts/ThemeContext';
import { UserButton } from '@clerk/clerk-react';

export const CandidateLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Overview', to: '/candidate', icon: FiGrid, end: true },
    { name: 'Profile Details', to: '/candidate/profile', icon: FiUser },
    { name: 'Upload Resume', to: '/candidate/resume', icon: FiUploadCloud },
    { name: 'Resume History', to: '/candidate/history', icon: FiClock },
    { name: 'Settings', to: '/candidate/settings', icon: FiSettings },
  ];

  return (
    <div className={styles.layout}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            <FiHexagon />
            <span>HireLattice</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-muted hover:text-text"
            style={{ color: 'var(--text-muted)' }}
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="text-lg" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        <header className={styles.navbar}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={styles.menuButton}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>
          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg font-semibold text-text" style={{ color: 'var(--text)' }}>Candidate Hub</h2>
          </div>
          <div className={styles.navRight}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          &copy; 2026 HireLattice. All rights reserved. Candidate Portal.
        </footer>
      </div>
    </div>
  );
};

export default CandidateLayout;
