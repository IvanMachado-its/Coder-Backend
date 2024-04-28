const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        default: 'available'
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: String
    },
    images: {
        type: [String]
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
