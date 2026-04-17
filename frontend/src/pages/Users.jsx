import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { UserContext } from '../context/UserContext';
import { getRoleDisplayName, getStatusInfo, formatDate } from '../utils/roleUtils';
import './Users.css';

export default function Users() {
  const { users, loading, error, pagination, fetchUsers, deleteUser } = useContext(UserContext);
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [page, setPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsers(filters, page, 10);
  }, [filters, page]);

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  const handleRoleFilter = (e) => {
    setFilters(prev => ({ ...prev, role: e.target.value }));
    setPage(1);
  };

  const handleStatusFilter = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
    setPage(1);
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setDeleteLoading(true);
      try {
        await deleteUser(userId);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return <Loader message="Loading users..." />;
  }

  return (
    <Layout>
      <div className="users-page">
        {/* Header */}
        <div className="page-header">
          <h1>User Management</h1>
          <Link to="/users/new" className="btn btn-primary">
            ➕ Add New User
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section card">
          <div className="filters-grid">
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={handleSearch}
            />
            <select
              className="form-control"
              value={filters.role}
              onChange={handleRoleFilter}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <select
              className="form-control"
              value={filters.status}
              onChange={handleStatusFilter}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-section card">
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{user.firstName?.charAt(0)}</div>
                          <span>{user.fullName}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge badge-primary">
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-secondary'}`}
                        >
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/users/${user._id}`}
                            className="btn btn-secondary btn-small"
                          >
                            View
                          </Link>
                          {user.role !== 'admin' && (
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDelete(user._id)}
                              loading={deleteLoading}
                              disabled={deleteLoading}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <p>
                  Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of{' '}
                  {pagination.total} users
                </p>
                <div className="pagination-buttons">
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                  >
                    ← Previous
                  </Button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p}
                      variant={p === page ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={page === pagination.pages}
                    onClick={() => setPage(prev => prev + 1)}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
