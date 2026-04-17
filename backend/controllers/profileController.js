const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

async function getProfile(req, res) {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

async function updateProfile(req, res) {
  const { name, currentPassword, password } = req.body;
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const auditLogsCollection = db.collection('auditLogs');

    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updateDoc = { updatedAt: new Date() };

    if (name) {
      updateDoc.name = name;
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
      const newHash = await bcrypt.hash(password, 12);
      updateDoc.passwordHash = newHash;
    }

    if (Object.keys(updateDoc).length === 1) return res.status(400).json({ error: 'No changes provided' });

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
    const updated = result;

    await auditLogsCollection.insertOne({
      action: 'PROFILE_UPDATED',
      targetUserId: new ObjectId(req.user.id),
      targetUserName: updated.firstName,
      performedById: new ObjectId(req.user.id),
      performedByName: updated.name,
      details: null,
      createdAt: new Date(),
    });

    res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

module.exports = { getProfile, updateProfile };
