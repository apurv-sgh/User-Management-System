import React, { createContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });

  const fetchUsers = useCallback(async (filters = {}, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      const response = await axiosInstance.get(`/users?${params}`);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch users';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setCurrentUser(response.data.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch user';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/users', userData);
      // Optionally refresh users list
      await fetchUsers();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create user';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      setCurrentUser(response.data.data);
      // Refresh users list
      await fetchUsers();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update user';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      // Refresh users list
      await fetchUsers();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put('/users/profile', userData);
      setCurrentUser(response.data.data);
      // Update localStorage user
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    users,
    currentUser,
    loading,
    error,
    pagination,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateProfile,
    clearError
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
