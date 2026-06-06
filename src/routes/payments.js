const { Router } = require('express');
const crypto = require('crypto');
const pool = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');

const router = Router();

const PLANS = {
  basico: { amount: 8900000, name: 'Básico' },
  pro: { amount: 17900000, name: 'Pro' },
  empresarial: { amount: 32000000, name: 'Empresarial' },
};

router.post('/create', requireAuth, async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: 'planId inválido. Use: basico, pro, empresarial' });
    }

    const plan = PLANS[planId];
    const reference = `CC-${req.user.id}-${planId}-${Date.now()}`;

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, status, amount_cop, wompi_reference)
       VALUES ($1, $2, 'pendiente', $3, $4)`,
      [req.user.id, planId, plan.amount, reference]
    );

    const amountStr = String(plan.amount);
    const integrity = crypto.createHash('sha256')
      .update(reference + amountStr + 'COP' + (process.env.WOMPI_INTEGRITY_SECRET || ''))
      .digest('hex');

    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    const redirectUrl = encodeURIComponent(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?pago=exitoso`);
    const checkoutUrl =
      `https://checkout.wompi.co/p/?public-key=${publicKey}` +
      `&currency=COP&amount-in-cents=${plan.amount}` +
      `&reference=${reference}&signature:integrity=${integrity}` +
      `&redirect-url=${redirectUrl}`;

    res.json({ checkoutUrl });
  } catch (err) {
    console.error('[PAYMENTS CREATE ERROR]', err.message);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
});

router.post('/webhook', async (req, res) => {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  const signature = req.headers['x-event-signature'] || req.headers['x-signature'];

  if (secret) {
    if (!signature) {
      return res.status(200).json({ received: true });
    }

    const rawBody = JSON.stringify(req.body);
    const computed = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (computed !== signature) {
      return res.status(200).json({ received: true });
    }
  }

  const event = req.body;
  const transaction = event.data?.transaction || event.data || {};

  if (transaction.status === 'APPROVED') {
    const reference = transaction.reference || '';

    if (reference.startsWith('CC-')) {
      try {
        const parts = reference.split('-');
        const userId = parts[1];
        const planId = parts[2];

        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + 30);

        const result = await pool.query(
          `UPDATE subscriptions
           SET status = 'activo',
               wompi_transaction_id = COALESCE($1, wompi_transaction_id),
               starts_at = $2,
               expires_at = $3
           WHERE wompi_reference = $4 AND status = 'pendiente'
           RETURNING id, user_id`,
          [transaction.id || null, now, expiresAt, reference]
        );

        if (result.rows.length > 0) {
          await auditLog(
            { user: { id: result.rows[0].user_id }, ip: req.ip, headers: req.headers },
            'pago_aprobado',
            'subscription',
            result.rows[0].id,
            { reference, plan: planId, amount: transaction.amount_in_cents }
          );
        }
      } catch (err) {
        console.error('[PAYMENTS WEBHOOK ERROR]', err.message);
      }
    }
  }

  res.status(200).json({ received: true });
});

router.get('/status', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT plan, status, amount_cop, wompi_reference, starts_at, expires_at
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    const sub = result.rows[0];

    if (!sub) {
      return res.json({
        plan: null,
        estado: 'inactivo',
        fechaVencimiento: null,
        diasRestantes: 0,
      });
    }

    if (sub.status === 'activo' && sub.expires_at && new Date(sub.expires_at) < new Date()) {
      await pool.query(
        `UPDATE subscriptions SET status = 'vencido' WHERE id = $1`,
        [sub.id]
      );
      sub.status = 'vencido';
    }

    let diasRestantes = 0;
    if (sub.expires_at) {
      const hoy = new Date();
      const venc = new Date(sub.expires_at);
      diasRestantes = Math.max(0, Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24)));
    }

    const tenantResult = await pool.query(
      'SELECT slug FROM tenants WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      plan: sub.plan || null,
      estado: sub.status || 'inactivo',
      fechaVencimiento: sub.expires_at || null,
      diasRestantes,
      tenantSlug: tenantResult.rows[0]?.slug || null,
    });
  } catch (err) {
    console.error('[PAYMENTS STATUS ERROR]', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
