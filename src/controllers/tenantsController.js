const fs = require('fs');
const path = require('path');

const TENANTS_FILE = path.resolve(__dirname, '../../data/tenants.json');

function readTenants() {
  try {
    return JSON.parse(fs.readFileSync(TENANTS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeTenants(tenants) {
  fs.writeFileSync(TENANTS_FILE, JSON.stringify(tenants, null, 2), 'utf-8');
}

exports.list = (_req, res) => {
  const tenants = readTenants();
  res.json(tenants);
};

exports.show = (req, res) => {
  const { slug } = req.params;
  const tenants = readTenants();
  const tenant = tenants.find((t) => t.slug === slug);
  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Tenant no encontrado' });
  }
  const { name, color, modality, slogan } = tenant;
  return res.status(200).json({ name, color, modality, slogan });
};

exports.create = (req, res) => {
  const { slug, name, color, modality, slogan } = req.body;
  if (!slug || !name) {
    return res.status(400).json({ error: 'slug y name son requeridos' });
  }
  const tenants = readTenants();
  if (tenants.find((t) => t.slug === slug)) {
    return res.status(409).json({ error: 'El slug ya existe' });
  }
  tenants.push({ slug, name, color: color || '#1D9E75', modality: modality || '', slogan: slogan || '' });
  writeTenants(tenants);
  res.status(201).json(tenants[tenants.length - 1]);
};

exports.update = (req, res) => {
  const { slug } = req.params;
  const tenants = readTenants();
  const index = tenants.findIndex((t) => t.slug === slug);
  if (index === -1) {
    return res.status(404).json({ error: 'Tenant no encontrado' });
  }
  tenants[index] = { ...tenants[index], ...req.body, slug };
  writeTenants(tenants);
  res.json(tenants[index]);
};

exports.remove = (req, res) => {
  const { slug } = req.params;
  const tenants = readTenants();
  const index = tenants.findIndex((t) => t.slug === slug);
  if (index === -1) {
    return res.status(404).json({ error: 'Tenant no encontrado' });
  }
  tenants.splice(index, 1);
  writeTenants(tenants);
  res.status(204).end();
};
