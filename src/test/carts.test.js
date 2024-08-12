const chai = require('chai');
const server = require('../app');
const expect = chai.expect;
const request = require('supertest')(server);
const Cart = require('../src/models/Cart');

chai.use(chaiHttp);

describe('Carts Router', () => {
  
  before(async () => {
    await Cart.deleteMany({});
  });

  it('should create a new cart', async () => {
    const res = await request.post('/carts').send({
      userId: 'someUserId',
      products: [{ productId: 'someProductId', quantity: 2 }]
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('userId', 'someUserId');
  });

  it('should get a cart by user ID', async () => {
    const res = await request.get('/carts/someUserId');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('userId', 'someUserId');
  });

  it('should update a cart', async () => {
    const cart = await Cart.findOne({ userId: 'someUserId' });
    const res = await request.put(`/carts/${cart._id}`).send({
      products: [{ productId: 'someOtherProductId', quantity: 3 }]
    });
    expect(res.status).to.equal(200);
    const updatedCart = await Cart.findById(cart._id);
    expect(updatedCart.products[0].quantity).to.equal(3);
  });

  it('should delete a cart', async () => {
    const cart = await Cart.findOne({ userId: 'someUserId' });
    const res = await request.delete(`/carts/${cart._id}`);
    expect(res.status).to.equal(200);
    const deletedCart = await Cart.findById(cart._id);
    expect(deletedCart).to.be.null;
  });
});
