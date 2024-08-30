import Product from '../models/Product.js';

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        const product = new Product({
            name,
            description,
            price,
            user: req.user._id,
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el producto' });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        const { name, description, price } = req.body;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        await product.remove();
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};
