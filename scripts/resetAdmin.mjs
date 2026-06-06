import bcrypt from 'bcryptjs';
import pool from '../src/db/connection.js';

const hash = await bcrypt.hash('Credi2025*', 10);
await pool.query(
  "UPDATE users SET password = $1 WHERE email = 'admin@crediconfianza.com'",
  [hash]
);
console.log('✅ Password reseteada a: Credi2025*');
await pool.end();
process.exit(0);
