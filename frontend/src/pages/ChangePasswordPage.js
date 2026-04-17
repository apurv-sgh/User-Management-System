import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components/UserForm';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const ChangePasswordPage = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.passwordConfirm
      );
      setSuccess('Password changed successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Change Password</h1>
        
        {success && (
          <Alert
            message={success}
            type="success"
            onClose={() => setSuccess(null)}
          />
        )}

        <div className={styles.formWrapper}>
          <form onSubmit={(e) => {
            e.preventDefault();
            const currentPassword = e.target.currentPassword?.value;
            const newPassword = e.target.newPassword?.value;
            const passwordConfirm = e.target.passwordConfirm?.value;
            handleSubmit({ currentPassword, newPassword, passwordConfirm });
          }}>
            {error && (
              <div className={styles.error}>{error}</div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                className={styles.input}
                placeholder="Enter current password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                className={styles.input}
                placeholder="Enter new password (minimum 6 characters)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="passwordConfirm" className={styles.label}>
                Confirm New Password *
              </label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                required
                className={styles.input}
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
