import React from 'react';
import styles from '../styles/Modal.module.css';

export const Modal = ({ isOpen, title, message, confirmText, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
