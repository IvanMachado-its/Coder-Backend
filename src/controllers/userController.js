// src/controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Excluir el campo password
    res.status(200).json(users);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por su ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(`Error al obtener usuario con ID ${userId}:`, err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  // Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Verificar si ya existe un usuario con el mismo email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generar un token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expira en 1 hora
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Actualizar un usuario existente
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los campos modificables
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(`Error al actualizar usuario con ID ${userId}:`, err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.remove();

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(`Error al eliminar usuario con ID ${userId}:`, err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
