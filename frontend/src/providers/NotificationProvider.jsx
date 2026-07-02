import { useState, useCallback } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import styles from './style/Notification.module.scss';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const showSuccess = useCallback((msg, dur) => addNotification(msg, 'success', dur), [addNotification]);
  const showError = useCallback((msg, dur) => addNotification(msg, 'error', dur), [addNotification]);
  const showWarning = useCallback((msg, dur) => addNotification(msg, 'warning', dur), [addNotification]);
  const showInfo = useCallback((msg, dur) => addNotification(msg, 'info', dur), [addNotification]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className={styles.icon} />;
      case 'error':
        return <FiAlertCircle className={styles.icon} />;
      case 'warning':
        return <FiAlertCircle className={styles.icon} />;
      default:
        return <FiInfo className={styles.icon} />;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <div className={styles.toastContainer}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`${styles.toast} ${styles[notif.type]}`}
          >
            {getIcon(notif.type)}
            <div className={styles.content}>{notif.message}</div>
            <button
              onClick={() => removeNotification(notif.id)}
              className={styles.closeButton}
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
