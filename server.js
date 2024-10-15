import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import MongoStore from 'connect-mongo';
import { create } from 'express-handlebars';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import { isAuthenticated, isAdmin } from './middlewares/authMiddleware.js';
import { getUsers, updateUserRole, deleteUser, deleteInactiveUsers, } from './controllers/userController.js';
import { registerUser, loginUser, logoutUser } from './controllers/authController.js';
import { renderProducts, deleteProduct, updateProduct } from './controllers/productController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import upload from './middlewares/upload.js'; 
import fs from 'fs';



dotenv.config(); // Cargar variables de entorno desde .env

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para manejar cookies
app.use(cookieParser());

// Configuración de sesiones con MongoDB y cookies
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 15 * 60,  // 15 minutos
        autoRemove: 'native',
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 15 * 60 * 1000,  // 15 minutos
        sameSite: 'strict',
    },
}));


const hbs = create({
    extname: '.handlebars',
    partialsDir: './views/partials',
    helpers: {
        // Helper existente para comparar valores
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        // Nuevo helper para multiplicar valores
        multiply: function(a, b) {
            return a * b;
        }
    },
    
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware para soportar PUT y DELETE en formularios HTML
app.use(methodOverride('_method'));

// Rutas Estáticas
app.use(express.static('public'));

// Middleware global para establecer `res.locals.user`
app.use(async (req, res, next) => {
    if (req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                res.locals.user = user;
            }
        } catch (err) {
            console.error('Error al verificar el token:', err);
            res.clearCookie('token');
        }
    }
    next();
});


app.post('/create-checkout-session', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
          {
            price: 'pr_1234567890abcdef',
            quantity: 1,
          },
        ],
        mode: 'payment',
        return_url: `${YOUR_DOMAIN}/return.html?session_id={CHECKOUT_SESSION_ID}`,
      });
  
      res.send({ clientSecret: session.client_secret });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send({ error: "Failed to create checkout session" });
    }
  });
  
  // Ruta para mostrar el detalle de un producto
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    await renderProducts(req, res, null, 'product-detail', 'Detalles del Producto', productId);
});
// Ruta para manejar las búsquedas
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json([]);

        // Búsqueda simple en el nombre y descripción del producto
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).select('name _id').limit(10).lean();

        res.json(products);
    } catch (err) {
        console.error('Error en la búsqueda:', err);
        res.status(500).json([]);
    }
});



// Definición de las rutas para las vistas
app.get('/', (req, res, next) => renderProducts(req, res, next, 'index', 'Tienda Online'));
app.get('/products', (req, res, next) => renderProducts(req, res, next, 'products', 'Productos'));
app.get('/checkout', isAuthenticated, (req, res) => res.render('checkout', { title: 'Checkout' }));
app.get('/login', (req, res) => res.render('login', { title: 'Iniciar Sesión' }));
app.get('/register', (req, res) => res.render('register', { title: 'Registro' }));
app.get('/logout', logoutUser);

app.use('/products', productRoutes);

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
// Rutas de Gestión de Carrito
app.get('/checkout/success', (req, res) => res.render('success', { title: 'Pago Completado' }));
app.get('/checkout/cancel', (req, res) => res.render('cancel', { title: 'Pago Cancelado' }));


// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/cart', cartRoutes);


// Puerto y arranque del servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
