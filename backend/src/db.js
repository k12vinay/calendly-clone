import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

export const getDefaultUserId = () =>
  Number.parseInt(process.env.DEFAULT_USER_ID || "1", 10);
