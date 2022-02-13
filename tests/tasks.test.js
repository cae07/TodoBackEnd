const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

const server = require('../index');

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /tasks', () => {
  before(async () => {
    const connection = await getConnection();
    sinon.stub(MongoClient, 'connect')
      .resolves(connection);
  });
  
  after(async () => {
    await MongoClient.connect.restore();
  });
  describe('6- Caso de sucesso', () => {
    let response = {};
    before(async () => {
      await chai.request(server)
      .post('/createUser')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });

      const { body } = await chai.request(server)
      .post('/login')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });

      response = await chai.request(server)
      .get('/tasks')
      .set({ "Authorization": `${body.token}` });
    });

    it('Retorna um objeto', () => {
      expect(response.body).to.be.a('array');
    });

    it('Retorna status 200', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(200);
    });
  });

  describe('6- Caso token não informado', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
      .get('/tasks');
    });
    it('Retorna status 401', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(401);
    });

    it('Retorna a mensagem "jwt mal formed."', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('jwt mal formed.');
    });
  });
});
