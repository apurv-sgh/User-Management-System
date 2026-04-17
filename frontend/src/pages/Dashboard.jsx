import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';
import { getRoleDisplayName, getRoleColor } from '../utils/roleUtils';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: '📊', label: 'Total Users', value: '1,234', color: '#3b82f6' },
    { icon: '✅', label: 'Active Users', value: '987', color: '#10b981' },
    { icon: '⏸️', label: 'Inactive Users', value: '247', color: '#f59e0b' },
    { icon: '👤', label: 'Your Role', value: getRoleDisplayName(user?.role), color: '#8b5cf6' }
  ];

  return (
    <Layout>
      <div className="dashboard">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {user?.firstName}! 👋</h1>
            <p>Here's what's happening with your user management system today.</p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/users" className="btn btn-primary">
              Manage Users
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h3>View Profile</h3>
              <p>View and edit your profile information</p>
            </Link>

            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/users" className="action-card">
                <div className="action-icon">👥</div>
                <h3>Manage Users</h3>
                <p>View, create, and manage user accounts</p>
              </Link>
            )}

            <Link to="/" className="action-card">
              <div className="action-icon">📚</div>
              <h3>Documentation</h3>
              <p>Learn about the system features</p>
            </Link>

            <Link to="/" className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Configure your preferences</p>
            </Link>
          </div>
        </div>

        {/* Role Info Card */}
        <div className="role-info-card">
          <h3>Your Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{user?.fullName}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p>
                <span className="badge badge-primary">
                  {getRoleDisplayName(user?.role)}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p>
                <span className="badge badge-success">
                  {user?.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Features based on role */}
        <div className="features-section">
          <h2>Your Permissions</h2>
          <div className="permissions-list">
            {user?.role === 'admin' && (
              <div className="permission-group">
                <h4>Administrator Permissions</h4>
                <ul>
                  <li>✓ Create new users</li>
                  <li>✓ Update any user information</li>
                  <li>✓ Delete user accounts</li>
                  <li>✓ Assign roles to users</li>
                  <li>✓ View system audit logs</li>
                  <li>✓ Access all features</li>
                </ul>
              </div>
            )}

            {user?.role === 'manager' && (
              <div className="permission-group">
                <h4>Manager Permissions</h4>
                <ul>
                  <li>✓ View all users</li>
                  <li>✓ Update non-admin users</li>
                  <li>✗ Cannot delete users</li>
                  <li>✗ Cannot modify administrators</li>
                  <li>✓ View audit information</li>
                </ul>
              </div>
            )}

            {user?.role === 'user' && (
              <div className="permission-group">
                <h4>User Permissions</h4>
                <ul>
                  <li>✓ View own profile</li>
                  <li>✓ Update own profile</li>
                  <li>✓ Change own password</li>
                  <li>✗ Cannot view other users</li>
                  <li>✗ Cannot manage users</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
