const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Asume que tienes una función para enviar correos
const moment = require('moment');



// Ruta para obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
      const users = await User.find({}, 'name email role'); // Selecciona solo los campos necesarios
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Ruta para eliminar usuarios inactivos
router.delete('/users/inactive', async (req, res) => {
    const twoDaysAgo = moment().subtract(2, 'days');
    try {
        const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });

        for (const user of inactiveUsers) {
            await User.deleteOne({ _id: user._id });
            await sendEmail(user.email, 'Account Deleted', 'Your account has been deleted due to inactivity.');
        }

        res.status(200).json({ message: 'Inactive users deleted and notified by email.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
