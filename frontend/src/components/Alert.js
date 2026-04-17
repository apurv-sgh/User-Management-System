import React from 'react';
import styles from '../styles/Alert.module.css';

export const Alert = ({ message, type = 'info', onClose }) => {
  React.useEffect(() => {
    if (type !== 'error') {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const typeStyles = {
    success: styles.success,
    error: styles.error,
    warning: styles.warning,
    info: styles.info,
  };

  return (
    <div className={`${styles.alert} ${typeStyles[type]}`}>
      <span>{message}</span>
      <button className={styles.closeBtn} onClick={onClose}>
        ✕
      </button>
    </div>
  );
};
