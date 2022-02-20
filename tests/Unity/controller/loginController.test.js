const sinon = require('sinon');
const { expect } = require('chai');
const userService = require('../../../Service/user.service');
const loginController = require('../../../Controller/loginController');
const { OK } = require('../../../Dictionary/status');

describe('Ao tentar fazer login', () => {
  describe('9- Quando tudo correto', () => {
    const response = {};
    const request = {};
    const email = "test@email.com";
    const password = "123456";
    const mockedID = '604cb554311d68f491ba5781';

    before(() => {
      request.body = { email, password };

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(userService, 'verifyExistUser')
        .resolves({
          id: mockedID, email, password, role: 'user'
        });
    });

    after(() => {
      userService.verifyExistUser.restore();
    });

    it('Retorna um status com código 201', async () => {
      await loginController.post(request, response);

      expect(response.status.calledWith(201)).to.be.equal(true);
    });

    it('Retorna um json com o token JWT', async () => {
      await loginController.post(request, response);

      expect(response.json).to.have.property('token');
    });
  });
});