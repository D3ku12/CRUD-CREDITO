const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const router = Router();

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: (process.env.BACKEND_URL || '') + '/api/auth/google/callback',
    scope: ['profile', 'email'],
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email provided by Google'), null);
      }

      let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = result.rows[0];
      let tenantSlug = '';

      if (!user) {
        const fullName = profile.displayName || email.split('@')[0];
        const slug = slugify(fullName) || 'user-' + Date.now();

        const slugCheck = await pool.query('SELECT id FROM tenants WHERE slug = $1', [slug]);
        const finalSlug = slugCheck.rows.length > 0 ? `${slug}-${Date.now()}` : slug;

        const userResult = await pool.query(
          `INSERT INTO users (email, password_hash, full_name, role)
           VALUES ($1, 'GOOGLE_OAUTH', $2, 'prestamista')
           RETURNING id, email, full_name, role`,
          [email, fullName]
        );
        user = userResult.rows[0];
        tenantSlug = finalSlug;

        await pool.query(
          `INSERT INTO tenants (user_id, slug, business_name)
           VALUES ($1, $2, $3)`,
          [user.id, finalSlug, fullName]
        );
      }

      const tenantResult = await pool.query('SELECT slug FROM tenants WHERE user_id = $1', [user.id]);
      if (tenantResult.rows[0]?.slug) {
        tenantSlug = tenantResult.rows[0].slug;
      }

      return done(null, { ...user, tenantSlug });
    } catch (err) {
      console.error('[GOOGLE OAUTH ERROR]', err.message);
      return done(err, null);
    }
  }));

  router.get('/google', passport.authenticate('google', { session: false }));

  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: (process.env.FRONTEND_URL || '') + '/login?error=oauth_failed' }), (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.full_name,
        tenantSlug: req.user.tenantSlug || '',
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.redirect((process.env.FRONTEND_URL || '') + '/auth/callback?token=' + token);
  });
}

module.exports = router;
