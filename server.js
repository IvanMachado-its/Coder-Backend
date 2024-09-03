import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import MongoStore from 'connect-mongo';
import { create } from 'express-handlebars';
import dotenv from 'dotenv';
import methodOverride from 'method-override';

// Cargar variables de entorno desde .env
dotenv.config();

// Verificar que las variables de entorno críticas estén configuradas
const requiredEnvVars = ['MONGO_URI', 'SESSION_SECRET', 'JWT_SECRET', 'PORT'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`La variable de entorno ${varName} no está configurada.`);
    }
});

// Importa los middlewares de autenticación
import { isAuthenticated, isAdmin } from './middlewares/authMiddleware.js';
import { getUsers, updateUserRole, deleteUser, deleteInactiveUsers } from './controllers/userController.js';
import { renderProducts, deleteProduct, updateProduct } from './controllers/productController.js';  
import { getCart, addToCart, removeFromCart, checkout } from './controllers/cartController.js';

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de sesiones
const sessionSecret = process.env.SESSION_SECRET;

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 día
    },
}));

// Configurar express-handlebars como motor de vistas
const hbs = create({
    extname: '.handlebars',
    partialsDir: './views/partials',
    helpers: {
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para soportar PUT y DELETE en formularios HTML
app.use(methodOverride('_method'));

// Rutas Estáticas
app.use(express.static('public'));

// Definición de las rutas para las vistas
app.get('/', (req, res, next) => renderProducts(req, res, next, 'index', 'Tienda Online'));

app.get('/products', (req, res, next) => renderProducts(req, res, next, 'products', 'Productos'));
app.get('/login', (req, res) => res.render('login', { title: 'Iniciar Sesión' }));
app.get('/register', (req, res) => res.render('register', { title: 'Registro' }));

// Integrar las rutas del dashboard
app.use('/dashboard', isAuthenticated, dashboardRoutes);
app.use('/products', productRoutes);

app.post('/products/:id/delete', isAuthenticated, isAdmin, deleteProduct);
app.post('/products/:id/update', isAuthenticated, isAdmin, updateProduct); 

// Rutas de Gestión de Usuarios
app.get('/users', isAuthenticated, isAdmin, getUsers); 
app.post('/users/:id/role', isAuthenticated, isAdmin, updateUserRole); 
app.post('/users/delete-inactive', isAuthenticated, isAdmin, deleteInactiveUsers); 
app.post('/users/:id/delete', isAuthenticated, isAdmin, deleteUser); 

// Rutas de carrito
app.get('/', isAuthenticated, getCart);
app.post('/add', isAuthenticated, addToCart);
app.post('/remove/:productId', isAuthenticated, removeFromCart);
app.post('/checkout', isAuthenticated, checkout);

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Puerto y arranque del servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
