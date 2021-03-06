const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('../connectionMock');

const server = require('../../index');

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
      const user = {
        email: 'test@gmail.com',
        password: '123456',
      };

      await chai.request(server)
      .post('/createUser')
      .send(user);

      const { body } = await chai.request(server)
      .post('/login')
      .send(user);

      const addNewTask = await chai.request(server)
      .post('/tasks/newTask')
      .set({ "Authorization": `${body.token}` })
      .send({  task: 'Comprar coquinho'}
      );

      taskId = addNewTask.body.id;
      
      response = await chai.request(server)
      .put('/tasks/update')
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
    let taskId = '';
    let token = '';

    before(async () => {
      const user = {
        email: 'test@gmail.com',
        password: '123456',
      };

      await chai.request(server)
      .post('/createUser')
      .send(user);

      const { body } = await chai.request(server)
      .post('/login')
      .send(user);
      
      const addNewTask = await chai.request(server)
      .post('/tasks/newTask')
      .set({ "Authorization": body.token })
      .send({  task: 'Comprar coquinho'}
      );
      
      token = body.token;
      taskId = addNewTask.body.id;
    });

    describe('Quando n??o existir o campo "task"', () => {
      before(async () => {
        response = await chai.request(server)
        .put('/tasks/update')
        .set({ "Authorization": token })
        .send({
          "id": taskId,
          "task": "",
          "status": 'pendente',
        });
      });

      it('Retorna status 400', () => {
        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem ""task" is not allowed to be empty"', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"task" is not allowed to be empty');
      });
    });

    describe('Quando n??o existir o campo "id"', () => {
      before(async () => {
        response = await chai.request(server)
        .put('/tasks/update')
        .set({ "Authorization": token })
        .send({
          "id": "",
          "task": "outra tarefa",
          "status": 'pendente',
        });
      });

      it('Retorna status 400', () => {
        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem "All fields must be filled."', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('All fields must be filled.');
      });
    });

    describe('Quando n??o existir o campo "status"', () => {
      before(async () => {
        response = await chai.request(server)
        .put('/tasks/update')
        .set({ "Authorization": token })
        .send({
          "id": taskId,
          "task": "outra tarefa",
          "status": "",
        });
      });

      it('Retorna status 400', () => {
        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem ""status" is not allowed to be empty"', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"status" is not allowed to be empty');
      });
    });

    describe('Quando "id" for inv??lido', async () => {
      before(async () => {
        response = await chai.request(server)
        .put('/tasks/update')
        .set({ "Authorization": token })
        .send({
          "id": '12354687',
          "task": "outra tarefa",
          "status": "",
        });
      });

      it('Retorna status 400', () => {
        expect(response.error).to.have.property('status');
        expect(response.error).to.have.status(400);
      });

      it('Retorna mensagem "Invalid entries."', () => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Invalid entries.');
      });
    });

    describe('Caso token n??o informado', async () => {
      const response = await chai.request(server)
      .put('/tasks/update');

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