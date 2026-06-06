import bcrypt from 'bcryptjs';
import pool from '../src/db/connection.js';

const hash = await bcrypt.hash('Credi2026*', 10);
await pool.query(
  "UPDATE users SET password = $1 WHERE email = 'stevenhm03@gmail.com'",
  [hash]
);
console.log('✅ Password reseteada a: Credi2026*');
await pool.end();
process.exit(0);
