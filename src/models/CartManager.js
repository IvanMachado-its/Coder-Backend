// CartManager.js

const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error('Error loading carts:', error);
      throw new Error('Failed to load carts');
    }
  }

  async saveCarts() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving carts:', error);
      throw new Error('Failed to save carts');
    }
  }

  async addCart(cart) {
    try {
      // Validaciones adicionales
      if (!cart.id || !Array.isArray(cart.products)) {
        throw new Error('Invalid cart data');
      }
      this.carts.push(cart);
      await this.saveCarts();
    } catch (error) {
      console.error('Error adding cart:', error);
      throw new Error('Failed to add cart');
    }
  }

  async getCart(cartId) {
    try {
      const cart = this.carts.find(c => c.id === cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw new Error('Failed to get cart');
    }
  }

  async updateCart(cartId, updatedCartData) {
    try {
      const index = this.carts.findIndex(c => c.id === cartId);
      if (index === -1) {
        throw new Error('Cart not found');
      }
      const updatedCart = { ...this.carts[index], ...updatedCartData };
      this.carts[index] = updatedCart;
      await this.saveCarts();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw new Error('Failed to update cart');
    }
  }

  async deleteCart(cartId) {
    try {
      this.carts = this.carts.filter(c => c.id !== cartId);
      await this.saveCarts();
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw new Error('Failed to delete cart');
    }
  }
}

module.exports = CartManager;
