const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtUtils');
const { ObjectId } = require('mongodb');

async function register(req, res) {
  const { name, email, password, role = 'user' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const auditLogsCollection = db.collection('auditLogs');

    const existing = await usersCollection.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await usersCollection.insertOne({
      name,
      email,
      passwordHash,
      role,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
    });
    const user = await usersCollection.findOne({ _id: result.insertedId });
    await auditLogsCollection.insertOne({
      action: 'USER_REGISTERED',
      targetUserId: result.insertedId,
      targetUserName: user.name,
      performedById: result.insertedId,
      performedByName: user.name,
      details: null,
      createdAt: new Date(),
    });
    const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.collection('refreshTokens').insertOne({
      userId: result.insertedId,
      token: refreshToken,
      expiresAt,
      createdAt: new Date(),
    });
    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const auditLogsCollection = db.collection('auditLogs');
    const refreshTokensCollection = db.collection('refreshTokens');

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'inactive') return res.status(403).json({ error: 'Account is inactive' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    await auditLogsCollection.insertOne({
      action: 'USER_LOGIN',
      targetUserId: user._id,
      targetUserName: user.name,
      performedById: user._id,
      performedByName: user.name,
      details: null,
      createdAt: new Date(),
    });
    const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshTokensCollection.insertOne({
      userId: user._id,
      token: refreshToken,
      expiresAt,
      createdAt: new Date(),
    });
    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const db = await getDb();
    const refreshTokensCollection = db.collection('refreshTokens');
    const usersCollection = db.collection('users');

    const tokenDoc = await refreshTokensCollection.findOne({
      token: refreshToken,
      expiresAt: { $gt: new Date() },
    });
    if (!tokenDoc) return res.status(401).json({ error: 'Invalid or expired refresh token' });
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
    if (!user || user.status === 'inactive') return res.status(401).json({ error: 'User not found or inactive' });
    const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshTokensCollection.deleteOne({ token: refreshToken });
    await refreshTokensCollection.insertOne({
      userId: user._id,
      token: newRefreshToken,
      expiresAt,
      createdAt: new Date(),
    });
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

async function logout(req, res) {
  const { refreshToken } = req.body;
  try {
    const db = await getDb();
    const refreshTokensCollection = db.collection('refreshTokens');
    const auditLogsCollection = db.collection('auditLogs');

    if (refreshToken) {
      await refreshTokensCollection.deleteOne({ token: refreshToken });
    }
    if (req.user) {
      await auditLogsCollection.insertOne({
        action: 'USER_LOGOUT',
        targetUserId: new ObjectId(req.user.id),
        targetUserName: req.user.name,
        performedById: new ObjectId(req.user.id),
        performedByName: req.user.name,
        details: null,
        createdAt: new Date(),
      });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
}

module.exports = { register, login, refreshToken, logout };
