import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function initDb() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()'); // Simple check

    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await pool.query(schemaSql);

    console.log('Reading seed.sql...');
    const seedPath = path.join(__dirname, '../sql/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Executing seed data...');
    await pool.query(seedSql);

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
