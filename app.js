const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose'); // Importa Mongoose
const Product = require('./src/models/Product'); // Importa el modelo Product


const app = express();
const server = http.createServer(app);


require('dotenv').config();
// Configuración de la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexión a la base de datos establecida'))
.catch(err => console.error('Error de conexión a la base de datos:', err));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const usersRouter = require('./src/routes/usersRouter');
const productsRouter = require('./src/routes/productsRouter');
const cartsRouter = require('./src/routes/cartsRouter');

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
