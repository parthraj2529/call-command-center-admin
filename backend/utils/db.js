
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool of database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'callcenter_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'callcenter_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
