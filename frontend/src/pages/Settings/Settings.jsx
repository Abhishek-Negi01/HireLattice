import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { FiSun, FiMoon } from 'react-icons/fi';

export const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Application Settings</h3>
      <Card title="Interface Preferences">
        <p className="text-sm text-text-muted mb-4" style={{ color: 'var(--text-muted)' }}>
          Customize color themes and settings for the application interface.
        </p>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Theme Preference</div>
            <div className="text-xs text-text-muted" style={{ color: 'var(--text-muted)' }}>
              Toggle between light and dark display modes.
            </div>
          </div>
          <Button
            variant="outline"
            icon={theme === 'light' ? FiMoon : FiSun}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
