const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de login' },
});

const sanitize = (req, res, next) => {
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
};

const blockPathTraversal = (req, res, next) => {
  if (req.url.includes('..') || req.url.includes('%2e%2e')) {
    return res.status(400).json({ error: 'Ruta no permitida' });
  }
  next();
};

const cleanInput = (...fields) => (req, res, next) => {
  if (req.body) {
    for (const field of fields) {
      if (typeof req.body[field] === 'string') {
        req.body[field] = validator.escape(req.body[field].trim());
      }
    }
  }
  next();
};

module.exports = {
  helmet,
  generalLimiter,
  authLimiter,
  sanitize,
  blockPathTraversal,
  cleanInput,
};
