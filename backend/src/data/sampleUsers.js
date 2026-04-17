// Sample data for initial setup
// Run this to seed your database with demo users

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "password123", // Will be hashed
    role: "admin",
    status: "active"
  },
  {
    firstName: "Manager",
    lastName: "User",
    email: "manager@example.com",
    password: "password123",
    role: "manager",
    status: "active"
  },
  {
    firstName: "Regular",
    lastName: "User",
    email: "user@example.com",
    password: "password123",
    role: "user",
    status: "active"
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    status: "active"
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password123",
    role: "manager",
    status: "active"
  },
  {
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@example.com",
    password: "password123",
    role: "user",
    status: "inactive"
  },
  {
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah@example.com",
    password: "password123",
    role: "user",
    status: "active"
  },
  {
    firstName: "Tom",
    lastName: "Brown",
    email: "tom@example.com",
    password: "password123",
    role: "manager",
    status: "active"
  }
];

module.exports = users;
