const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { getConnection } = require('../../connectionMock');
const userModel = require('../../../Model/userModel');
const { ObjectId } = require('mongodb');

describe('1- Insere um novo usuário do DB', () => {
  let connectionMock;

  const payloadUser = {
    email: 'newUser@email.com',
    password: '123456',
  };

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    await connectionMock.db('Todolist').collection('users').drop();
    MongoClient.connect.restore();
  });

  describe('Quando inserido com sucesso', () => {
    it('retorna um objeto', async () => {
      const response = await userModel.createNewUser(payloadUser);

      expect(response).to.be.a('object');
    });

    it('O objeto possui uma propriedade "id"', async () => {
      const response = await userModel.createNewUser(payloadUser);

      expect(response).to.have.property('id');
    });

    it('O objeto possui uma propriedade "email"', async () => {
      const response = await userModel.createNewUser(payloadUser);

      expect(response).to.have.property('email');
    });

    it('O objeto possui uma propriedade "password"', async () => {
      const response = await userModel.createNewUser(payloadUser);

      expect(response).to.have.property('password');
    });

    it('O objeto possui uma propriedade "role"', async () => {
      const response = await userModel.createNewUser(payloadUser);

      expect(response).to.have.property('role');
    });

    it('deve existir um novo usuário com as infos cadastradas', async () => {
      await userModel.createNewUser(payloadUser);
      const newUser = await userModel.findUser(
        { email: payloadUser.email, password: payloadUser.password }
      );
      
      expect(newUser).not.to.be.null;
    });
  });;
});