import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Client } = pkg;

const cs = process.env.DATABASE_URL;
if (!cs) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(2);
}

const client = new Client({
  connectionString: cs,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    console.log('Connecting to:', cs.split('@')[1] || cs);
    await client.connect();
    const r = await client.query('SELECT now() as now');
    console.log('Connected, server time:', r.rows[0].now);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

main();
