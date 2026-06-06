const bcrypt = require('bcryptjs');
const pool = require('../src/db/connection');

(async () => {
  const hash = await bcrypt.hash('Credi2025*', 10);
  await pool.query(
    "UPDATE users SET password = $1 WHERE email = 'admin@crediconfianza.com'",
    [hash]
  );
  console.log('✅ Password reseteada a: Credi2025*');
  process.exit(0);
})();
