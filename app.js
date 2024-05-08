const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexión a la base de datos establecida'))
.catch(err => console.error('Error de conexión a la base de datos:', err));

// Configuración del servidor
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

// Configuración de socket.io para el chat
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

// Iniciar servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor en funcionamiento en el puerto ${PORT}`));
