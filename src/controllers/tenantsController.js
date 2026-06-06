const pool = require('../db/connection');
const validator = require('validator');

const clean = (str) => validator.escape(String(str || '').trim().substring(0, 200));

exports.list = async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tenants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('[DB] Error al listar tenants:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
};

exports.show = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tenants WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tenant no encontrado' });
    }
    const { name, color, modality, slogan } = result.rows[0];
    return res.status(200).json({ name, color, modality, slogan });
  } catch (err) {
    console.error('[DB] Error al buscar tenant:', err.message);
    return res.status(500).json({ error: 'Error interno' });
  }
};

exports.create = async (req, res) => {
  const { slug, name, color, modality, slogan } = req.body;
  if (!slug || !name) {
    return res.status(400).json({ error: 'slug y name son requeridos' });
  }
  if (!validator.isSlug(String(slug))) {
    return res.status(400).json({ error: 'Slug inválido' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tenants (slug, name, color, modality, slogan)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        validator.escape(String(slug).trim()),
        clean(name),
        validator.escape(String(color || '#1D9E75').trim()),
        clean(modality),
        clean(slogan),
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El slug ya existe' });
    }
    console.error('[DB] Error al crear tenant:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, color, modality, slogan } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tenants
       SET name = COALESCE($1, name),
           color = COALESCE($2, color),
           modality = COALESCE($3, modality),
           slogan = COALESCE($4, slogan)
       WHERE slug = $5
       RETURNING *`,
      [
        name ? clean(name) : null,
        color ? validator.escape(String(color).trim()) : null,
        modality ? clean(modality) : null,
        slogan ? clean(slogan) : null,
        slug,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[DB] Error al actualizar tenant:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('DELETE FROM tenants WHERE slug = $1 RETURNING id', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('[DB] Error al eliminar tenant:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
};
