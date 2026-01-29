const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const getSequelize = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    return new Sequelize(databaseUrl, { logging: false });
  }
  const db = process.env.DB_NAME || 'mms_db';
  const user = process.env.DB_USER || 'postgres';
  const pass = process.env.DB_PASS || '';
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 5432;
  return new Sequelize(db, user, pass, { host, port, dialect: 'postgres', logging: false });
};

const sequelize = getSequelize();

const User = require('./user')(sequelize, DataTypes);

module.exports = { sequelize, Sequelize, User };
