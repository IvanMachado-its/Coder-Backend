import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import crypto from 'crypto';
import MongoStore from 'connect-mongo';
import { create } from 'express-handlebars';  // Usa la función `create`

const app = express();

// Conectar a la base de datos
connectDB();

// Generar un secreto de sesión aleatorio
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log(`Generated Session Secret: ${sessionSecret}`);

// Configurar express-handlebars como motor de vistas
const hbs = create({ extname: '.handlebars' });  // Configura express-handlebars
app.engine('handlebars', hbs.engine);  // Usa la función `engine` desde el objeto `hbs`
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware de sesiones con MongoDB
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
    },
}));

// Middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index');
});

app.use(express.static('public'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

// Puerto y arranque del servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));