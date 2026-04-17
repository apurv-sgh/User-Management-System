const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

router.get('/', requireRole('admin', 'manager'), getUsers);
router.get('/:id', getUserById);
router.post('/', requireRole('admin'), createUser);
router.put('/:id', requireRole('admin', 'manager', 'user'), updateUser);
router.delete('/:id', requireRole('admin', 'manager'), deleteUser);

module.exports = router;
 