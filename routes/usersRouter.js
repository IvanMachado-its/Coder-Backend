const express = require('express');
const router = express.Router();
const userService = require('./userService');

// Middleware para validar propiedades obligatorias
const validarPropiedadesUsuario = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'El correo electrónico y la contraseña son obligatorios' });
  }
  next();
};

// Endpoint POST para crear un usuario
router.post('/', validarPropiedadesUsuario, async (req, res) => {
  try {
    const nuevoUsuario = await userService.create(req.body);
    res.status(201).json({ id: nuevoUsuario.id, mensaje: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint GET para recuperar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await userService.read();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint GET para recuperar un usuario por ID
router.get('/:idUsuario', async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const usuario = await userService.readOne(idUsuario);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint PUT para actualizar un usuario por ID
router.put('/:idUsuario', validarPropiedadesUsuario, async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const usuarioActualizado = await userService.update(idUsuario, req.body);
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint DELETE para eliminar un usuario por ID
router.delete('/:idUsuario', async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    await userService.destroy(idUsuario);
    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
