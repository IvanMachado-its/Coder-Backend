// Importación de módulos necesarios
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ticketRoutes = require('./src/routes/ticket');
const adminRoutes = require('./src/routes/admin');
const userRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/auth');
const { extractUserFromToken } = require('./src/middleware/authMiddleware');

// Carga las variables de entorno desde el archivo .env
dotenv.config({ path: './.env' });

// URI de conexión de MongoDB y opciones de cliente
const uri = "mongodb+srv://ivanbolso338:XDMkEKC4gUnnCUIY@cluster0.roeqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Crear un cliente de MongoDB con opciones de versión de API estable
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Función para conectar a MongoDB, confirmar la conexión con un ping y consultar la colección
async function connectMongoDB() {
  try {
    // Conectar el cliente al servidor
    await client.connect();
    
    // Enviar un ping para confirmar una conexión exitosa
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Operaciones específicas en la base de datos "Prueba" y la colección "prueba"
    const database = client.db("Prueba"); // Nombre de la base de datos
    const collection = database.collection("prueba"); // Nombre de la colección

    // Realizar una operación sencilla, como encontrar todos los documentos en la colección
    const documents = await collection.find().toArray();
    console.log("Documents in collection 'prueba':", documents);
    
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  } finally {
    // Asegurarse de cerrar el cliente cuando se termine o haya un error
    await client.close();
  }
}

// Llamar a la función para conectar a MongoDB
connectMongoDB().catch(console.dir);

// Crear la aplicación Express
const app = express();

// Middleware para el procesamiento de datos en formato JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para el procesamiento de cookies
app.use(cookieParser());

// Configuración de la carpeta pública para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión con connect-mongodb-session
const store = new MongoDBStore({
  uri: uri, // Usando la misma URI para la sesión
  collection: 'sessions'
});

// Manejo de errores en la sesión
store.on('error', (error) => {
  console.log(error);
});

// Opciones de configuración de la sesión
const sessionOptions = {
  secret: 'e5d99667d6ff71b0476599e52a71a48a973eb0abf97279bc279081e57d0a314bb2bf47204ce2d5abc80168ac031c0be8c2847dd3433a4853314c2694760093b6',  // Secreto de sesión generado
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 día de duración para las cookies
};

// Middleware de sesión
app.use(session(sessionOptions));

// Middleware para extraer el usuario del token
app.use(extractUserFromToken);

// Rutas principales de la aplicación
app.use('/tickets', ticketRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
