const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class UserManager {
  constructor() {
    this.usersFilePath = path.join(__dirname, 'data', 'users.json');
  }

  async create(userData) {
    try {
      const users = await this.read();
      const newUser = {
        id: this.generateId(),
        ...userData
      };
      users.push(newUser);
      await this.save(users);
      return newUser;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  async read() {
    try {
      const data = await fs.readFile(this.usersFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error reading users');
    }
  }

  async readOne(userId) {
    try {
      const users = await this.read();
      return users.find(user => user.id === userId);
    } catch (error) {
      throw new Error('Error reading user');
    }
  }

  async update(userId, userData) {
    try {
      const users = await this.read();
      const index = users.findIndex(user => user.id === userId);
      if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        await this.save(users);
        return users[index];
      }
      throw new Error('User not found');
    } catch (error) {
      throw new Error('Error updating user');
    }
  }

  async destroy(userId) {
    try {
      let users = await this.read();
      users = users.filter(user => user.id !== userId);
      await this.save(users);
    } catch (error) {
      throw new Error('Error deleting user');
    }
  }

  generateId() {
    return crypto.randomBytes(6).toString('hex');
  }

  async save(users) {
    try {
      await fs.writeFile(this.usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
      throw new Error('Error saving users');
    }
  }
}

module.exports = new UserManager();

