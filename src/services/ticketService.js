const Ticket = require('../models/Ticket');

exports.createTicket = async (userId, products, totalPrice) => {
  const ticket = new Ticket({
    purchaser: userId,
    products,
    amount: totalPrice,
    purchase_datetime: new Date()
  });
  await ticket.save();
  return ticket;
};
