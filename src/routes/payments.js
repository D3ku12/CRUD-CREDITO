const { Router } = require('express');
const axios = require('axios');
const crypto = require('crypto');
const pool = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = Router();

const PLANS = {
  basico: { amount: 8900000, name: 'Básico' },
  pro: { amount: 17900000, name: 'Pro' },
  empresarial: { amount: 32000000, name: 'Empresarial' },
};

const WOMPI_API = process.env.WOMPI_API_URL || 'https://sandbox.wompi.co/v1';

router.post('/create', requireAuth, async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: 'planId inválido. Use: basico, pro, empresarial' });
    }

    const plan = PLANS[planId];
    const reference = `plan_${planId}_${req.user.id}_${Date.now()}`;

    const response = await axios.post(
      `${WOMPI_API}/transactions`,
      {
        amount_in_cents: plan.amount,
        currency: 'COP',
        customer_email: req.user.email,
        reference,
        redirect_url: `${process.env.FRONTEND_URL}/dashboard?pago=exitoso`,
        payment_method_types: ['PSE', 'CARD', 'NEQUI'],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const txnId = response.data?.data?.id;
    const checkoutUrl = txnId
      ? `https://checkout.wompi.co/p/${txnId}`
      : `${WOMPI_API}/transactions/${reference}`;

    res.json({ checkoutUrl });
  } catch (err) {
    const detail = err.response?.data || err.message;
    res.status(500).json({ error: 'Error al crear sesión de pago', detail });
  }
});

router.post('/webhook', async (req, res) => {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  const signature = req.headers['x-event-signature'] || req.headers['x-signature'];

  if (secret) {
    if (!signature) {
      return res.status(401).json({ error: 'Firma faltante' });
    }

    const rawBody = JSON.stringify(req.body);
    const computed = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (computed !== signature) {
      return res.status(401).json({ error: 'Firma inválida' });
    }
  }

  const event = req.body;
  const transaction = event.data?.transaction || event.data || {};

  if (transaction.status === 'APPROVED') {
    const reference = transaction.reference || '';
    const match = reference.match(/^plan_(basico|pro|empresarial)_(\d+)_/);

    if (match) {
      const planId = match[1];
      const userId = match[2];
      const now = new Date();
      const vencimiento = new Date(now);
      vencimiento.setDate(vencimiento.getDate() + 30);

      try {
        await pool.query(
          `UPDATE users
           SET plan = $1, plan_status = 'activo', plan_expires_at = $2
           WHERE id = $3`,
          [PLANS[planId]?.name || planId, vencimiento, userId]
        );
      } catch (err) {
        console.error('[DB] Error al actualizar plan tras webhook:', err.message);
      }
    }
  }

  res.status(200).json({ received: true });
});

router.get('/status', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT plan, plan_status, plan_expires_at FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let diasRestantes = 0;
    if (user.plan_expires_at) {
      const hoy = new Date();
      const venc = new Date(user.plan_expires_at);
      diasRestantes = Math.max(0, Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24)));
    }

    res.json({
      plan: user.plan || null,
      estado: user.plan_status || 'inactivo',
      fechaVencimiento: user.plan_expires_at || null,
      diasRestantes,
    });
  } catch (err) {
    console.error('[DB] Error al obtener estado del plan:', err.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
