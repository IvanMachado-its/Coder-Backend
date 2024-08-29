import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Crear una nueva orden
export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const user = req.user;

    // Verificar que todos los productos están en la base de datos
    const validProducts = await Product.find({ '_id': { $in: products } });

    if (validProducts.length !== products.length) {
      return res.status(400).json({ error: 'Algunos productos no existen' });
    }

    // Calcular el monto total
    const totalAmount = validProducts.reduce((total, product) => total + product.price, 0);

    // Crear una nueva orden
    const newOrder = new Order({
      products,
      totalAmount,
      user: user._id
    });

    await newOrder.save();
    res.status(201).json({ message: 'Orden creada con éxito', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

// Obtener las órdenes del usuario
export const getUserOrders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await Order.find({ user: user._id }).populate('products');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

// Obtener todas las órdenes (para administración)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todas las órdenes' });
  }
};
