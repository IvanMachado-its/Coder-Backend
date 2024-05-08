// UserManager.js

class UserManager {
    constructor() {
      this.users = [];
    }
  
    getUsers() {
      return this.users;
    }
  
    getUserById(userId) {
      return this.users.find(user => user.id === userId);
    }
  
    addUser(name, email, age) {
      const newUser = { id: this.users.length + 1, name, email, age };
      this.users.push(newUser);
      return newUser;
    }
  
    updateUser(userId, name, email, age) {
      const index = this.users.findIndex(user => user.id === userId);
      if (index !== -1) {
        this.users[index] = { id: userId, name, email, age };
        return this.users[index];
      }
      return null;
    }
  
    deleteUser(userId) {
      const index = this.users.findIndex(user => user.id === userId);
      if (index !== -1) {
        const deletedUser = this.users.splice(index, 1)[0];
        return deletedUser;
      }
      return null;
    }
  }
  
  module.exports = UserManager;
  