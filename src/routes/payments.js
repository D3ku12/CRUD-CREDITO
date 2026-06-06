const { Router } = require('express');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('../middleware/auth');

const router = Router();
const USERS_FILE = path.resolve(__dirname, '../../data/users.json');

const PLANS = {
  basico: { amount: 8900000, name: 'Básico' },
  pro: { amount: 17900000, name: 'Pro' },
  empresarial: { amount: 32000000, name: 'Empresarial' },
};

const WOMPI_API = process.env.WOMPI_API_URL || 'https://sandbox.wompi.co/v1';

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

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

router.post('/webhook', (req, res) => {
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
      const users = readUsers();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        const now = new Date();
        const vencimiento = new Date(now);
        vencimiento.setDate(vencimiento.getDate() + 30);

        users[userIndex].planId = planId;
        users[userIndex].plan = PLANS[planId]?.name || planId;
        users[userIndex].estado = 'activo';
        users[userIndex].fechaVencimiento = vencimiento.toISOString().split('T')[0];
        users[userIndex].active = true;
        writeUsers(users);
      }
    }
  }

  res.status(200).json({ received: true });
});

router.get('/status', requireAuth, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  let diasRestantes = 0;
  if (user.fechaVencimiento) {
    const hoy = new Date();
    const venc = new Date(user.fechaVencimiento + 'T23:59:59');
    diasRestantes = Math.max(0, Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24)));
  }

  res.json({
    plan: user.plan || null,
    planId: user.planId || null,
    estado: user.estado || (user.plan ? 'activo' : 'inactivo'),
    fechaVencimiento: user.fechaVencimiento || null,
    diasRestantes,
  });
});

module.exports = router;
