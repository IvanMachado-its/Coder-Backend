const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Product = require('./src/models/Product');
const fs = require('fs');
const multer = require('multer');

const usersRouter = require('./src/routes/usersRouter');
const productsRouter = require('./src/routes/productsRouter');
const cartsRouter = require('./src/routes/cartsRouter');

const app = express();
const server = http.createServer(app);

require('dotenv').config();

// Configuración de la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

// Configuración de la sesión
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: true,
}));

// Middleware para servir archivos estáticos desde la carpeta 'views'
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Crear el directorio 'uploads' si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Endpoint para obtener productos desde la base de datos
app.get('/api/productos', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para la vista de agregar producto
app.get('/addProducts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'addProducts.html'));
});

// Rutas existentes
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

// Rutas para el registro y el login
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
