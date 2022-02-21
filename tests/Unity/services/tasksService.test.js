const sinon = require('sinon');
const { expect } = require('chai');
const taskService = require('../../../Service/tasks.service');
const tasksModel = require('../../../Model/tasksModel');
const helper = require('../../../Service/helpers/tasks.helpers');
// const { getConnection } = require('../../connectionMock');

describe('Função getTasks', () => {
  const email = 'test@email.com';

  describe('9- Verifica o retorno', () => {
    before(async () => {
      const tasks = [
        { id: '1', task: 'Andar de bike' , user_email: email, status: 'pendente' },
        { id: '2', task: 'Andar de skate' , user_email: email, status: 'pendente' },
        { id: '3', task: 'Andar de onibus' , user_email: email, status: 'pendente' },
        { id: '4', task: 'Andar de patins' , user_email: email, status: 'pendente' },
      ]

      sinon.stub(tasksModel, 'getAllTasks')
        .resolves(tasks);
    });

    after(() => {
      tasksModel.getAllTasks.restore();
    });

    it('Retorna um array', async () => {
      const response = await taskService.getTasks(email);

      expect(response).to.be.a('array');
    });

    it('Esse array possui quatro objetos', async () => {
      const response = await taskService.getTasks(email);

      expect(response.length).to.equal(4);
    });

    it('Esse objeto possui propriedade "id"', async () => {
      const response = await taskService.getTasks(email);

      expect(response[0]).to.have.property('id');
    });

    it('Esse objeto possui propriedade "task"', async () => {
      const response = await taskService.getTasks(email);
      expect(response[0]).to.have.property('task');
    });

    it('Esse objeto possui propriedade "user_email"', async () => {
      const response = await taskService.getTasks(email);

      expect(response[0]).to.have.property('user_email');
    });

    it('Esse objeto possui propriedade "status"', async () => {
      const response = await taskService.getTasks(email);

      expect(response[0]).to.have.property('status');
    });
  });
});

describe('Função verifyNewTask', () => {
  const task = 'lavar o carro';
  const email = 'teste@email.com';
  const empty = '';

  describe('10- Quando erro se tem os valores esperados', () => {
    it('10- quando task vazio.', async () => {
      try {
        await taskService.verifyNewTask(empty, email);
      } catch (error) {
        expect(error).to.be.a('object');
        expect(error.status).to.be.equal(400);
        expect(error.message).to.be.equal('"task" is not allowed to be empty');
      };
    });
  });  

  describe('11- Verifica quando tudo OK', async () => {
    const newTask = { id: 1, task, user_email: email, status: 'pendente' };

    before(async () => {
      sinon.stub(tasksModel, 'createNewTask').resolves(newTask);
    });

    after(() => {
      tasksModel.createNewTask.restore();
    });

    it('Retorna um objeto', async () => {
      const response = await taskService.verifyNewTask(task, email);

      expect(response).to.be.a('object');
    });

    it('Esse objeto tem a propriedade id', async () => {
      const response = await taskService.verifyNewTask(task, email);

      expect(response).to.have.property('id');
    });

    it('Esse objeto tem a propriedade task', async () => {
      const response = await taskService.verifyNewTask(task, email);

      expect(response).to.have.property('task');
    });

    it('Esse objeto tem a propriedade user_email', async () => {
      const response = await taskService.verifyNewTask(task, email);

      expect(response).to.have.property('user_email');
    });

    it('Esse objeto tem a propriedade status', async () => {
      const response = await taskService.verifyNewTask(task, email);

      expect(response).to.have.property('status');
    });
  });
});

describe('Função verifyToUpdate', () => {
  const id = "123sdf21r3zs5";
  const task = "Lavar o carro";
  const status = "pendente";

  before(() => {
    sinon.stub(helper, 'verifyId').resolves(true);
  });

  after(() => {
    helper.verifyId.restore();
  });

  describe('12- Quando erro se tem os valores esperados', () => {
    it('quando task vazio.', async () => {
      try {
        await taskService.verifyToUpdate(id, '', status);
      } catch (error) {
        expect(error).to.be.a('object');
        expect(error.status).to.be.equal(400);
        expect(error.message).to.be.equal('"task" is not allowed to be empty');
      };
    });

    it('quando status vazio.', async () => {
      try {
        await taskService.verifyToUpdate(id, task, '');
      } catch (error) {
        expect(error).to.be.a('object');
        expect(error.status).to.be.equal(400);
        expect(error.message).to.be.equal('"status" is not allowed to be empty');
      };
    });
  });

  describe('13 -Quando tudo correto tem o retorno esperado', () => {
    const updatedTask = {
      id: '1',
      task: 'Andar de moto',
      user_email: 'test@test.com',
      status: 'pendente',
    };

    before(() => {
      sinon.stub(tasksModel, 'updateTask').resolves(updatedTask);
    })

    after(() => {
      tasksModel.updateTask.restore();
    });

    it('Retorna um objeto', async () => {
      const response = await taskService.verifyToUpdate(id, task, status);
  
      expect(response).to.be.a('object');
    });

    it('Esse objeto tem propriedade "id"', async () => {
      const response = await taskService.verifyToUpdate(id, task, status);
  
      expect(response).to.have.property('id');
    });

    it('Esse objeto tem propriedade "task"', async () => {
      const response = await taskService.verifyToUpdate(id, task, status);
  
      expect(response).to.have.property('task');
    });

    it('Esse objeto tem propriedade "user_email"', async () => {
      const response = await taskService.verifyToUpdate(id, task, status);
  
      expect(response).to.have.property('user_email');
    });

    it('Esse objeto tem propriedade "status"', async () => {
      const response = await taskService.verifyToUpdate(id, task, status);
  
      expect(response).to.have.property('status');
    });
  });
});

describe('14- Função verifyToDelete', () => {
  const id = '3s2g81s5v8sw1v3';

  before(() => {
    sinon.stub(helper, 'verifyId').resolves(true);
    sinon.stub(tasksModel, 'deleteTask').resolves(true);
  });

  after(() => {
    helper.verifyId.restore();
    tasksModel.deleteTask.restore();
  });

  it('Retorna um booleano', async () => {
    const response = await taskService.verifyToDelete(id);

    expect(response).to.be.a('boolean');
  });

  it('esse booleano tem valor "true"', async () => {
    const response = await taskService.verifyToDelete(id);

    expect(response).to.be.equal(true);
  });
});