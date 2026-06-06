const { Router } = require('express');
const validator = require('validator');
const pool = require('../db/connection');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

const router = Router();

const VALID_MODALITIES = ['diario', 'semanal', 'mensual', 'flex'];
const VALID_STATUSES = ['nuevo', 'contactado', 'convertido', 'descartado'];

function sanitize(str) {
  return validator.escape(String(str || '').trim());
}

router.post('/', async (req, res) => {
  try {
    const { business_name, owner_name, whatsapp, modality, source } = req.body;

    const errors = [];
    if (!owner_name || typeof owner_name !== 'string') {
      errors.push('owner_name es requerido');
    }
    if (!whatsapp || typeof whatsapp !== 'string') {
      errors.push('whatsapp es requerido');
    } else if (!/^\+57\d{10}$/.test(String(whatsapp).trim())) {
      errors.push('whatsapp debe empezar con +57 y tener 10 dígitos después');
    }
    if (modality && !VALID_MODALITIES.includes(modality)) {
      errors.push(`modality debe ser uno de: ${VALID_MODALITIES.join(', ')}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('. ') });
    }

    const result = await pool.query(
      `INSERT INTO leads (business_name, owner_name, whatsapp, modality, source, status)
       VALUES ($1, $2, $3, $4, $5, 'nuevo')
       RETURNING id, business_name, owner_name, modality, status, created_at`,
      [
        business_name ? sanitize(business_name) : null,
        sanitize(owner_name),
        String(whatsapp).trim(),
        modality || null,
        source || 'landing',
      ]
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error('[LEADS CREATE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { status: filterStatus, limit = 50, offset = 0 } = req.query;
    const params = [];
    const conditions = [];

    if (filterStatus && VALID_STATUSES.includes(filterStatus)) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(filterStatus);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitNum = Math.min(Math.max(parseInt(limit) || 50, 1), 200);
    const offsetNum = Math.max(parseInt(offset) || 0, 0);

    params.push(limitNum);
    params.push(offsetNum);

    const result = await pool.query(
      `SELECT id, business_name, owner_name, whatsapp, modality, source, status, notes, created_at
       FROM leads ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM leads ${where}`,
      params.slice(0, -2)
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (err) {
    console.error('[LEADS LIST ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status debe ser uno de: ${VALID_STATUSES.join(', ')}` });
    }

    const result = await pool.query(
      `UPDATE leads
       SET status = COALESCE($1, status),
           notes = COALESCE($2, notes)
       WHERE id = $3
       RETURNING id, business_name, owner_name, whatsapp, modality, source, status, notes, created_at`,
      [
        status || null,
        notes ? sanitize(notes) : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error('[LEADS UPDATE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
