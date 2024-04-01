const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 8080;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/api/products', productsRouter);
    this.app.use('/api/carts', cartsRouter);
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}

const server = new Server();
server.listen();
