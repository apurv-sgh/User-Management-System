import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/UserTable.module.css';

export const UserTable = ({ users, onEdit, onDelete, onView, loading = false }) => {
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!users || users.length === 0) {
    return <div className={styles.empty}>No users found</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role) => {
    const colors = {
      Admin: '#dc3545',
      Manager: '#fd7e14',
      User: '#28a745',
    };
    return { color: colors[role] || '#6c757d' };
  };

  const getStatusBadge = (status) => {
    return {
      backgroundColor: status === 'active' ? '#d4edda' : '#f8d7da',
      color: status === 'active' ? '#155724' : '#721c24',
    };
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span
                  className={styles.badge}
                  style={getRoleBadge(user.role)}
                >
                  {user.role}
                </span>
              </td>
              <td>
                <span
                  className={styles.statusBadge}
                  style={getStatusBadge(user.status)}
                >
                  {user.status}
                </span>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td className={styles.actions}>
                <button
                  className={styles.btnView}
                  onClick={() => onView(user._id)}
                  title="View details"
                >
                  👁️ View
                </button>
                <button
                  className={styles.btnEdit}
                  onClick={() => onEdit(user._id)}
                  title="Edit user"
                >
                  ✏️ Edit
                </button>
                <button
                  className={styles.btnDelete}
                  onClick={() => onDelete(user._id)}
                  title="Delete user"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
