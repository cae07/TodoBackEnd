const sinon = require('sinon');
const { expect } = require('chai');
const userService = require('../../../Service/user.service');
const loginController = require('../../../Controller/loginController');
const token = require('../../../Service/auth.service');
const { getConnection } = require('../../connectionMock');
const { OK } = require('../../../Dictionary/status');

describe('Ao tentar fazer login', () => {
  describe('15- Quando tudo correto', () => {
    let connectionMock;
    const response = {};
    const request = {};
    const email = "test@email.com";
    const password = "123456";
    const mockedID = '604cb554311d68f491ba5781';
    const mockedToken = '123456qweqwe';

    before(async () => {
      connectionMock = await getConnection();
      await connectionMock.db('Todolist').collection('users').insertOne({ email, password });

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
      connectionMock = await getConnection();
      await connectionMock.db('Todolist').collection('users').drop();

      await userService.verifyUser.restore();
      await userService.verifyExistUser.restore();
      await token.tokenGenerator.restore();
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
