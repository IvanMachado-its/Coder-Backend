# Coder-Backend
# API REST para E-Commerce

¡Bienvenido al proyecto de la API REST para E-Commerce! Esta API proporciona puntos finales para gestionar productos y usuarios para una plataforma de comercio electrónico.

## Características

- Operaciones CRUD para productos y usuarios.
- Almacenamiento de datos en memoria y archivos.
- Manejo de errores con middleware errorHandler.
- Registro de solicitudes con middleware Morgan.
- Implementación de puntos finales RESTful.
- Archivo Index.html para la página de inicio.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/IvanMachado-its/Coder-Backend

2. Navega hasta el directorio del proyecto:
    cd api-e-commerce
3. Instala las dependencias:
    npm install
4. Inicia el servidor:
    npm start

##  Uso
## Puntos finales de Productos
POST /api/productos: Crea un nuevo producto.
GET /api/productos: Obtiene todos los productos.
GET /api/productos/:id: Obtiene un producto específico por su ID.
PUT /api/productos/:id: Actualiza un producto específico.
DELETE /api/productos/:id: Elimina un producto específico.

## Puntos finales de Usuarios
POST /api/usuarios: Crea un nuevo usuario.
GET /api/usuarios: Obtiene todos los usuarios.
GET /api/usuarios/:id: Obtiene un usuario específico por su ID.
PUT /api/usuarios/:id: Actualiza un usuario específico.
DELETE /api/usuarios/:id: Elimina un usuario específico.


## Estructura de Carpetas

api-e-commerce/
│
├── controllers/
│   ├── files/
│   ├── middlewares/
│   ├── models/
│   ├── node_modules/
│   └── public/
├── public/
│   └── index.html
├── routes/
└── Users/

