const sinon = require('sinon');
const { expect } = require('chai');
const userService = require('../../../Service/user.service');
const loginController = require('../../../Controller/loginController');
const token = require('../../../Service/auth.service');
const { getConnection } = require('../../connectionMock');
const { OK } = require('../../../Dictionary/status');

describe('Ao tentar fazer login', () => {
  describe('9- Quando tudo correto', () => {
    const response = {};
    const request = {};
    const email = "test@email.com";
    const password = "123456";
    const mockedID = '604cb554311d68f491ba5781';
    const mockedToken = '123456qweqwe';

    before(async () => {
      const db = (await getConnection()).db('Todolist');
      await db.collection('users').insertOne({ email, password });

      request.body = { email, password };

      response.json = sinon.stub().returns();
      response.status = sinon.stub().returns(response);

      sinon.stub(userService, 'verifyUser').resolves(true);
      sinon.stub(userService, 'verifyExistUser').resolves(
        {
          id: mockedID, email, password, role: 'user'
        });
        sinon.stub(token, 'tokenGenerator').returns(mockedToken);
    });

    after(async () => {
      const db = (await getConnection()).db('Todolist');
      await db.collection('users').drop();

      userService.verifyUser.restore();
      userService.verifyExistUser.restore();
    });

    it('Retorna um status com código 200', async () => {
      await loginController.login(request, response);

      expect(response.status.calledWith(OK)).to.be.true;
    });

    it('Retorna um json com o token JWT', async () => {
      await loginController.login(request, response);

      expect(response.json.calledWith({ token: mockedToken })).to.be.true;
    });
  });
});
