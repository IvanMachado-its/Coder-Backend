// src/services/userService.js

const User = require('../models/User');

async function create(userData) {
  const newUser = new User(userData);
  return await newUser.save();
}

async function read() {
  return await User.find();
}

async function readOne(userId) {
  return await User.findById(userId);
}

async function readOneByEmail(email) {
  return await User.findOne({ email }); // Buscar por email
}

async function update(userId, userData) {
  return await User.findByIdAndUpdate(userId, userData, { new: true });
}

async function destroy(userId) {
  return await User.findByIdAndDelete(userId);
}

module.exports = {
  create,
  read,
  readOne,
  readOneByEmail, // Exportar el nuevo método
  update,
  destroy
};
