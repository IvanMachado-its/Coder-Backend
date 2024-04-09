const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar endpoints

// Endpoint POST para crear un producto
app.post('/crearProducto', (req, res) => {
    // Lógica para crear un nuevo producto

    // Emitir evento de actualización a través de Socket.io
    io.emit('productoCreado', nuevoProducto);

    res.redirect('/realtimeproducts');
});

// Endpoint POST para eliminar un producto
app.post('/eliminarProducto/:id', (req, res) => {
    // Lógica para eliminar un producto

    // Emitir evento de actualización a través de Socket.io
    io.emit('productoEliminado', idProductoEliminado);

    res.redirect('/realtimeproducts');
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
