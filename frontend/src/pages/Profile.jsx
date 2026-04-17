import React, { useState, useContext } from 'react';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { UserContext } from '../context/UserContext';
import { useAuth } from '../hooks/useAuth';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const { loading, error, updateProfile } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>View and manage your account information</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        <div className="profile-container">
          {/* Profile Card */}
          <div className="profile-card card">
            <div className="profile-avatar-large">{user?.firstName?.charAt(0)}</div>

            {!isEditing ? (
              <>
                <div className="profile-info">
                  <h2>{user?.fullName}</h2>
                  <p className="profile-email">{user?.email}</p>

                  <div className="profile-details">
                    <div className="profile-item">
                      <span className="item-label">First Name</span>
                      <span className="item-value">{user?.firstName}</span>
                    </div>
                    <div className="profile-item">
                      <span className="item-label">Last Name</span>
                      <span className="item-value">{user?.lastName}</span>
                    </div>
                    <div className="profile-item">
                      <span className="item-label">Email</span>
                      <span className="item-value">{user?.email}</span>
                    </div>
                    <div className="profile-item">
                      <span className="item-label">Role</span>
                      <span className="item-value badge badge-primary">
                        {user?.role}
                      </span>
                    </div>
                    <div className="profile-item">
                      <span className="item-label">Status</span>
                      <span className={`item-value badge ${user?.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                        {user?.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    className="edit-button"
                  >
                    Edit Profile
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="edit-form">
                <h3>Edit Profile</h3>

                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={user?.email}
                  disabled
                  readOnly
                />
                <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '-0.75rem' }}>
                  Email cannot be changed
                </p>

                <div className="form-actions">
                  <Button type="submit" variant="primary" loading={loading}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || ''
                      });
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Security Card */}
          <div className="security-card card">
            <h3>Security</h3>
            <div className="security-options">
              <div className="security-item">
                <div>
                  <h4>Change Password</h4>
                  <p>Update your password regularly to keep your account secure</p>
                </div>
                <Button variant="secondary">Change Password</Button>
              </div>

              <div className="security-item">
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <Button variant="secondary">Enable 2FA</Button>
              </div>

              <div className="security-item">
                <div>
                  <h4>Login History</h4>
                  <p>View your recent login activity</p>
                </div>
                <Button variant="secondary">View History</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
