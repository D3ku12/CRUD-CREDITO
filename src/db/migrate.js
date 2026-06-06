const pool = require('./connection');

const migrate = async () => {
  console.log('[DB] Iniciando migración…');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'prestamista',
      name VARCHAR(255),
      tenant_slug VARCHAR(100),
      plan VARCHAR(50) DEFAULT 'ninguno',
      plan_status VARCHAR(50) DEFAULT 'inactivo',
      plan_expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      color VARCHAR(20) DEFAULT '#1D9E75',
      modality VARCHAR(50) DEFAULT 'diario',
      slogan VARCHAR(500),
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255),
      owner_name VARCHAR(255),
      whatsapp VARCHAR(50),
      modality VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const adminHash = '$2a$10$UUt5dDwkeRGWUpMTuHXc1u3Pgenfk.NnFewBdlwHctOcA/cg97sWy';
  await pool.query(
    `INSERT INTO users (email, password, role, name)
     VALUES ('stevenhm03@gmail.com', $1, 'superadmin', 'Admin')
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role`,
    [adminHash]
  );
  console.log('[DB] Superadmin asegurado');

  const tenants = [
    { slug: 'finanexpress', name: 'FinanExpress', color: '#1D9E75', modality: 'diario' },
    { slug: 'creditofacil', name: 'CréditoFácil', color: '#185FA5', modality: 'semanal' },
    { slug: 'microya', name: 'MicroYa', color: '#BA7517', modality: 'mensual' },
  ];

  for (const t of tenants) {
    await pool.query(
      `INSERT INTO tenants (slug, name, color, modality)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO NOTHING`,
      [t.slug, t.name, t.color, t.modality]
    );
  }
  console.log('[DB] Tenants de ejemplo insertados');

  await pool.end();
  console.log('[DB] Migración completada');
};

migrate().catch((err) => {
  console.error('[DB] Error en migración:', err.message);
  process.exit(1);
});
