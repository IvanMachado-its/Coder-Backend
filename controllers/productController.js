import Product from '../models/Product.js';

// Controlador genérico para renderizar productos en cualquier vista
export const renderProducts = async (req, res, next, viewName, title, productId = null) => {
    try {
        if (productId) {
            const product = await Product.findById(productId).lean();
            if (!product) return res.status(404).render('error', { message: 'Producto no encontrado' });

            return res.render(viewName, { title: product.name, user: req.user || null, product });
        } else {
            const products = await Product.find().lean();
            res.render(viewName, { title, user: req.user || null, products });
        }
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).render('error', { message: 'Debe estar autenticado para crear un producto' });
        }

        console.log('Usuario autenticado:', req.user);  // Depuración
        const { name, description, price } = req.body;

        // Validación básica
        if (!name || !description || !price) {
            return res.status(400).render('error', { message: 'Todos los campos son obligatorios' });
        }

        // Crear el producto asignando el usuario correctamente
        const product = new Product({ name, description, price, user: req.user._id });
        await product.save();
        res.status(201).redirect('/dashboard');
    } catch (err) {
        console.error('Error en createProduct:', err);  // Depuración detallada
        res.status(500).render('error', { message: 'Error al crear el producto' });
    }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).render('error', { message: 'Debe estar autenticado para actualizar un producto' });
        }

        const { name, description, price } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).render('error', { message: 'Producto no encontrado' });

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).render('error', { message: 'Error al actualizar el producto' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).render('error', { message: 'Debe estar autenticado para eliminar un producto' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        // Utilizar findByIdAndDelete para eliminar el producto de manera segura
        await Product.findByIdAndDelete(req.params.id);

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).render('error', { message: 'Error al eliminar el producto' });
    }
};
