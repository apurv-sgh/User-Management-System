/**
 * Check if user has a specific role
 */
export const hasRole = (user, role) => {
  return user?.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user, roles) => {
  return roles.includes(user?.role);
};

/**
 * Check if user can access a route based on role
 */
export const canAccessRoute = (user, allowedRoles) => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    admin: 'Administrator',
    manager: 'Manager',
    user: 'User'
  };
  return roleNames[role] || role;
};

/**
 * Get role color for UI
 */
export const getRoleColor = (role) => {
  const colors = {
    admin: '#dc2626',
    manager: '#f59e0b',
    user: '#3b82f6'
  };
  return colors[role] || '#6b7280';
};

/**
 * Get status display name and color
 */
export const getStatusInfo = (status) => {
  const statusInfo = {
    active: { name: 'Active', color: '#10b981' },
    inactive: { name: 'Inactive', color: '#6b7280' }
  };
  return statusInfo[status] || { name: status, color: '#6b7280' };
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
