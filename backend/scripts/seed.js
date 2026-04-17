/**
 * Database Seed Script
 * Run with: node backend/scripts/seed.js
 * This creates initial demo users
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin',
        status: 'active',
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'Manager',
        status: 'active',
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'User',
        status: 'active',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'User',
        status: 'active',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'Manager',
        status: 'active',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'User',
        status: 'inactive',
      },
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log(`${createdUsers.length} demo users created successfully`);

    // Update relationships (set createdBy to first admin)
    const adminUser = await User.findOne({ role: 'Admin' });
    if (adminUser) {
      await User.updateMany(
        { _id: { $ne: adminUser._id } },
        { $set: { createdBy: adminUser._id } }
      );
      console.log('Updated createdBy references');
    }

    console.log('\n=== Demo Users Created ===');
    console.log('Admin: admin@example.com / password123');
    console.log('Manager: manager@example.com / password123');
    console.log('User: user@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
