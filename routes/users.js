const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/rbac');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'user not found' });
  const safe = { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role, createdAt: user.createdAt };
  res.json(safe);
});

// Admin: list users
router.get('/', auth, requireRole('admin'), async (req, res) => {
  const list = await User.findAll({ attributes: ['id','username','email','firstName','lastName','phone','role','createdAt'] });
  res.json(list);
});

module.exports = router;
