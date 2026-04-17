import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { UserContext } from '../context/UserContext';
import { getRoleDisplayName, formatDate } from '../utils/roleUtils';
import './UserDetail.css';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading, error, getUserById, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id && id !== 'new') {
      getUserById(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(currentUser._id, formData);
      setIsEditing(false);
    } catch (err) {
      // Error handled by context
    }
  };

  if (loading) {
    return <Loader message="Loading user..." />;
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="error-state">
          <p>User not found</p>
          <Button variant="primary" onClick={() => navigate('/users')}>
            Back to Users
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="user-detail-page">
        <Button variant="secondary" onClick={() => navigate('/users')} className="mb-3">
          ← Back to Users
        </Button>

        {error && (
          <div className="alert alert-danger mb-3">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="detail-container">
          {/* User Profile Card */}
          <div className="profile-card card">
            <div className="profile-header">
              <div className="profile-avatar">{currentUser.firstName?.charAt(0)}</div>
              <div className="profile-info">
                <h2>{currentUser.fullName}</h2>
                <p className="text-muted">{currentUser.email}</p>
                <div className="badges-container">
                  <span className="badge badge-primary">
                    {getRoleDisplayName(currentUser.role)}
                  </span>
                  <span className={`badge ${currentUser.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                    {currentUser.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">First Name:</span>
                    <span>{currentUser.firstName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Name:</span>
                    <span>{currentUser.lastName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Role:</span>
                    <span>{getRoleDisplayName(currentUser.role)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span>{currentUser.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Created:</span>
                    <span>{formatDate(currentUser.createdAt)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Updated:</span>
                    <span>{formatDate(currentUser.updatedAt)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Login:</span>
                    <span>{currentUser.lastLogin ? formatDate(currentUser.lastLogin) : 'Never'}</span>
                  </div>
                </div>

                <div className="profile-actions">
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit User
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="edit-form">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  error={errors.firstName}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  error={errors.lastName}
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  error={errors.email}
                />

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status || 'active'}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-actions">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Audit Info */}
          <div className="audit-card card">
            <h3>Audit Information</h3>
            <div className="audit-details">
              <div className="audit-row">
                <span className="audit-label">Created By:</span>
                <span>{currentUser.createdBy?.fullName || 'System'}</span>
              </div>
              <div className="audit-row">
                <span className="audit-label">Updated By:</span>
                <span>{currentUser.updatedBy?.fullName || 'Not updated'}</span>
              </div>
              <div className="audit-row">
                <span className="audit-label">Created At:</span>
                <span>{formatDate(currentUser.createdAt)}</span>
              </div>
              <div className="audit-row">
                <span className="audit-label">Updated At:</span>
                <span>{formatDate(currentUser.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
