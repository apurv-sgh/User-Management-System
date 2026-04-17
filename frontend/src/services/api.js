import React, { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/register'
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-tokens`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  async register(name, email, password, passwordConfirm) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      passwordConfirm,
    });
    return response.data.data;
  }

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, tokens } = response.data.data;

    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, tokens };
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.data;
  }

  async changePassword(currentPassword, newPassword, passwordConfirm) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
      passwordConfirm,
    });
    return response.data;
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }
}

class UserService {
  async getAllUsers(filters = {}, page = 1, limit = 10) {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    params.append('page', page);
    params.append('limit', limit);

    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  }

  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  }

  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data.data;
  }

  async updateUser(userId, updates) {
    const response = await api.put(`/users/${userId}`, updates);
    return response.data.data;
  }

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  }

  async updateProfile(updates) {
    const response = await api.put('/users/profile/update', updates);
    return response.data.data;
  }

  async getUserStats() {
    const response = await api.get('/users/stats');
    return response.data.data;
  }
}

export const authService = new AuthService();
export const userService = new UserService();
export default api;
