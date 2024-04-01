// controllers/userController.js
const UserManager = require('../models/Users/users');

const userManager = new UserManager();


exports.getAllUsers = (req, res) => {
  const users = userManager.getUsers();
  res.json(users);
};


exports.getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = userManager.getUserById(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};


exports.addUser = (req, res) => {
  const { name, email, age } = req.body;
  const newUser = userManager.addUser(name, email, age);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, age } = req.body;
  const updatedUser = userManager.updateUser(userId, name, email, age);
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

exports.deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const deletedUser = userManager.deleteUser(userId);
  if (deletedUser) {
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};
