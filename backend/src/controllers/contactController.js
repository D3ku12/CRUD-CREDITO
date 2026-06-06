const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.resolve(__dirname, '../../data/leads.json');

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

function saveLead(lead) {
  const colombiaDate = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  const record = { ...lead, timestamp: colombiaDate };

  let leads = [];
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    leads = JSON.parse(raw);
  } catch {
    leads = [];
  }
  leads.push(record);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return record;
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
      <p><b>Fecha:</b> ${lead.timestamp}</p>
    `,
  });
}

exports.create = async (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const lead = {
    businessName: req.body.businessName,
    ownerName: req.body.ownerName,
    whatsapp: req.body.whatsapp,
    modality: req.body.modality,
  };

  const saved = saveLead(lead);

  try {
    await sendEmail(saved);
  } catch {
    // Email failure should not block the response
  }

  return res.status(200).json({ success: true, message: 'Recibido' });
};
