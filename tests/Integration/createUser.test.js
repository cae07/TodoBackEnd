const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('../connectionMock');

const server = require('../../index');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /createUser', () => {
  before(async () => {
    const connection = await getConnection();
    sinon.stub(MongoClient, 'connect')
      .resolves(connection);
  });
  
  after(async () => {
    await MongoClient.connect.restore();
  });
  
  describe('3- Casos de sucesso', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
      .post('/createUser')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });
    });

    it('Retorna um objeto', () => {
      expect(response).to.be.a('object');
    });

    it('Retorna o novo usuário', () => {
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('email');
      expect(response.body).to.have.property('password');
      expect(response.body).to.have.property('role');
    });

    it('Retorna status 201', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(201);
    });
  });

  describe('4- Casos de falha', () => {
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
  });

  describe('5- Quando já existe o email cadastrado', () => {
    let response = {};
    before(async () => {
      await chai.request(server)
      .post('/createUser')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });

      response = await chai.request(server)
      .post('/createUser')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });
    });
    it('Retorna status 400', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(400);
    });
    it('Retorna mensagem "Email já existe"', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Email já existe');
    });
  });
});
