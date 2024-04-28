// app.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('./dao/db'); // Importar la conexión a MongoDB

// Importar modelos de MongoDB
const Product = require('./dao/models/Product');
const Message = require('./dao/models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let productos = [];

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
    res.render('home', { products: productos });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productos });
});

// Endpoint POST para crear un producto
app.post('/crearProducto', (req, res) => {
    const { title, price } = req.body;

    // Crear el nuevo producto en MongoDB
    Product.create({ title, price })
        .then(nuevoProducto => {
            io.emit('productoCreado', nuevoProducto);
            res.redirect('/realtimeproducts');
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Endpoint POST para eliminar un producto
app.post('/eliminarProducto/:id', (req, res) => {
    const idProducto = req.params.id;

    Product.findByIdAndDelete(idProducto)
        .then(() => {
            io.emit('productoEliminado', idProducto);
            res.redirect('/realtimeproducts');
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Configurar conexión a MongoDB
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));

// Configurar socket.io para el chat
io.on('connection', socket => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    socket.on('chat message', msg => {
        // Guardar mensaje en MongoDB
        Message.create(msg)
            .then(() => {
                io.emit('chat message', msg);
            })
            .catch(error => {
                console.error(error);
            });
    });
});
