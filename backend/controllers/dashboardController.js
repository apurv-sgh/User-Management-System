const { getDb } = require('../config/db');

async function getStats(req, res) {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');

    const totalUsers = await usersCollection.countDocuments();
    const activeUsers = await usersCollection.countDocuments({ status: 'active' });
    const inactiveUsers = await usersCollection.countDocuments({ status: 'inactive' });
    const adminCount = await usersCollection.countDocuments({ role: 'admin' });

    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsersThisMonth = await usersCollection.countDocuments({ createdAt: { $gte: firstDayOfMonth } });

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminCount,
      newUsersThisMonth,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

async function getRoleDistribution(req, res) {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');

    const result = await usersCollection
      .aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }])
      .toArray();

    const dist = { admin: 0, manager: 0, user: 0 };
    result.forEach((row) => {
      dist[row._id] = row.count;
    });
    res.json(dist);
  } catch (err) {
    console.error('Role distribution error:', err);
    res.status(500).json({ error: 'Failed to fetch role distribution' });
  }
}

async function getRecentActivity(req, res) {
  const { limit = 10 } = req.query;
  try {
    const db = await getDb();
    const auditLogsCollection = db.collection('auditLogs');

    const result = await auditLogsCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json(
      result.map((row) => ({
        id: row._id,
        action: row.action,
        targetUser: row.targetUserName,
        performedBy: row.performedByName,
        details: row.details || null,
        timestamp: row.createdAt,
      }))
    );
  } catch (err) {
    console.error('Recent activity error:', err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
}

module.exports = { getStats, getRoleDistribution, getRecentActivity };
