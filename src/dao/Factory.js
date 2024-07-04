const MongoDBDAO = require('./MongoDBDAO');

class DAOFactory {
  static getDAO() {
    return MongoDBDAO;
  }
}

module.exports = DAOFactory;
