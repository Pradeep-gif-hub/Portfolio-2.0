const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);
console.log('');

// Generate Session Secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET=' + sessionSecret);
console.log('');

// Hash admin password
const adminPassword = 'amar';
bcrypt.hash(adminPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('ADMIN_PASSWORD_HASH=' + hash);
  console.log('');
  console.log('Copy these values to your .env.local file!');
});
