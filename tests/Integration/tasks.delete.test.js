const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { getConnection } = require('../connectionMock');

const server = require('../../index');

chai.use(chaiHttp);

const { expect } = chai;

describe('DELETE /tasks', () => {
  before(async () => {
    const connection = await getConnection();
    sinon.stub(MongoClient, 'connect')
      .resolves(connection);
  });
  
  after(async () => {
    await MongoClient.connect.restore();
  });

  describe('12- Caso de sucesso', () => {
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
      .post('/tasks/newTask')
      .set({ "Authorization": `${body.token}` })
      .send({  task: 'Comprar coquinho'}
      );

      taskId = addNewTask.body.id;
      
      response = await chai.request(server)
      .delete('/tasks/delete')
      .set({ "Authorization": `${body.token}` })
      .send(
        {
          id: taskId,
        }
      );
    });

    it('Retorna status 200', () => {
      expect(response).to.have.property('status');
      expect(response).to.have.status(200);
    })

    it('Retorna mensagem "Task deleted successfully!"', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Task deleted successfully!');
    })
  });

  describe('13- Caso de falha', () => {
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
      .post('/tasks/newTask')
      .set({ "Authorization": token })
      .send({  task: 'Comprar coquinho'}
      );

      taskId = addNewTask.body.id;
    });

    describe('Quando não existir o campo id', () => {
      before(async () => {
        response = await chai.request(server)
          .delete('/tasks/delete')
          .set({ "Authorization": token });
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

    describe('Caso token não informado', () => {
      before(async () => {
        response = await chai.request(server)
        .delete('/tasks/delete')
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