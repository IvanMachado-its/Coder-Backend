// src/controllers/adminController.js

const User = require('../models/User');
const Ticket = require('../models/Ticket');

// Obtener estadísticas del sistema
exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const ticketCount = await Ticket.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });

    const stats = {
      userCount,
      ticketCount,
      adminCount
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

// Obtener lista de usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.remove();
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

// Obtener lista de tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ message: 'Error al obtener tickets' });
  }
};

// Eliminar ticket
exports.deleteTicket = async (req, res) => {
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    await ticket.remove();
    res.status(200).json({ message: 'Ticket eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar ticket con ID ${ticketId}:`, error);
    res.status(500).json({ message: 'Error al eliminar ticket' });
  }
};

// Controlador del dashboard del administrador
exports.dashboard = async (req, res) => {
  try {
    // Aquí puedes realizar cualquier lógica adicional necesaria para el dashboard

    res.render('admin/dashboard', { user: req.user });
  } catch (error) {
    console.error('Error al cargar el dashboard:', error);
    res.status(500).json({ message: 'Error al cargar el dashboard' });
  }
};

module.exports = exports;
