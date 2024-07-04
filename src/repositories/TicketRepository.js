const DAOFactory = require('../dao/Factory');

class TicketRepository {
  constructor() {
    this.dao = DAOFactory.getDAO();
  }

  async createTicket(ticketData) {
    return this.dao.createTicket(ticketData);
  }
}

module.exports = new TicketRepository();
