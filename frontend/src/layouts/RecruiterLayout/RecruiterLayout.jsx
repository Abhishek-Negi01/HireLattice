import React, { useContext, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import styles from './style/RecruiterLayout.module.scss';
import {
  FiHexagon, FiGrid, FiBriefcase, FiPlusSquare, FiUploadCloud,
  FiSearch, FiTrendingUp, FiUser, FiSettings, FiMenu, FiX, FiSun, FiMoon
} from 'react-icons/fi';
import { ThemeContext } from '../../contexts/ThemeContext';
import { UserButton } from '@clerk/clerk-react';

export const RecruiterLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/recruiter', icon: FiGrid, end: true },
    { name: 'Create Job', to: '/recruiter/jobs/create', icon: FiPlusSquare },
    { name: 'Manage Jobs', to: '/recruiter/jobs', icon: FiBriefcase },
    { name: 'Upload Resumes', to: '/recruiter/resumes/upload', icon: FiUploadCloud },
    { name: 'Candidate Search', to: '/recruiter/search', icon: FiSearch },
    { name: 'Candidate Ranking', to: '/recruiter/ranking', icon: FiTrendingUp },
    { name: 'Profile', to: '/recruiter/profile', icon: FiUser },
    { name: 'Settings', to: '/recruiter/settings', icon: FiSettings },
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
            <h2 className="text-lg font-semibold text-text" style={{ color: 'var(--text)' }}>Recruiter Hub</h2>
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
          &copy; 2026 HireLattice. All rights reserved. Recruiter Portal.
        </footer>
      </div>
    </div>
  );
};

export default RecruiterLayout;
