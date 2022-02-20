const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { getConnection } = require('../../connectionMock');
const tasksModel = require('../../../Model/tasksModel');
const { ObjectId } = require('mongodb');

describe('2- Insere uma nova tarefa do DB', () => {
  let connectionMock;

  const payloadTask = {
    task: 'dar banho no cachorro',
    email: 'newUser@email.com',
  };

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    await connectionMock.db('Todolist').collection('tasks').drop();
    MongoClient.connect.restore();
  });

  describe('Quando inserido com sucesso', () => {
    it('retorna um objeto', async () => {
      const response = await tasksModel.createNewTask(payloadTask);

      expect(response).to.be.a('object');
    });

    it('O objeto possui uma propriedade "id"', async () => {
      const response = await tasksModel.createNewTask(payloadTask);

      expect(response).to.have.property('id');
    });

    it('O objeto possui uma propriedade "task"', async () => {
      const response = await tasksModel.createNewTask(payloadTask);

      expect(response).to.have.property('task');
    });

    it('O objeto possui uma propriedade "user_email"', async () => {
      const response = await tasksModel.createNewTask(payloadTask);

      expect(response).to.have.property('user_email');
    });

    it('O objeto possui uma propriedade "status" com valor "pendente"', async () => {
      const response = await tasksModel.createNewTask(payloadTask);

      expect(response).to.have.property('status');
      expect(response.status).to.equal('pendente');
    });

    it('O id retornado deve ser válido', async () => {
      const { id } = await tasksModel.createNewTask(payloadTask);
      
      const isIDValid = ObjectId.isValid(id);
      expect(isIDValid).not.to.be.false;
    });
  });
});