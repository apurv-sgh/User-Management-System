import React from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components/UserForm';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [userDetails, setUserDetails] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await userService.getUserById(user?._id);
        setUserDetails(details);
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    if (user?._id) {
      fetchUserDetails();
    }
  }, [user?._id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await userService.updateProfile(formData);
      setUserDetails(updated);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!userDetails) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>👤 My Profile</h1>

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

        <div className={styles.profileContainer}>
          {!editMode ? (
            <div className={styles.profileView}>
              <div className={styles.profileField}>
                <label>Name</label>
                <p>{userDetails.name}</p>
              </div>

              <div className={styles.profileField}>
                <label>Email</label>
                <p>{userDetails.email}</p>
              </div>

              <div className={styles.profileField}>
                <label>Role</label>
                <p>
                  <span className={styles.badge}>{userDetails.role}</span>
                </p>
              </div>

              <div className={styles.profileField}>
                <label>Status</label>
                <p>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor:
                        userDetails.status === 'active' ? '#d4edda' : '#f8d7da',
                      color:
                        userDetails.status === 'active' ? '#155724' : '#721c24',
                    }}
                  >
                    {userDetails.status}
                  </span>
                </p>
              </div>

              {userDetails.createdAt && (
                <div className={styles.profileField}>
                  <label>Created</label>
                  <p>
                    {new Date(userDetails.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              )}

              {userDetails.updatedAt && (
                <div className={styles.profileField}>
                  <label>Last Updated</label>
                  <p>
                    {new Date(userDetails.updatedAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              )}

              <button
                className={styles.editBtn}
                onClick={() => setEditMode(true)}
              >
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <div className={styles.profileEdit}>
              <UserForm
                onSubmit={handleSubmit}
                loading={loading}
                submitText="Save Changes"
                defaultValues={userDetails}
                isEditMode={true}
                currentUserRole={user?.role}
              />
              <button
                className={styles.cancelBtn}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
