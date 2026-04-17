// Define all roles and their permissions
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

const PERMISSIONS = {
  CREATE_USER: 'create:user',
  READ_USER: 'read:user',
  UPDATE_USER: 'update:user',
  DELETE_USER: 'delete:user',
  ASSIGN_ROLE: 'assign:role',
  VIEW_AUDIT: 'view:audit'
};

// Role-based permission mapping
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.ASSIGN_ROLE,
    PERMISSIONS.VIEW_AUDIT
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.VIEW_AUDIT
  ],
  [ROLES.USER]: [
    PERMISSIONS.READ_USER
  ]
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS
};
