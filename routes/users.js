const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'user not found' });
  const safe = { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
  res.json(safe);
});

module.exports = router;
