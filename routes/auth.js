const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const exists = await User.findOne({ where: { username } });
  if (exists) return res.status(409).json({ error: 'username taken' });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  try {
    const user = await User.create({ username, email: email || null, passwordHash: hash });
    const safe = { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
    res.status(201).json(safe);
  } catch (err) {
    res.status(500).json({ error: 'failed to create user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const secret = process.env.JWT_SECRET || 'change-me';
  const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;
