require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpass';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const exists = await User.findOne({ where: { username: ADMIN_USERNAME } });
    if (exists) {
      console.log('admin user already exists:', ADMIN_USERNAME);
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);
    const user = await User.create({ username: ADMIN_USERNAME, email: ADMIN_EMAIL, role: 'admin', passwordHash: hash });
    console.log('created admin user:', user.username);
    process.exit(0);
  } catch (err) {
    console.error('failed to seed admin', err);
    process.exit(1);
  }
};

run();
