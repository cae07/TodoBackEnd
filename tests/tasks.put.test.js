const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

const server = require('../index');

chai.use(chaiHttp);

const { expect } = chai;

describe('PUT /tasks', () => {
  before(async () => {
    const connection = await getConnection();
    sinon.stub(MongoClient, 'connect')
      .resolves(connection);
  });
  
  after(async () => {
    await MongoClient.connect.restore();
  });

  describe('10- Caso de sucesso', () => {
    let response = {};
    let taskId = '';

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

      const addNewTask = await chai.request(server)
      .post('/tasks')
      .set({ "Authorization": `${body.token}` })
      .send({  task: 'Comprar coquinho'}
      );

      taskId = addNewTask.body.id;
      
      response = await chai.request(server)
      .put('/tasks')
      .set({ "Authorization": `${body.token}` })
      .send(
        {
          id: taskId,
          task: 'Mudando task',
          status: 'in progress',
        }
      );
    });

    it('Retorna status 200', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(200);
    });

    it('Retorna a nova tarefa', () => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('task');
      expect(response.body).to.have.property('status');
    });
  });

  describe('11- Casos de falha', () => {
    let response = {};
    let taskId = '';
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

      const addNewTask = await chai.request(server)
      .post('/tasks')
      .set({ "Authorization": token })
      .send({  task: 'Comprar coquinho'}
      );

      taskId = addNewTask.body.id;
    });

    describe('Quando não existir o campo "task"', () => {
      it('Retorna status 400', async () => {
        response = await chai.request(server)
        .put('/tasks')
        .set({ "Authorization": token })
        .send({
          id: taskId,
          status: 'pendente',
        });

        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem ""task" is required"', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"task" is required');
      });
    });

    describe('Quando não existir o campo "id"', () => {
      it('Retorna status 400', async () => {
        response = await chai.request(server)
        .put('/tasks')
        .set({ "Authorization": token })
        .send({
          task: 'qualquer tarefa',
          status: 'pendente',
        });

        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem "All fields must be filled."', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('All fields must be filled.');
      });
    });

    describe('Quando não existir o campo "status"', () => {
      it('Retorna status 400', async () => {
        response = await chai.request(server)
        .put('/tasks')
        .set({ "Authorization": token })
        .send({
          id: taskId,
          task: 'qualquer tarefa',
        });

        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem ""status" is required"', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"status" is required');
      });
    });

    describe('Quando "id" for inválido', () => {
      it('Retorna status 400', async () => {
        response = await chai.request(server)
        .put('/tasks')
        .set({ "Authorization": token })
        .send({
          id: '368414365',
          task: 'qualquer tarefa',
          status: 'pendente',
        });

        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem "Invalid entries."', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Invalid entries.');
      });
    });
  });
});