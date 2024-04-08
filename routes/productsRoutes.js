// productsRoutes.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.post('/', productsController.createProduct);
router.get('/', productsController.getAllProducts);
router.get('/:pid', productsController.getProductById);
router.put('/:pid', productsController.updateProduct);
router.delete('/:pid', productsController.deleteProduct);

module.exports = router;
