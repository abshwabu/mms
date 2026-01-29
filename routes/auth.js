const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const UserStore = require('../models/userStore');

const router = express.Router();
const users = new UserStore();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (users.findByUsername(username)) return res.status(409).json({ error: 'username taken' });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = { id: nanoid(), username, email: email || null, passwordHash: hash, createdAt: new Date().toISOString() };
  users.create(user);
  const safe = { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
  res.status(201).json(safe);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = users.findByUsername(username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const secret = process.env.JWT_SECRET || 'change-me';
  const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;
