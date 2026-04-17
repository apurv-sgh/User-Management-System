import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import './Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      setGeneralError(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">👥</div>
          <h1>UserHub</h1>
          <p>User Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {generalError && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              <span>{generalError}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            className="auth-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <a href="#" className="text-primary" onClick={(e) => {
              e.preventDefault();
              // Show register form (optional feature)
              alert('Registration form coming soon!');
            }}>
              Sign up
            </a>
          </p>
        </div>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <div className="demo-item">
            <strong>Admin:</strong>
            <p>admin@example.com / password123</p>
          </div>
          <div className="demo-item">
            <strong>Manager:</strong>
            <p>manager@example.com / password123</p>
          </div>
          <div className="demo-item">
            <strong>User:</strong>
            <p>user@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
