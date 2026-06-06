const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const pool = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = Router();

const tokenBlacklist = new Set();

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

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone, business_name, modality } = req.body;

    if (!email || !password || !full_name || !business_name) {
      return res.status(400).json({ error: 'email, password, full_name y business_name son requeridos' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const trimmedPassword = String(password).trim();
    if (trimmedPassword.length < 6) {
      return res.status(400).json({ error: 'Password debe tener al menos 6 caracteres' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const password_hash = bcrypt.hashSync(trimmedPassword, 10);
    const slug = slugify(business_name);

    const slugCheck = await pool.query('SELECT id FROM tenants WHERE slug = $1', [slug]);
    const finalSlug = slugCheck.rows.length > 0
      ? `${slug}-${Date.now()}`
      : slug;

    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, 'prestamista')
       RETURNING id, email, full_name, phone, role, is_active, created_at`,
      [trimmedEmail, password_hash, sanitize(full_name), sanitize(phone || '')]
    );

    const user = userResult.rows[0];

    const validModalities = ['diario', 'semanal', 'mensual', 'flex'];
    const selectedModality = validModalities.includes(modality) ? modality : 'diario';

    await pool.query(
      `INSERT INTO tenants (user_id, slug, business_name, modality)
       VALUES ($1, $2, $3, $4)`,
      [user.id, finalSlug, sanitize(business_name), selectedModality]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.full_name, tenantSlug: finalSlug },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.full_name,
        tenantSlug: finalSlug,
      },
    });
  } catch (err) {
    console.error('[AUTH REGISTER ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const trimmedPassword = String(password).trim();

    const result = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.full_name, u.role, u.is_active, t.slug AS tenant_slug
       FROM users u
       LEFT JOIN tenants t ON t.user_id = u.id
       WHERE u.email = $1`,
      [trimmedEmail]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!bcrypt.compareSync(trimmedPassword, user.password_hash)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Cuenta desactivada' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.full_name,
        tenantSlug: user.tenant_slug,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.full_name,
        tenantSlug: user.tenant_slug,
      },
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.is_active, t.slug AS tenant_slug,
              t.business_name, t.primary_color, t.modality, t.logo_url
       FROM users u
       LEFT JOIN tenants t ON t.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[AUTH ME ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/logout', requireAuth, (req, res) => {
  const header = req.headers.authorization;
  const token = header.split(' ')[1];
  tokenBlacklist.add(token);
  res.json({ message: 'Sesión cerrada exitosamente' });
});

module.exports = router;
