const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path'); 

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

    // Crear el nuevo producto
    const nuevoProducto = {
        id: productos.length + 1,
        title: title,
        price: price
    };

    productos.push(nuevoProducto);

    io.emit('productoCreado', nuevoProducto);

    res.redirect('/realtimeproducts');
});

// Endpoint POST para eliminar un producto
app.post('/eliminarProducto/:id', (req, res) => {
    const idProducto = req.params.id;


    productos = productos.filter(producto => producto.id !== parseInt(idProducto));

    io.emit('productoEliminado', idProducto);

    res.redirect('/realtimeproducts');
});

// Puerto
const PORT = process.env.PORT || 8080; 
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
