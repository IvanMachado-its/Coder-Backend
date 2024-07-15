const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const ticketRoutes = require('./src/routes/ticket');
const adminRoutes = require('./src/routes/admin');
const userRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/auth');
const { extractUserFromToken } = require('./src/middleware/authMiddleware');

// Carga las variables de entorno desde .env
dotenv.config({ path: './.env' });

// Conectar a MongoDB (Atlas)
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión con connect-mongodb-session
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

store.on('error', (error) => {
  console.log(error);
});

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // Duración de la sesión en milisegundos
};

app.use(session(sessionOptions));

// Middleware de extracción de usuario desde token
app.use(extractUserFromToken);

// Rutas
app.use('/tickets', ticketRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
