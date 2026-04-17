import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserForm } from '../components/UserForm';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordConfirm
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <div className={styles.authHeader}>
          <h1>🔐 User Management System</h1>
          <p>Create your account</p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        <UserForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitText="Register"
          isEditMode={false}
        />

        <p className={styles.authLink}>
          Already have an account? <a href="/login">Sign in here</a>
        </p>
      </div>
    </div>
  );
};
