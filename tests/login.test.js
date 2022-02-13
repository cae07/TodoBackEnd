const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

const server = require('../index');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  describe('Quando o usuário existe', () => {
    let response = {};

    before(async () => {
      const connection = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connection);

      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'test@gmail.com',
          password: '123456',
        });
    });

    after(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    it('Retorna um token', () => {
      expect(response).to.be.a('object');
    });

    it('Retorna status 200', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(200);
    });
  });
});
