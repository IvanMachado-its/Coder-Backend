const { v4: uuidv4 } = require('uuid');

class UserManager {
  constructor(memory) {
    this.memory = memory;
  }

  create(data) {
    const id = uuidv4();
    const user = { id, ...data };
    this.memory.push(user);
    return user;
  }

  read() {
    return this.memory;
  }

  readOne(id) {
    return this.memory.find(user => user.id === id);
  }

  update(id, data) {
    const index = this.memory.findIndex(user => user.id === id);
    if (index !== -1) {
      this.memory[index] = { ...this.memory[index], ...data };
      return this.memory[index];
    }
    return null;
  }

  destroy(id) {
    const index = this.memory.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = this.memory.splice(index, 1);
      return deletedUser[0];
    }
    return null;
  }
}

module.exports = UserManager;
