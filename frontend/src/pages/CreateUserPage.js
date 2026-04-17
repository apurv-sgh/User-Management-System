import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { UserForm } from '../components/UserForm';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const CreateUserPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await userService.createUser(formData);
      setSuccess('User created successfully!');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Access Denied</h1>
          <p>Only admins can create new users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>➕ Create New User</h1>

        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        {success && (
          <Alert
            message={success}
            type="success"
            onClose={() => setSuccess(null)}
          />
        )}

        <div className={styles.formWrapper}>
          <UserForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Create User"
            isAdminCreating={true}
          />
        </div>

        <button
          className={styles.backBtn}
          onClick={() => navigate('/users')}
        >
          ← Back to Users
        </button>
      </div>
    </div>
  );
};
