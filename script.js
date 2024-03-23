const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some(product => product.code === code)) {
      console.error("Ya existe un producto con el mismo código.");
      return;
    }

    const id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    this.saveProducts();
    console.log("Producto agregado correctamente:", newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (!product) {
      console.error("Producto no encontrado.");
      return;
    }

    return product;
  }
}

 
const productManager = new ProductManager('products.json');


rl.question('Ingrese el título del producto: ', (title) => {
  rl.question('Ingrese la descripción del producto: ', (description) => {
    rl.question('Ingrese el precio del producto: ', (price) => {
      rl.question('Ingrese la ruta de la imagen (thumbnail): ', (thumbnail) => {
        rl.question('Ingrese el código del producto: ', (code) => {
          rl.question('Ingrese el stock del producto: ', (stock) => {

            productManager.addProduct(title, description, parseFloat(price), thumbnail, code, parseInt(stock));


            console.log("Productos después de agregar uno:", productManager.getProducts());


            rl.close();
          });
        });
      });
    });
  });
});

rl.on('close', () => {
  console.log('Fin del programa.');
  process.exit(0);
});
