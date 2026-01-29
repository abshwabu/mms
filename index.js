require('dotenv').config();
const express = require('express');
const bodyParser = require('express').json;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.json({ ok: true, service: 'mms-auth' }));

app.listen(port, () => console.log(`mms-auth running on http://localhost:${port}`));
