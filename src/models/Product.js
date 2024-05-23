const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: { type: [String], default: [] },
  availability: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
