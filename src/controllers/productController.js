import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendEmailNotification } from '../services/emailService.js';

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const user = req.user;

    // Verificar que el usuario tenga permisos para crear productos
    if (user.role === 'admin' || user.role === 'premium') {
      const newProduct = new Product({
        name,
        price,
        description,
        user: user._id
      });

      await newProduct.save();
      res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
    } else {
      res.status(403).json({ error: 'No tienes permisos para crear productos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Modificar un producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const user = req.user;

    // Verificar que el producto existe
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar permisos
    if (user.role === 'admin' || (user.role === 'premium' && user._id.equals(product.user))) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;

      await product.save();
      res.json({ message: 'Producto actualizado con éxito', product });
    } else {
      res.status(403).json({ error: 'No tienes permisos para modificar este producto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const product = await Product.findById(id).populate('user');

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar permisos
    if (user.role === 'admin' || (user.role === 'premium' && user._id.equals(product.user._id))) {
      await product.remove();

      // Enviar correo si el producto pertenece a un usuario premium
      if (product.user.role === 'premium') {
        await sendEmailNotification(product.user.email, `Tu producto ${product.name} ha sido eliminado.`);
      }

      res.json({ message: 'Producto eliminado con éxito' });
    } else {
      res.status(403).json({ error: 'No tienes permisos para eliminar este producto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('user');

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};
