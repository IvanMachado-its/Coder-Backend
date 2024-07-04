const DAOFactory = require('../dao/Factory');
const UserDTO = require('../dtos/UserDTO');

class UserRepository {
  constructor() {
    this.dao = DAOFactory.getDAO();
  }

  async createUser(userData) {
    const user = await this.dao.createUser(userData);
    return new UserDTO(user);
  }

  async findUserByEmail(email) {
    const user = await this.dao.findUserByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async findUserById(userId) {
    const user = await this.dao.findUserById(userId);
    return user ? new UserDTO(user) : null;
  }
}

module.exports = new UserRepository();
