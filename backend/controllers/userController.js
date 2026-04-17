const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function mapUser(doc) {
  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdByName: doc.createdByName || null,
    updatedByName: doc.updatedByName || null,
  };
}

async function getUsers(req, res) {
  const { page = 1, limit = 10, search, role, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) {
    filter.role = role;
  }
  if (status) {
    filter.status = status;
  }

  try {
    const db = await getDb();
    const usersCollection = db.collection('users');

    const total = await usersCollection.countDocuments(filter);

    const users = await usersCollection
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdByUser',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'updatedBy',
            foreignField: '_id',
            as: 'updatedByUser',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            createdByName: { $arrayElemAt: ['$createdByUser.name', 0] },
            updatedByName: { $arrayElemAt: ['$updatedByUser.name', 0] },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ])
      .toArray();

    res.json({
      users: users.map(mapUser),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');

    const user = await usersCollection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdByUser',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'updatedBy',
            foreignField: '_id',
            as: 'updatedByUser',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            createdByName: { $arrayElemAt: ['$createdByUser.name', 0] },
            updatedByName: { $arrayElemAt: ['$updatedByUser.name', 0] },
          },
        },
      ])
      .toArray();

    if (user.length === 0) return res.status(404).json({ error: 'User not found' });

    const requester = req.user;
    const userData = mapUser(user[0]);
    if (requester.role === 'user' && requester.id !== userData.id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(userData);
  } catch (err) {
    console.error('Get user by id error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function createUser(req, res) {
  const { name, email, password, role = 'user', status = 'active' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const auditLogsCollection = db.collection('auditLogs');

    const existing = await usersCollection.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await usersCollection.insertOne({
      name,
      email,
      passwordHash,
      role,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: new ObjectId(req.user.id),
      updatedBy: new ObjectId(req.user.id),
    });
    const user = await usersCollection.findOne({ _id: result.insertedId });
    await auditLogsCollection.insertOne({
      action: 'USER_CREATED',
      targetUserId: result.insertedId,
      targetUserName: user.name,
      performedById: new ObjectId(req.user.id),
      performedByName: req.user.name,
      details: `Role: ${role}, Status: ${status}`,
      createdAt: new Date(),
    });
    res.status(201).json(mapUser(user));
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, role, status } = req.body;
  const requester = req.user;

  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const auditLogsCollection = db.collection('auditLogs');

    const existing = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ error: 'User not found' });
    const target = existing;

    if (requester.role === 'manager' && target.role === 'admin') {
      return res.status(403).json({ error: 'Managers cannot modify admin users' });
    }
    if (requester.role === 'user' && requester.id !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (requester.role !== 'admin' && role && role !== target.role) {
      return res.status(403).json({ error: 'Only admins can change roles' });
    }

    const updateDoc = { updatedAt: new Date(), updatedBy: new ObjectId(requester.id) };
    if (name) updateDoc.name = name;
    if (email) updateDoc.email = email;
    if (role) updateDoc.role = role;
    if (status) updateDoc.status = status;

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
    const updated = result;

    const changes = [];
    if (name && name !== target.name) changes.push(`name: ${name}`);
    if (email && email !== target.email) changes.push(`email: ${email}`);
    if (role && role !== target.role) changes.push(`role: ${role}`);
    if (status && status !== target.status) changes.push(`status: ${status}`);

    await auditLogsCollection.insertOne({
      action: 'USER_UPDATED',
      targetUserId: new ObjectId(id),
      targetUserName: updated.firstName,
      performedById: new ObjectId(requester.id),
      performedByName: requester.name,
      details: changes.length > 0 ? changes.join(', ') : 'No changes',
      createdAt: new Date(),
    });

    res.json(mapUser(updated));
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  const requester = req.user;

  if (requester.id === id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const refreshTokensCollection = db.collection('refreshTokens');
    const auditLogsCollection = db.collection('auditLogs');

    const existing = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ error: 'User not found' });
    const target = existing;

    if (requester.role === 'manager' && target.role === 'admin') {
      return res.status(403).json({ error: 'Managers cannot delete admin users' });
    }

    await auditLogsCollection.insertOne({
      action: 'USER_DEACTIVATED',
      targetUserId: new ObjectId(id),
      targetUserName: target.name,
      performedById: new ObjectId(requester.id),
      performedByName: requester.name,
      details: null,
      createdAt: new Date(),
    });

    await refreshTokensCollection.deleteMany({ userId: new ObjectId(id) });
    await usersCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
