// src/models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    quantity: Number,
    processed: { type: Boolean, default: false }
  }]
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
