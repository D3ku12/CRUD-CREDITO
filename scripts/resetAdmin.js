const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.resolve(__dirname, '../data/users.json');
const PASSWORD = 'Credi2025*';

const hash = bcrypt.hashSync(PASSWORD, 10);

const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

const admin = users.find((u) => u.id === '1');
if (admin) {
  admin.password = hash;
}

fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

console.log('✅ Password del admin reseteada a: Credi2025*');
