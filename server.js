const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Importa el middleware de CORS
const rateLimit = require('express-rate-limit'); // Importa el middleware de límite de tasa
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD; // Utiliza la contraseña con hash
const JWT_SECRET = process.env.JWT_SECRET; // Secreto para firmar y verificar JWT
const CLIENT = process.env.CLIENT; //Client URL
const LOCAL_CLIENT = process.env.LOCAL_CLIENT; //TODO: Delete before Production!!!

// Middleware para verificar tokens JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ mensaje: 'Token no proporcionado' });
  }

  jwt.verify(token.replace("Bearer ", ""), JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: 'Token no válido' });
    }
    req.user = decoded; // Almacena el usuario decodificado en el objeto de solicitud
    next();
  });
}

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD // Utiliza la contraseña con hash
  },
});

// Configura CORS || La posicion es muy importante. Configurar el middleware de CORS antes de definir tus ruta.
//methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
app.use(cors({
    origin: [CLIENT, LOCAL_CLIENT], // Lista de dominios permitidos
    methods: 'POST',
    credentials: true // Habilita el envío de cookies y credenciales
  }));


// Configuración de límite de tasa. Configura el middleware de límite de tasa antes de definir tus rutas.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Período de tiempo (en milisegundos) para el límite de tasa (ejemplo: 15 minutos)
    max: 100, // Máximo número de solicitudes permitidas durante el período de tiempo
  });
  
  app.use(limiter); // Aplica el límite de tasa a todas las rutas después de esta línea
  

app.use(express.json());

// Ruta para enviar correos electrónicos
app.post('/enviar-correo', verifyToken, (req, res) => {
  const { destinatario, asunto, mensaje } = req.body;

  const mailOptions = {
    from: 'tu_email@gmail.com',
    to: destinatario,
    subject: asunto,
    text: mensaje,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ mensaje: 'Error al enviar el correo' });
    } else {
      console.log('Correo enviado: ' + info.response);
      res.json({ mensaje: 'Correo enviado con éxito' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
