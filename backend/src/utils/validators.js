// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Name validation
const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

// Role validation
const isValidRole = (role) => {
  const validRoles = ['User', 'Manager', 'Admin'];
  return validRoles.includes(role);
};

// Status validation
const isValidStatus = (status) => {
  const validStatuses = ['active', 'inactive'];
  return validStatuses.includes(status);
};

// Sanitize user input to prevent injection
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidRole,
  isValidStatus,
  sanitizeInput,
};
