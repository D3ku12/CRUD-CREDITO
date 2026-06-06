require('dotenv').config();

const express = require('express');
const path = require('path');
const passport = require('passport');
const pool = require('./db/connection');
const { helmet, generalLimiter, authLimiter, sanitize, blockPathTraversal } = require('./middleware/security');

const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/oauth');
const tenantsRoutes = require('./routes/tenants');
const leadsRoutes = require('./routes/leads');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const paymentsRoutes = require('./routes/payments');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(generalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitize);
app.use(blockPathTraversal);
app.use(passport.initialize());

app.use('/api/auth/login', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
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
