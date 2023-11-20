const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

const password = process.env.EMAIL_PASSWORD; // Obtiene la contraseña sin procesar desde .env

// Aplica hash a la contraseña
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error al generar el hash de la contraseña:', err);
  } else {
    // Almacena la contraseña con hash en .env
    fs.writeFileSync('.env', `EMAIL_PASSWORD_HASH=${hashedPassword}`);
    console.log('Contraseña con hash almacenada en .env');
  }
});
