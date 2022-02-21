const sinon = require('sinon');
const { expect } = require('chai');
const userService = require('../../../Service/user.service');
const userModel = require('../../../Model/userModel');
const { ERROR_LOGIN, CREATE_USER_ERROR } = require('../../../Dictionary/errorMessages');
const { ObjectId } = require('mongodb');

describe('Função verifyUser', () => {
  const empty = "";
  const incorrectEmail = "emailIncorreto";
  const email = "teste@email.com";
  const incorrectPassword = "12345";
  const password = "123456";

  describe('3- Quando o email/password no payload informado está incorreto ou vazio', () => {
    it('Quando email vazio retorna um erro ""email" is not allowed to be empty" e status 400', () => {
      try {
        userService.verifyUser(empty, password);
      } catch (error) {
        console.log(error);
        expect(error).to.have.property('message');
        expect(error).to.have.property('status');
        expect(error.message).to.be.equal('"email" is not allowed to be empty');
        expect(error.status).to.be.equal(400);
      }
    });
  
    it('Quando email incorreto retorna um erro ""email" must be a valid email" e status 400', () => {
      try {
        userService.verifyUser(incorrectEmail, password);
      } catch (error) {
        console.log(error);
        expect(error).to.have.property('message');
        expect(error).to.have.property('status');
        expect(error.message).to.be.equal('"email" must be a valid email');
        expect(error.status).to.be.equal(400);
      }
    });
  
    it('Quando password vazio retorna um erro ""password" is not allowed to be empty" e status 400', () => {
      try {
        userService.verifyUser(email, empty);
      } catch (error) {
        console.log(error);
        expect(error).to.have.property('message');
        expect(error).to.have.property('status');
        expect(error.message).to.be.equal('"password" is not allowed to be empty');
        expect(error.status).to.be.equal(400);
      }
    });
  
    it('Quando password incorreto retorna um erro ""password" length must be at least 6 characters long" e status 400', () => {
      try {
        userService.verifyUser(email, incorrectPassword);
      } catch (error) {
        console.log(error);
        expect(error).to.have.property('message');
        expect(error).to.have.property('status');
        expect(error.message).to.be.equal('"password" length must be at least 6 characters long');
        expect(error.status).to.be.equal(400);
      }
    });
  });

  describe('4- Quando o payload está correto', () => {
    it('Retorna um boleano', () => {
      const response = userService.verifyUser(email, password);
      
      expect(response).to.be.a('boolean');
    });

    it('Retorna true', () => {
      const response = userService.verifyUser(email, password);
      
      expect(response).to.be.equal(true);
    });
  });
});

describe('Função verifyExistUser', () => {
  const email = "teste@email.com";
  const password = "123456";

  describe('5- Quando o usuário não existe', () => {
    before(() => {
      sinon.stub(userModel, 'findUser')
        .resolves({});
    });

    after(async () => {
      await userModel.findUser.restore();
    });

    it('Retorna erro "Incorrect username or password."', async () => {
      try {
        await userService.verifyExistUser(email, password);
      } catch (error) {
        expect(error).to.have.property('message');
        expect(error.message).to.equal('Incorrect username or password.');
      };
    });

    it('Retorna status 404', async () => {
      try {
        await userService.verifyExistUser(email, password);
      } catch (error) {
        expect(error).to.have.property('status');
        expect(error.status).to.equal(404);
      };
    });
  });

  describe('6- Quando o usuário existe', () => {
    let response = {};
    before(() => {
      const user = {
        id: '604cb554311d68f491ba5781',
        email: 'test@email.com',
        password: '123456',
        role: 'user',
      };

      sinon.stub(userModel, 'findUser').resolves(user);
    });

    after(() => {
      userModel.findUser.restore();
    });

    it('retorna um objeto', async () => {
      response = await userService.verifyExistUser(email, password);

      expect(response).to.be.a('object');
    });

    it('esse objeto possui propriedade email', async () => {
      expect(response).to.have.property('email');
    });

    it('esse objeto possui propriedade password', async () => {
      expect(response).to.have.property('password');
    });

    it('esse objeto possui propriedade role com valor "user"', async () => {
      expect(response).to.have.property('role');
      expect(response.role).to.be.equal('user');
    });

    it('esse objeto possui propriedade id', async () => {
      const response = await userService.verifyExistUser(email, password);

      expect(response).to.have.property('id');
    });

    it('esse id é válido', async () => {
      const { id } = await userService.verifyExistUser(email, password);
      const isValid = ObjectId.isValid(id);

      expect(isValid).to.be.a('boolean');
      expect(isValid).to.be.equal(true);
    });
  });
});

describe('Função verifyUserToCreate', () => {
  const email = "teste@email.com";
  const password = "123456";

  describe('7- quando email já existe', () => {
    before(() => {
      sinon.stub(userModel, 'findEmail').resolves(true);
    });

    after(() => {
      userModel.findEmail.restore();
    });

    it('retorna erro "Email já existe com status 400"', async () => {
      try {
        await userService.verifyUserToCreate(email, password);
      } catch (error) {
        expect(error).to.have.property('message');
        expect(error).to.have.property('status');
        expect(error.message).to.be.equal('Email já existe');
        expect(error.status).to.be.equal(400);
      };
    });
  });

  describe('8- Quando cria com sucesso', () => {
    let response = {};

    before(async () => {
      const newUser = {
        id: '604cb554311d68f491ba5781',
        email: 'test@email.com',
        password: '123456',
        role: 'user',
      };

      sinon.stub(userModel, 'findEmail').resolves(false);
      sinon.stub(userModel, 'createNewUser').resolves(newUser);

      response = await userService.verifyUserToCreate(email, password);
    });

    after(() => {
      userModel.findEmail.restore();
      userModel.createNewUser.restore();
    });

    it('Retorna um objeto', () => {
      expect(response).to.be.a('object');
    });

    it('Esse objeto possui propriedade email ', () => {
      expect(response).to.have.property('email');
    });

    it('Esse objeto possui propriedade role com valor "user" ', () => {
      expect(response).to.have.property('role');
      expect(response.role).to.be.equal('user');
    });

    it('Esse objeto possui propriedade id', () => {
      expect(response).to.have.property('id');
    });

    it('Esse id é válido', () => {
      const { id } = response;
      const isValid = ObjectId.isValid(id)

      expect(isValid).to.be.a('boolean');
      expect(isValid).to.be.equal(true);
    });
  });
});
