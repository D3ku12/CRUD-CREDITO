require('dotenv').config();

const express = require('express');
const cors = require('cors');

const contactRoutes = require('./routes/contact');
const tenantsRoutes = require('./routes/tenants');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/tenants', tenantsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
