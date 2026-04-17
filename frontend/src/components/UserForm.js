import React from 'react';
import styles from '../styles/UserForm.module.css';

export const UserForm = ({
  onSubmit,
  loading = false,
  error = null,
  submitText = 'Submit',
  defaultValues = {},
  isEditMode = false,
  isAdminCreating = false,
  currentUserRole = 'User',
}) => {
  const [formData, setFormData] = React.useState({
    name: defaultValues.name || '',
    email: defaultValues.email || '',
    password: '',
    passwordConfirm: '',
    role: defaultValues.role || 'User',
    status: defaultValues.status || 'active',
  });

  const [formErrors, setFormErrors] = React.useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!isEditMode || formData.password) {
      if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = { ...formData };

    // Only include password if it's set
    if (!submitData.password) {
      delete submitData.password;
      delete submitData.passwordConfirm;
    }

    // Regular users can't change their role
    if (currentUserRole === 'User') {
      delete submitData.role;
      delete submitData.status;
    }

    onSubmit(submitData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your name"
        />
        {formErrors.name && (
          <span className={styles.fieldError}>{formErrors.name}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your email"
          disabled={isEditMode && !isAdminCreating}
        />
        {formErrors.email && (
          <span className={styles.fieldError}>{formErrors.email}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password {!isEditMode && '*'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          placeholder={
            isEditMode ? 'Leave blank to keep current password' : 'Enter password'
          }
        />
        {formErrors.password && (
          <span className={styles.fieldError}>{formErrors.password}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="passwordConfirm" className={styles.label}>
          Confirm Password {!isEditMode && '*'}
        </label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          className={styles.input}
          placeholder="Confirm password"
        />
        {formErrors.passwordConfirm && (
          <span className={styles.fieldError}>
            {formErrors.passwordConfirm}
          </span>
        )}
      </div>

      {isAdminCreating && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
      >
        {loading ? 'Loading...' : submitText}
      </button>
    </form>
  );
};
