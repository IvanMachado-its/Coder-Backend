// app.js

const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const pathHandler = require('./middlewares/pathHandler');
const productsRouter = require('./routes/Products');
const usersRouter = require('./routes/users');

const app = express();

// Middleware para el registro de solicitudes con Morgan
app.use(morgan('combined'));

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Rutas para productos y usuarios
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);

// Middleware para manejar rutas no encontradas
app.use(pathHandler);

// Middleware para manejar errores
app.use(errorHandler);

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
