import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { UserForm } from '../components/UserForm';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const EditUserPage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch (err) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    setError(null);

    try {
      // Managers cannot edit Admin users
      if (
        currentUser?.role === 'Manager' &&
        user?.role === 'Admin'
      ) {
        throw new Error('Managers cannot edit Admin users');
      }

      const updated = await userService.updateUser(userId, formData);
      setUser(updated);
      setSuccess('User updated successfully!');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading user...</div>
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

  // Check permissions
  const canEdit =
    currentUser?.role === 'Admin' ||
    (currentUser?.role === 'Manager' && user.role !== 'Admin') ||
    (currentUser?.role === 'User' && currentUser?._id === userId);

  if (!canEdit) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Access Denied</h1>
          <p>You do not have permission to edit this user.</p>
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>✏️ Edit User</h1>

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

        <div className={styles.formWrapper}>
          <UserForm
            onSubmit={handleSubmit}
            loading={submitLoading}
            submitText="Save Changes"
            defaultValues={user}
            isEditMode={true}
            isAdminCreating={
              currentUser?.role === 'Admin' ||
              currentUser?.role === 'Manager'
            }
            currentUserRole={currentUser?.role}
          />
        </div>

        <button
          className={styles.backBtn}
          onClick={() => navigate('/users')}
        >
          ← Back to Users
        </button>
      </div>
    </div>
  );
};
