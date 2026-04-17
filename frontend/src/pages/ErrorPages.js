import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Pages.module.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/dashboard')}
        >
          ← Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/dashboard')}
        >
          ← Go to Dashboard
        </button>
      </div>
    </div>
  );
};
