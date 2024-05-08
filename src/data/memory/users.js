// users.js

const express = require('express');
const UserManager = require('./UserManager'); // Importar la clase UserManager

const router = express.Router();
const userManager = new UserManager();

router.get('/', (req, res) => {
  try {
    const users = userManager.getUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:uid', (req, res) => {
  try {
    const userId = parseInt(req.params.uid);
    const user = userManager.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = userManager.addUser(name, email, age);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:uid', (req, res) => {
  try {
    const userId = parseInt(req.params.uid);
    const { name, email, age } = req.body;
    const updatedUser = userManager.updateUser(userId, name, email, age);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:uid', (req, res) => {
  try {
    const userId = parseInt(req.params.uid);
    const deletedUser = userManager.deleteUser(userId);
    if (deletedUser) {
      res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
