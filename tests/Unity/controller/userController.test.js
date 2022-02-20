const sinon = require('sinon');
const { expect } = require('chai');
const userService = require('../../../Service/user.service');
const userController = require('../../../Controller/userController');
const token = require('../../../Service/auth.service');
const { CREATED } = require('../../../Dictionary/status');

describe('Quando login bem sucedido', () => {
  const response = {};
  const request = {};
  const email = "test@email.com";
  const password = "123456";
  const mockedToken = '123456qweqwe';
  const newUser = {
    id: '604cb554311d68f491ba5781',
    email,
    password,
    role: 'user',
  };

  before(async () => {
    request.body = { email, password };

    response.json = sinon.stub().returns();
    response.status = sinon.stub().returns(response);

    sinon.stub(userService, 'verifyUser').resolves(true);
    sinon.stub(userService, 'verifyUserToCreate').resolves(newUser);
    sinon.stub(token, 'tokenGenerator').returns({ token: mockedToken });
  });

  after(async () => {
    userService.verifyUser.restore();
    userService.verifyUserToCreate.restore();
    token.tokenGenerator.restore();
  });

  it('Retorna um status com código 201', async () => {
    await userController.POST(request, response);

    expect(response.status.calledWith(CREATED)).to.be.true;
  });

  it('Retorna um json com o token JWT e newUser', async () => {
    await userController.POST(request, response);

    expect(response.json.calledWith()).to.be.true;
  });
});
