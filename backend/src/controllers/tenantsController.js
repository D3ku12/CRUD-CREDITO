const fs = require('fs');
const path = require('path');

const TENANTS_FILE = path.resolve(__dirname, '../../data/tenants.json');

exports.show = (req, res) => {
  const { slug } = req.params;

  let tenants = [];
  try {
    const raw = fs.readFileSync(TENANTS_FILE, 'utf-8');
    tenants = JSON.parse(raw);
  } catch {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }

  const tenant = tenants.find((t) => t.slug === slug);
  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Tenant no encontrado' });
  }

  const { name, color, modality, slogan } = tenant;
  return res.status(200).json({ name, color, modality, slogan });
};
