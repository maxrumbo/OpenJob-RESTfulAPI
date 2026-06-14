const path = require('path');
require('dotenv').config();

const { runner } = require('node-pg-migrate');

const direction = process.argv[2] === 'down' ? 'down' : 'up';

const databaseUrl = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
};

runner({
  databaseUrl,
  dir: path.join(__dirname, '..', 'migrations'),
  direction,
  migrationsTable: 'pgmigrations',
  count: direction === 'down' ? 1 : undefined,
})
  .then(() => {
    console.log(`Migration ${direction} completed`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
