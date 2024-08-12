const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); // Importing multer configuration
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadDocuments,
  upgradeToPremium,
} = require('../controllers/userController'); 

// Route to get all users
router.get('/', getAllUsers);

// Route to get a user by ID
router.get('/:id', getUserById);

// Route to create a new user
router.post('/', createUser);

// Route to update an existing user
router.put('/:id', updateUser);

// Route to delete a user
router.delete('/:id', deleteUser);

// Route to upload user documents
router.post('/:uid/documents', upload.array('documents'), uploadDocuments);

// Route to upgrade user to premium
router.post('/premium/:uid', upgradeToPremium);

module.exports = router;
