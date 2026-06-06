const nodemailer = require('nodemailer');
const pool = require('../db/connection');
const validator = require('validator');

const clean = (str) => validator.escape(String(str || '').trim().substring(0, 200));

const VALID_MODALITIES = ['diario', 'semanal', 'mensual', 'varios'];

function validate(body) {
  const errors = [];
  if (!body.businessName || typeof body.businessName !== 'string') {
    errors.push('businessName es requerido');
  }
  if (!body.ownerName || typeof body.ownerName !== 'string') {
    errors.push('ownerName es requerido');
  }
  if (!body.whatsapp || typeof body.whatsapp !== 'string') {
    errors.push('whatsapp es requerido');
  } else if (!/^\+57\d{10}$/.test(body.whatsapp)) {
    errors.push('whatsapp debe empezar con +57 y tener 10 dígitos después');
  }
  if (!body.modality || !VALID_MODALITIES.includes(body.modality)) {
    errors.push('modality debe ser uno de: diario, semanal, mensual, varios');
  }
  return errors;
}

async function saveLead(lead) {
  await pool.query(
    'INSERT INTO leads (business_name, owner_name, whatsapp, modality) VALUES ($1, $2, $3, $4)',
    [lead.businessName, lead.ownerName, lead.whatsapp, lead.modality]
  );
  return lead;
}

async function sendEmail(lead) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: 'Nuevo lead recibido',
    html: `
      <h2>Nuevo lead de contacto</h2>
      <p><b>Negocio:</b> ${lead.businessName}</p>
      <p><b>Propietario:</b> ${lead.ownerName}</p>
      <p><b>WhatsApp:</b> ${lead.whatsapp}</p>
      <p><b>Modalidad:</b> ${lead.modality}</p>
    `,
  });
}

exports.create = async (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const lead = {
    businessName: clean(req.body.businessName),
    ownerName: clean(req.body.ownerName),
    whatsapp: clean(req.body.whatsapp),
    modality: clean(req.body.modality),
  };

  try {
    await saveLead(lead);
  } catch (err) {
    console.error('[DB] Error al guardar lead:', err.message);
    return res.status(500).json({ success: false, error: 'Error interno' });
  }

  try {
    await sendEmail(lead);
  } catch {
    // Email failure should not block the response
  }

  return res.status(200).json({ success: true, message: 'Recibido' });
};
