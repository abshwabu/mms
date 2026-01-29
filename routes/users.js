const express = require('express');
const UserStore = require('../models/userStore');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const users = new UserStore();

router.get('/me', auth, (req, res) => {
  const user = users.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'user not found' });
  const safe = { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
  res.json(safe);
});

module.exports = router;
