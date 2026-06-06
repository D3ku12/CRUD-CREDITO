const pool = require('../db/connection');

async function auditLog(req, action, entity, entityId, metadata) {
  try {
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity, entity_id, metadata, ip)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user?.id || null,
        action,
        entity || null,
        entityId || null,
        metadata ? JSON.stringify(metadata) : null,
        req.ip || req.headers['x-forwarded-for'] || null,
      ]
    );
  } catch (err) {
    console.error('[AUDIT] Error al guardar audit log:', err.message);
  }
}

function auditMiddleware(action, entity) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      const entityId = req.params?.id || req.body?.id || null;
      auditLog(req, action, entity, entityId, { body });
      return originalJson(body);
    };
    next();
  };
}

module.exports = { auditLog, auditMiddleware };
