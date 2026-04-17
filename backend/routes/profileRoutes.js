const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;
