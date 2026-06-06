require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pool = require('./db/connection');

const contactRoutes = require('./routes/contact');
const tenantsRoutes = require('./routes/tenants');
const authRoutes = require('./routes/auth');
const adminUsersRoutes = require('./routes/admin-users');
const paymentsRoutes = require('./routes/payments');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas solicitudes, intenta más tarde' },
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security logging middleware
app.use((req, res, next) => {
  const suspicious = /(<script|SELECT|DROP TABLE|INSERT INTO|--|;--|\/\*|\*\/|UNION|javascript:|\.\.\/|base64)/i;
  const body = JSON.stringify(req.body || {});
  const query = JSON.stringify(req.query || {});
  if (suspicious.test(body) || suspicious.test(query) || suspicious.test(req.url)) {
    console.warn('[SECURITY] Suspicious request:', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      body: body.substring(0, 200),
      query,
    });
    return res.status(400).json({ error: 'Solicitud no permitida' });
  }
  next();
});

// Block path traversal
app.use((req, res, next) => {
  if (req.url.includes('..') || req.url.includes('%2e%2e')) {
    return res.status(400).json({ error: 'Ruta no permitida' });
  }
  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de login' },
});
app.use('/api/auth/login', authLimiter);

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ ok: true, users: result.rows[0].count });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/payments', paymentsRoutes);

const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

pool.query('SELECT 1').then(() => {
  console.log('[DB] Conectado a PostgreSQL');
}).catch((err) => {
  console.error('[DB] Error de conexión:', err.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
