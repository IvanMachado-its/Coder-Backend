const UserManager = require('../models/UserManager');
const { usersMemory } = require('../../memory');

const userManager = new UserManager(usersMemory);

exports.createUser = (req, res) => {
  try {
    const newUser = userManager.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllUsers = (req, res) => {
  try {
    const users = userManager.read();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserById = (req, res) => {
  try {
    const userId = req.params.id;
    const user = userManager.readOne(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUser = (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = userManager.update(userId, req.body);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(updatedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = userManager.destroy(userId);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(deletedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
