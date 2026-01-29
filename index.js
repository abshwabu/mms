require('dotenv').config();
const express = require('express');
const bodyParser = require('express').json;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const { sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.json({ ok: true, service: 'mms-auth' }));

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		app.listen(port, () => console.log(`mms-auth running on http://localhost:${port}`));
	} catch (err) {
		console.error('Failed to start app', err);
		process.exit(1);
	}
};

start();
