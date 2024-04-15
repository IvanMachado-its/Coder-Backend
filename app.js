const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path'); // Agregamos la línea para importar el módulo 'path'

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Array para almacenar los productos
let productos = [];

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Usamos 'path.join' para obtener la ruta absoluta de las vistas
app.use(express.static(path.join(__dirname, 'public'))); // Usamos 'path.join' para obtener la ruta absoluta de los archivos estáticos

// Endpoint GET para la vista home
app.get('/', (req, res) => {
    res.render('home', { products: productos });
});

// Endpoint GET para la vista realTimeProducts
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productos });
});

// Endpoint POST para crear un producto
app.post('/crearProducto', (req, res) => {
    const { title, price } = req.body;

    // Crear el nuevo producto
    const nuevoProducto = {
        id: productos.length + 1,
        title: title,
        price: price
    };

    // Agregar el nuevo producto al array
    productos.push(nuevoProducto);

    // Emitir evento de producto creado a través de Socket.io
    io.emit('productoCreado', nuevoProducto);

    res.redirect('/realtimeproducts');
});

// Endpoint POST para eliminar un producto
app.post('/eliminarProducto/:id', (req, res) => {
    const idProducto = req.params.id;

    // Eliminar el producto del array
    productos = productos.filter(producto => producto.id !== parseInt(idProducto));

    // Emitir evento de producto eliminado a través de Socket.io
    io.emit('productoEliminado', idProducto);

    res.redirect('/realtimeproducts');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
