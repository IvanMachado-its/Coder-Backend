const chai = require('chai');
const server = require('../app');
const expect = chai.expect;
const request = require('supertest')(server);
const Product = require('../src/models/Product');

chai.use(chaiHttp);

describe('Products Router', () => {
  
  before(async () => {
    await Product.deleteMany({});
  });

  it('should create a new product', async () => {
    const res = await request.post('/products').send({
      name: 'Test Product',
      description: 'This is a test product',
      price: 100
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('name', 'Test Product');
  });

  it('should get all products', async () => {
    const res = await request.get('/products');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update a product', async () => {
    const product = await Product.findOne({ name: 'Test Product' });
    const res = await request.put(`/products/${product._id}`).send({
      name: 'Updated Product'
    });
    expect(res.status).to.equal(200);
    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.name).to.equal('Updated Product');
  });

  it('should delete a product', async () => {
    const product = await Product.findOne({ name: 'Updated Product' });
    const res = await request.delete(`/products/${product._id}`);
    expect(res.status).to.equal(200);
    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).to.be.null;
  });
});
