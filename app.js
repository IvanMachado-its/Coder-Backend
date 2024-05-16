const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose'); 
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Product = require('./src/models/Product');
const productsRouter = require('./src/routes/productsRouter'); 
const cartsRouter = require('./src/routes/cartsRouter');
const usersRouter = require('./src/routes/usersRouter'); 

const app = express();
const server = http.createServer(app);

require('dotenv').config();

// Configuración de la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('Conexión a la base de datos establecida'))
.catch(err => console.error('Error de conexión a la base de datos:', err));

// Configuración de la sesión
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
}));

// Middleware para servir archivos estáticos desde la carpeta 'views'
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use('/users', usersRouter);
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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Ruta para la vista de agregar producto
app.get('/addProducts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'addProducts.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rutas existentes
app.use('/users', usersRouter);
app.use('/products', productsRouter); 
app.use('/carts', cartsRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
