import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const register = useCallback(
    async (name, email, password, passwordConfirm) => {
      setError(null);
      try {
        const result = await authService.register(
          name,
          email,
          password,
          passwordConfirm
        );
        setUser(result.user);
        return result;
      } catch (err) {
        const message =
          err.response?.data?.message || 'Registration failed';
        setError(message);
        throw err;
      }
    },
    []
  );

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const changePassword = useCallback(
    async (currentPassword, newPassword, passwordConfirm) => {
      setError(null);
      try {
        const result = await authService.changePassword(
          currentPassword,
          newPassword,
          passwordConfirm
        );
        return result;
      } catch (err) {
        const message =
          err.response?.data?.message || 'Password change failed';
        setError(message);
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    changePassword,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
