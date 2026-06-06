const { Router } = require('express');
const validator = require('validator');
const pool = require('../db/connection');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

const router = Router();

function sanitize(str) {
  return validator.escape(String(str || '').trim());
}

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT slug, business_name, primary_color, modality, slogan, logo_url
       FROM tenants WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error('[TENANTS SHOW ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/me', requireAuth, async (req, res) => {
  try {
    const { business_name, primary_color, modality, slogan, logo_url } = req.body;

    const tenantResult = await pool.query(
      'SELECT id FROM tenants WHERE user_id = $1',
      [req.user.id]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    const validModalities = ['diario', 'semanal', 'mensual', 'flex'];
    const finalModality = modality && validModalities.includes(modality) ? modality : undefined;

    const result = await pool.query(
      `UPDATE tenants
       SET business_name = COALESCE($1, business_name),
           primary_color = COALESCE($2, primary_color),
           modality = COALESCE($3, modality),
           slogan = COALESCE($4, slogan),
           logo_url = COALESCE($5, logo_url),
           updated_at = NOW()
       WHERE user_id = $6
       RETURNING id, slug, business_name, primary_color, modality, slogan, logo_url`,
      [
        business_name ? sanitize(business_name) : null,
        primary_color ? sanitize(primary_color) : null,
        finalModality || null,
        slogan ? sanitize(slogan) : null,
        logo_url ? sanitize(logo_url) : null,
        req.user.id,
      ]
    );

    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error('[TENANTS UPDATE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/', requireAuth, requireSuperAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.email, u.full_name
       FROM tenants t
       LEFT JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC`
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error('[TENANTS LIST ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { slug, name, color, modality, slogan } = req.body;
    if (!slug || !name) {
      return res.status(400).json({ error: 'slug y name son requeridos' });
    }
    const result = await pool.query(
      `INSERT INTO tenants (slug, business_name, primary_color, modality, slogan)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        sanitize(slug),
        sanitize(name),
        color ? sanitize(color) : '#1D9E75',
        modality || 'diario',
        slogan ? sanitize(slogan) : null,
      ]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El slug ya existe' });
    }
    console.error('[TENANTS CREATE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:slug', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, color, modality, slogan } = req.body;
    const result = await pool.query(
      `UPDATE tenants
       SET business_name = COALESCE($1, business_name),
           primary_color = COALESCE($2, primary_color),
           modality = COALESCE($3, modality),
           slogan = COALESCE($4, slogan),
           updated_at = NOW()
       WHERE slug = $5
       RETURNING *`,
      [
        name ? sanitize(name) : null,
        color ? sanitize(color) : null,
        modality || null,
        slogan ? sanitize(slogan) : null,
        slug,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error('[TENANTS UPDATE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:slug', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('DELETE FROM tenants WHERE slug = $1 RETURNING id', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('[TENANTS DELETE ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
