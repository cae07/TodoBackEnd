const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

const server = require('../index');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /tasks', () => {
  before(async () => {
    const connection = await getConnection();
    sinon.stub(MongoClient, 'connect')
      .resolves(connection);
  });
  
  after(async () => {
    await MongoClient.connect.restore();
  });

  describe('8- Caso de sucesso', () => {
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
      .post('/tasks')
      .set({ "Authorization": `${body.token}` })
      .send({ task: 'Comprar coquinho' });
    });

    it('Retorna um objeto', () => {
      expect(response).to.be.a('object');
    });

    it('Retorna status 201', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(201);
    });

    it('Retorna a nova tarefa', () => {
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('task');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.equal('pendente');
    });
  });

  describe('9- Caso de falha', () => {
    let response = {};
    let token = '';

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

      token = body.token;
    });
    describe('Quando não existir o campo "task"', () => {
      it('Retorna status 400', async () => {
        response = await chai.request(server)
        .post('/tasks')
        .set({ "Authorization": token })
        .send({ "": 'Comprar coquinho' });

        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem "task is required"', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"task" is required');
      });
    });

    describe('Quando o campo "task" estiver vazia', () => {
      it('Retorna status 400', async () => {
        response = await chai.request(server)
        .post('/tasks')
        .set({ "Authorization": token })
        .send({ "task": '' });

        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      })

      it('Retorna mensagem /"task" is not allowed to be empty/', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"task" is not allowed to be empty');
      });
    });

    describe('Caso token não informado', () => {
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
});
