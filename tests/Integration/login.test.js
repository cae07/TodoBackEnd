const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('../connectionMock');

const server = require('../../index');

chai.use(chaiHttp);

const { expect } = chai;


describe('POST /login', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
  });
  
  after(async () => {
    await connectionMock.db('TodoList').collection('users').drop();
    await MongoClient.connect.restore();
  });

  describe('1- Casos de sucesso', () => {
    let response = {};
    before(async () => {
      await chai.request(server)
      .post('/createUser')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });

      response = await chai.request(server)
      .post('/login')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });
    });

    it('Retorna um token', () => {
      expect(response.body).to.have.property('token');
    });

    it('Retorna status 200', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(200);
    });
  });

  describe('2- Casos de falha', () => {    
    let response = {};

    it('Quando não existir email', async () =>{
      response = await chai.request(server)
      .post('/login')
      .send({
        password: '123456',
      });
      expect(response).to.have.property('status');
      expect(response).to.have.status(400);
      expect(response.text).to.equal('{"message":"\\"email\\" is required"}');
    });

    it('Quando não existir password', async () =>{
      response = await chai.request(server)
      .post('/login')
      .send({
        email: 'test@email.com',
      });
      expect(response).to.have.property('status');
      expect(response).to.have.status(400);
      expect(response.text).to.equal('{"message":"\\"password\\" is required"}');
    });

    it('Quando email incorreto', async () =>{
      response = await chai.request(server)
      .post('/login')
      .send({
        email: 'test@',
        password: '123456',
      });
      expect(response).to.have.property('status');
      expect(response).to.have.status(400);
      expect(response.body.message).to.equal('"email" must be a valid email');
    });

    it('Quando password incorreto', async () =>{
      response = await chai.request(server)
      .post('/login')
      .send({
        email: 'test@email.com',
        password: '12345',
      });
      expect(response).to.have.property('status');
      expect(response).to.have.status(400);
      expect(response.body.message).to.equal('"password" length must be at least 6 characters long');
    });

    it('Quando usuário não existe', async () =>{
      response = await chai.request(server)
      .post('/login')
      .send({
        email: 'nao_existe@email.com',
        password: 'senhaErrada',
      });
      expect(response).to.have.property('status');
      expect(response).to.have.status(404);
      expect(response.body.message).to.equal('Incorrect username or password.');
    });
  });
});
