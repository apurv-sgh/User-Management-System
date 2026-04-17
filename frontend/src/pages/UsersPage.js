import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { UserTable } from '../components/UserTable';
import { Pagination } from '../components/Pagination';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import styles from '../styles/Pages.module.css';

export const UsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [filters, setFilters] = React.useState({
    role: '',
    status: '',
    search: '',
  });

  // Modal state
  const [deleteModal, setDeleteModal] = React.useState({
    isOpen: false,
    userId: null,
    userName: '',
  });

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(filters, page, 10);
      setUsers(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch users'
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  React.useEffect(() => {
    if (user?.role !== 'User') {
      fetchUsers();
    }
  }, [fetchUsers, user?.role]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setPage(1);
  };

  const handleView = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleEdit = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleDeleteClick = (userId, userName) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await userService.deleteUser(deleteModal.userId);
      setSuccess(`User "${deleteModal.userName}" has been deactivated`);
      setDeleteModal({ isOpen: false, userId: null, userName: '' });
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (user?.role === 'User') {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>👥 User Management</h1>

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

        <div className={styles.filterSection}>
          <h3>Filters</h3>
          <div className={styles.filterGrid}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) =>
                handleFilterChange('search', e.target.value)
              }
              className={styles.filterInput}
            />

            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className={styles.filterInput}
            >
              <option value="">All Roles</option>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={styles.filterInput}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              className={styles.resetBtn}
              onClick={() => {
                setFilters({ role: '', status: '', search: '' });
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        <UserTable
          users={users}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          loading={loading}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
        />

        <Modal
          isOpen={deleteModal.isOpen}
          title="Deactivate User"
          message={`Are you sure you want to deactivate "${deleteModal.userName}"? They will not be able to log in.`}
          confirmText="Deactivate"
          onConfirm={handleConfirmDelete}
          onCancel={() =>
            setDeleteModal({
              isOpen: false,
              userId: null,
              userName: '',
            })
          }
        />
      </div>
    </div>
  );
};
