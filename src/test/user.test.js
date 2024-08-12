const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../src/models/User');
const expect = chai.expect;
const request = require('supertest')(server);

chai.use(chaiHttp);

describe('User Router', () => {
  
  before(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const res = await request.post('/user').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should not create a user with an existing email', async () => {
    const res = await request.post('/user').send({
      username: 'testuser2',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Email is already registered');
  });

  it('should upload documents for a user', async () => {
    const user = await User.findOne({ email: 'testuser@example.com' });
    const res = await request.post(`/user/${user._id}/documents`)
      .attach('document', 'test/files/test-document.pdf')
      .attach('document', 'test/files/test-document2.pdf');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('documents');
    expect(res.body.documents).to.be.an('array').that.has.lengthOf(2);
  });

  it('should upgrade user to premium', async () => {
    const user = await User.findOne({ email: 'testuser@example.com' });
    user.documents = [
      { name: 'Identification', reference: 'test/files/test-document.pdf' },
      { name: 'Proof of Address', reference: 'test/files/test-document.pdf' },
      { name: 'Proof of Account', reference: 'test/files/test-document.pdf' },
    ];
    await user.save();
    
    const res = await request.post(`/user/premium/${user._id}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'User upgraded to premium successfully');
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.role).to.equal('premium');
  });
});
