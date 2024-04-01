class User {
  constructor(id, name, email, age) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
  }
}

class UserManager {
  constructor() {
    this.users = [];
  }


  getUsers() {
    return this.users;
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  addUser(name, email, age) {
    const id = this.generateId();
    const newUser = new User(id, name, email, age);
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, name, email, age) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex].name = name;
      this.users[userIndex].email = email;
      this.users[userIndex].age = age;
      return this.users[userIndex];
    } else {
      return null;
    }
  }
  deleteUser(id) {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length !== initialLength;
  }
  generateId() {
    return this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
  }
}

module.exports = UserManager;
