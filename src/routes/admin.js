const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Ruta para eliminar productos
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const owner = await User.findById(product.ownerId);
        if (owner && owner.role === 'premium') {
            await sendEmail(owner.email, 'Product Deleted', `Your product "${product.name}" has been deleted.`);
        }

        await Product.deleteOne({ _id: productId });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
