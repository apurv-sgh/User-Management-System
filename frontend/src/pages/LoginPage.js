import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components/UserForm';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <div className={styles.authHeader}>
          <h1>🔐 User Management System</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email?.value;
          const password = e.target.password?.value;
          handleSubmit({ email, password });
        }}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.authLink}>
          Don't have an account? <a href="/register">Sign up here</a>
        </p>

        <div className={styles.demoInfo}>
          <h4>Demo Credentials:</h4>
          <p><strong>Admin:</strong> admin@example.com / password123</p>
          <p><strong>Manager:</strong> manager@example.com / password123</p>
          <p><strong>User:</strong> user@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};
