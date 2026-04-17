import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>User Not Found</h1>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/users')}
          >
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      Admin: '#dc3545',
      Manager: '#fd7e14',
      User: '#28a745',
    };
    return colors[role] || '#6c757d';
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>👤 User Details</h1>

        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        <div className={styles.detailContainer}>
          <div className={styles.detailField}>
            <label>Name</label>
            <p>{user.name}</p>
          </div>

          <div className={styles.detailField}>
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className={styles.detailField}>
            <label>Role</label>
            <p>
              <span
                className={styles.badge}
                style={{ backgroundColor: getRoleBadgeColor(user.role) }}
              >
                {user.role}
              </span>
            </p>
          </div>

          <div className={styles.detailField}>
            <label>Status</label>
            <p>
              <span
                className={styles.statusBadge}
                style={{
                  backgroundColor:
                    user.status === 'active' ? '#d4edda' : '#f8d7da',
                  color: user.status === 'active' ? '#155724' : '#721c24',
                }}
              >
                {user.status}
              </span>
            </p>
          </div>

          <div className={styles.detailField}>
            <label>Created At</label>
            <p>
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {user.createdBy && (
            <div className={styles.detailField}>
              <label>Created By</label>
              <p>
                {user.createdBy.name} ({user.createdBy.email})
              </p>
            </div>
          )}

          <div className={styles.detailField}>
            <label>Last Updated At</label>
            <p>
              {new Date(user.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {user.updatedBy && (
            <div className={styles.detailField}>
              <label>Last Updated By</label>
              <p>
                {user.updatedBy.name} ({user.updatedBy.email})
              </p>
            </div>
          )}
        </div>

        <div className={styles.actionButtons}>
          <button
            className={styles.editBtn}
            onClick={() => navigate(`/users/${user._id}/edit`)}
          >
            ✏️ Edit User
          </button>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/users')}
          >
            ← Back to Users
          </button>
        </div>
      </div>
    </div>
  );
};
