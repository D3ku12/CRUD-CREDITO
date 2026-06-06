const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./connection');

const migrate = async () => {
  console.log('[DB] Ejecutando migración…');

  const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('[DB] Schema ejecutado correctamente');

  try {
    const adminEmail = process.env.SUPERADMIN_EMAIL || 'stevenhm03@gmail.com';
    const adminPassword = process.env.SUPERADMIN_PASSWORD || 'Admin123!';
    const hash = bcrypt.hashSync(adminPassword, 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, 'Super Admin', 'superadmin')
       ON CONFLICT (email) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             full_name = EXCLUDED.full_name,
             role = EXCLUDED.role`,
      [adminEmail, hash]
    );
    console.log('[DB] Superadmin asegurado');
  } catch (err) {
    console.warn('[DB] No se pudo asegurar superadmin (no crítico):', err.message);
  }

  await pool.end();
  console.log('[DB] Migración completada');
};

migrate().catch((err) => {
  console.error('[DB] Error en migración:', err.message);
});
