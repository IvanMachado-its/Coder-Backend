const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude the password field
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(`Error fetching user with ID ${userId}:`, err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(`Error updating user with ID ${userId}:`, err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(`Error deleting user with ID ${userId}:`, err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Upload documents for a user
exports.uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const documents = req.files.map(file => ({
      name: file.fieldname,
      reference: file.path,
    }));

    user.documents.push(...documents);
    await user.save();

    res.status(200).json({ message: 'Documents uploaded successfully', documents: user.documents });
  } catch (err) {
    console.error('Error uploading documents:', err);
    res.status(500).json({ message: 'Error uploading documents' });
  }
};

// Upgrade user to premium
exports.upgradeToPremium = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requiredDocs = ['Identification', 'Proof of Address', 'Proof of Account'];
    const uploadedDocs = user.documents.map(doc => doc.name);

    const hasRequiredDocs = requiredDocs.every(doc => uploadedDocs.includes(doc));

    if (!hasRequiredDocs) {
      return res.status(400).json({ message: 'Required documents not uploaded' });
    }

    user.role = 'premium';
    await user.save();

    res.status(200).json({ message: 'User upgraded to premium successfully' });
  } catch (err) {
    console.error('Error upgrading to premium:', err);
    res.status(500).json({ message: 'Error upgrading to premium' });
  }
};
