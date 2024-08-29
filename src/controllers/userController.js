import User from '../models/User.js';
import { sendEmailNotification } from '../services/emailService.js';
import moment from 'moment';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role'); // Solo datos principales
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Eliminar usuarios inactivos
export const deleteInactiveUsers = async (req, res) => {
  try {
    const twoDaysAgo = moment().subtract(2, 'days').toDate();
    const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });

    // Eliminar usuarios inactivos
    await User.deleteMany({ lastLogin: { $lt: twoDaysAgo } });

    // Enviar notificaciones por correo
    for (const user of inactiveUsers) {
      await sendEmailNotification(user.email, 'Tu cuenta ha sido eliminada por inactividad.');
    }

    res.json({ message: 'Usuarios inactivos eliminados' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Modificar el rol de un usuario
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar permisos para cambiar el rol
    if (req.user.role === 'admin') {
      user.role = role || user.role;
      await user.save();
      res.json({ message: 'Rol del usuario actualizado con éxito', user });
    } else {
      res.status(403).json({ error: 'No tienes permisos para modificar el rol' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar permisos para eliminar el usuario
    if (req.user.role === 'admin') {
      await User.deleteOne({ _id: id });

      // Enviar notificación por correo
      await sendEmailNotification(user.email, 'Tu cuenta ha sido eliminada.');

      res.json({ message: 'Usuario eliminado con éxito' });
    } else {
      res.status(403).json({ error: 'No tienes permisos para eliminar este usuario' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
