const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authService.register(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await authService.login(username, password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
