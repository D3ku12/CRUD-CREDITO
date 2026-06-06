const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const pool = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' });
    }

    if (!validator.isEmail(String(email))) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPassword = String(password).trim();

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!bcrypt.compareSync(trimmedPassword, user.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (user.plan_status === 'inactivo' && user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Cuenta desactivada' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      tenantSlug: user.tenant_slug,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: payload });
  } catch (err) {
    console.error('[DB] Error en login:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
