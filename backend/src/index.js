require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const contactRoutes = require('./routes/contact');
const tenantsRoutes = require('./routes/tenants');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/tenants', tenantsRoutes);

const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  const index = path.join(frontendDist, 'index.html');
  if (require('fs').existsSync(index)) {
    res.sendFile(index);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
