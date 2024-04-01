

class UserManager {
    constructor() {
      this.users = [];
      this.nextUserId = 1;
    }
  
    addUser(name, email, age) {
      const newUser = {
        id: this.nextUserId++,
        name,
        email,
        age
      };
      this.users.push(newUser);
      return newUser;
    }
  
 
    getUsers() {
      return this.users;
    }
  
    getUserById(userId) {
      return this.users.find(user => user.id === userId);
    }
  
    updateUser(userId, newName, newEmail, newAge) {
      const userIndex = this.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex].name = newName;
        this.users[userIndex].email = newEmail;
        this.users[userIndex].age = newAge;
        return this.users[userIndex];
      }
      return null;
    }
  
    deleteUser(userId) {
      const userIndex = this.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        const deletedUser = this.users.splice(userIndex, 1);
        return deletedUser[0];
      }
      return null;
    }
  }
  
  module.exports = UserManager;
  