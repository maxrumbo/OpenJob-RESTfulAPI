require('dotenv').config();

const { Pool } = require('pg');

const requiredEnv = ['PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGHOST', 'PGPORT'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} belum diatur`);
  }
});

module.exports = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
});
