const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const authMiddleware = require('../../middleware/authMiddleware');

router.use(authMiddleware.extractUserFromToken);

router.get('/', cartController.viewCart);
router.post('/add', cartController.addToCart);
router.post('/remove/:productId', cartController.removeFromCart);
router.post('/checkout', cartController.checkout);

module.exports = router;
