const { Router } = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const pool = require('../db/connection');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

const router = Router();

function sanitize(str) {
  return validator.escape(String(str || '').trim());
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

router.get('/users', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { search, plan, subscription_status, limit = 20, offset = 0 } = req.query;
    const params = [];
    const conditions = ["u.role = 'prestamista'"];

    if (search) {
      conditions.push(`(u.full_name ILIKE $${params.length + 1} OR u.email ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (plan) {
      conditions.push(`s.plan = $${params.length + 1}`);
      params.push(plan);
    }

    if (subscription_status) {
      conditions.push(`s.status = $${params.length + 1}`);
      params.push(subscription_status);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const offsetNum = Math.max(parseInt(offset) || 0, 0);

    params.push(limitNum);
    params.push(offsetNum);

    const result = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.is_active, u.created_at,
              t.id AS tenant_id, t.slug AS tenant_slug, t.business_name, t.primary_color, t.modality,
              s.id AS subscription_id, s.plan, s.status AS subscription_status, s.expires_at AS subscription_expires_at
       FROM users u
       LEFT JOIN tenants t ON t.user_id = u.id
       LEFT JOIN LATERAL (
         SELECT id, plan, status, expires_at FROM subscriptions
         WHERE user_id = u.id
         ORDER BY created_at DESC
         LIMIT 1
       ) s ON true
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users u
       LEFT JOIN LATERAL (
         SELECT plan, status FROM subscriptions
         WHERE user_id = u.id
         ORDER BY created_at DESC
         LIMIT 1
       ) s ON true
       ${where}`,
      params.slice(0, -2)
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    });
  } catch (err) {
    console.error('[ADMIN USERS LIST ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/users', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, full_name, phone, business_name, modality } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'email, password y full_name son requeridos' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'El email ya existe' });
    }

    const hash = bcrypt.hashSync(String(password).trim(), 10);

    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, 'prestamista')
       RETURNING id, email, full_name, phone, role, is_active, created_at`,
      [trimmedEmail, hash, sanitize(full_name), sanitize(phone || '')]
    );

    const user = userResult.rows[0];

    if (business_name) {
      const slug = slugify(business_name);
      const slugCheck = await pool.query('SELECT id FROM tenants WHERE slug = $1', [slug]);
      const finalSlug = slugCheck.rows.length > 0 ? `${slug}-${user.id}` : slug;

      const validModalities = ['diario', 'semanal', 'mensual', 'flex'];
      const selectedModality = modality && validModalities.includes(modality) ? modality : 'diario';

      await pool.query(
        `INSERT INTO tenants (user_id, slug, business_name, modality)
         VALUES ($1, $2, $3, $4)`,
        [user.id, finalSlug, sanitize(business_name), selectedModality]
      );
    }

    res.status(201).json({ data: user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El email ya existe' });
    }
    console.error('[ADMIN USERS CREATE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/users/:id/toggle', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      'SELECT id, is_active FROM users WHERE id = $1 AND role = $2',
      [id, 'prestamista']
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const newStatus = !userResult.rows[0].is_active;

    await pool.query(
      'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2',
      [newStatus, id]
    );

    res.json({ data: { id: Number(id), is_active: newStatus } });
  } catch (err) {
    console.error('[ADMIN USERS TOGGLE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/stats', requireAuth, requireSuperAdmin, async (_req, res) => {
  try {
    const [totalUsers, activeSubscriptions, leadsThisWeek, mrrResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'prestamista'"),
      pool.query("SELECT COUNT(*) FROM subscriptions WHERE status = 'activo'"),
      pool.query(
        `SELECT COUNT(*) FROM leads
         WHERE created_at >= DATE_TRUNC('week', NOW() AT TIME ZONE 'America/Bogota')`
      ),
      pool.query(
        `SELECT COALESCE(SUM(amount_cop), 0) AS mrr
         FROM subscriptions
         WHERE status = 'activo'`
      ),
    ]);

    res.json({
      data: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        activeSubscriptions: parseInt(activeSubscriptions.rows[0].count),
        leadsThisWeek: parseInt(leadsThisWeek.rows[0].count),
        mrr: parseInt(mrrResult.rows[0].mrr),
      },
    });
  } catch (err) {
    console.error('[ADMIN STATS ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/recent', requireAuth, requireSuperAdmin, async (_req, res) => {
  try {
    const [usersResult, leadsResult] = await Promise.all([
      pool.query(
        `SELECT id, full_name AS title, email AS subtitle, 'usuario' AS type, created_at
         FROM users WHERE role = 'prestamista'
         ORDER BY created_at DESC LIMIT 5`
      ),
      pool.query(
        `SELECT id, owner_name AS title, business_name AS subtitle, 'lead' AS type, created_at
         FROM leads
         ORDER BY created_at DESC LIMIT 5`
      ),
    ]);

    const merged = [...usersResult.rows, ...leadsResult.rows]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    res.json({ data: merged });
  } catch (err) {
    console.error('[ADMIN RECENT ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/users/:id', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.is_active, u.created_at,
              t.id AS tenant_id, t.slug AS tenant_slug, t.business_name, t.primary_color, t.modality, t.slogan, t.logo_url
       FROM users u
       LEFT JOIN tenants t ON t.user_id = u.id
       WHERE u.id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const paymentsResult = await pool.query(
      `SELECT id, plan, status, amount_cop, wompi_transaction_id, wompi_reference, starts_at, expires_at, created_at
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      data: {
        ...userResult.rows[0],
        payments: paymentsResult.rows,
      },
    });
  } catch (err) {
    console.error('[ADMIN USER DETAIL ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/subscriptions', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { status: filterStatus, limit = 20, offset = 0 } = req.query;
    const params = [];
    const conditions = [];

    const validStatuses = ['activo', 'pendiente', 'vencido', 'cancelado'];
    if (filterStatus && validStatuses.includes(filterStatus)) {
      conditions.push(`s.status = $${params.length + 1}`);
      params.push(filterStatus);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const offsetNum = Math.max(parseInt(offset) || 0, 0);

    params.push(limitNum);
    params.push(offsetNum);

    const result = await pool.query(
      `SELECT s.id, s.user_id, s.plan, s.status, s.amount_cop, s.wompi_reference, s.starts_at, s.expires_at, s.created_at,
              u.full_name, u.email
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       ${where}
       ORDER BY s.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM subscriptions s ${where}`,
      params.slice(0, -2)
    );

    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount_cop), 0) AS total FROM subscriptions WHERE status = 'activo'`
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      totalRecaudado: parseInt(totalResult.rows[0].total),
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (err) {
    console.error('[ADMIN SUBSCRIPTIONS ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/audit', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const limitNum = Math.min(Math.max(parseInt(limit) || 50, 1), 200);
    const offsetNum = Math.max(parseInt(offset) || 0, 0);

    const result = await pool.query(
      `SELECT a.id, a.user_id, u.email AS user_email, u.full_name AS user_name,
              a.action, a.entity, a.entity_id, a.metadata, a.ip, a.created_at
       FROM audit_log a
       LEFT JOIN users u ON u.id = a.user_id
       ORDER BY a.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limitNum, offsetNum]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM audit_log');

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (err) {
    console.error('[ADMIN AUDIT ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
