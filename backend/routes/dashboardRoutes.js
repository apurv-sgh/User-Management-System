const express = require('express');
const router = express.Router();
const { getStats, getRoleDistribution, getRecentActivity } = require('../controllers/dashboardController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('admin', 'manager'));

router.get('/stats', getStats);
router.get('/role-distribution', getRoleDistribution);
router.get('/recent-activity', getRecentActivity);

module.exports = router;
