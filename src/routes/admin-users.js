const { Router } = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/connection');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, requireSuperAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, role, name, plan, plan_status, tenant_slug, created_at FROM users WHERE role = 'prestamista' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('[DB] Error al listar prestamistas:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/', requireAuth, requireSuperAdmin, async (req, res) => {
  const { name, email, password, plan } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email y password requeridos' });
  }
  try {
    const hash = bcrypt.hashSync(String(password).trim(), 10);
    const result = await pool.query(
      `INSERT INTO users (email, password, role, name, plan, plan_status)
       VALUES ($1, $2, 'prestamista', $3, $4, 'activo')
       RETURNING id, email, role, name, plan, plan_status, created_at`,
      [String(email).trim().toLowerCase(), hash, String(name).trim(), plan || 'Básico']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El email ya existe' });
    }
    console.error('[DB] Error al crear prestamista:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/:id/toggle', requireAuth, requireSuperAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query('SELECT plan_status FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const newStatus = user.rows[0].plan_status === 'activo' ? 'inactivo' : 'activo';
    await pool.query('UPDATE users SET plan_status = $1 WHERE id = $2', [newStatus, id]);
    res.json({ id: Number(id), plan_status: newStatus });
  } catch (err) {
    console.error('[DB] Error al toggle usuario:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
