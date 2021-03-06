# Bem vindos ao TodoBackEnd

## Objetivo

---

Projeto desenvolvido para avaliação de capacidades em uma vaga fullStack.

---

## O desafio

---

A empresa Ebytr está passando por problemas de produtividade/controle porque as pessoas colaboradoras vêm tendo dificuldade na organização de suas tarefas individuais. Por esse motivo, a diretora de produto Carolina Bigonha decidiu implantar uma nova forma de organizar as tarefas.
Você foi a pessoa contratada para desenvolver um sistema capaz de auxiliar as pessoas colaboradoras a se organizar e ter mais produtividade.
Na Ebytr o time de desenvolvimento utiliza a Stack MERN para criar suas aplicações. Foi combinado com a Ebytr que você utilizará essa mesma Stack para resolver o problema de organização e produtividade da empresa.
Abaixo estão (i) os requisitos técnicos, (ii) as funcionalidades, (iii) critérios de avaliação do desafio e (iv) algumas dicas importantes.

#### Requisitos técnicos:

- Front-End em React;
- Back-End em NodeJS, com MongoDB;
- Arquitetura em camadas;

#### Funcionalidades

- Visualizar a lista de tarefas;
- Esta lista deve ser ordenável por ordem alfabética, data de criação ou por status;
- Inserir uma nova tarefa na lista;
- Remover uma tarefa da lista;
- Atualizar uma tarefa da lista;
- A tarefa deve possuir um status editável: pendente, em andamento ou pronto;

---

## Como instalar

Pré-requisitos para rodar o projeto:
- NPM
- mongoDB

Copie o ssh do projeto `git@github.com:cae07/TodoBackEnd.git`

* Abra um terminal no seu computador e utilize os comandos abaixo na ordem que são apresentados:

* `git clone git@github.com:cae07/TodoBackEnd.git`
* `cd TodoBackEnd`
* `npm install`
* `npm start`

Foi feito o deploy da aplicação no `Heroku`, mas na falta desse, rodará na porta 3001.

---

## Arquitetura da aplicação

```
├── README.md
├── index.js
├── tests
│   ├── Integration
│   │   ├── createUser.test.js
│   │   ├── login.test.js
│   │   ├── tasks.delete.test.js
│   │   ├── tasks.get.test.js
│   │   ├── tasks.post.js
│   │   └── tasks.put.js
│   │
│   ├── Unity
│   │   ├── controller
│   │   │   ├── tasks.get.test.js
│   │   │   ├── tasks.post.js
│   │   │   └── tasks.put.js
│   │   │
│   │   ├── models
│   │   │   ├── tasks.post.js
│   │   │   └── tasks.put.js
│   │   │
│   │   └── services
│   │       ├── tasks.post.js
│   │       └── tasks.put.js
│   │
│   └── connectionMock.js
│
├── services
│   ├── helpers
│   │   └── tasks.helpers.js
│   ├── auth.service.js
│   ├── tasks.service.js
│   └── user.service.js
│
├── Model
│   ├── connection.js
│   ├── tasksModel.js
│   └── userModel.js
│
├── Middlewares
│   ├── auth.js
│   └── handleError.js
│
├── Dictionary
│   ├── errorMessages.js
│   └── status.js
│
├── Controller
│   ├── index.js
│   ├── loginController.js
│   ├── tasksController.js
│   └── userController.js
│
├── package-lock.json
└── package.json

```

### Tecnologias

---

* NodeJS
* express
* body-parser
* cors
* dotenv
* joi
* jsonwebtoken
* mongodb

---

## Regras de negócio

---

### autenticação por token jwt

Ao fazer login ou criar novo usuário, é retornado um `token` que é necessário para usar qualquer uma das outras rotas. Sendo necessário enviar pelo `headers` como `authorization`.

### Rota '/login'
#### endpoint POST '/'

recebe como parâmetro um json com os campos
```
{
  "email": precisa ser válido e não pode ser vazio,
  "password": mínimo 6 dígitos e não pode ser vazio,
}
```

---

### Rota '/createUser'
#### endpoint POST '/'

recebe como parâmetro um json com os campos
```
{
  "email": precisa ser válido e não pode ser vazio,
  "password": mínimo 6 dígitos e não pode ser vazio,
}
```

---

### Rota '/tasks'
#### endpoint GET '/'

Apenas necessário fazer o login de usuário antes de chamar a rota

#### endpoint POST '/newTask'

recebe como parâmetro um json com o campo
```
{
  "task": não pode ser vazio,
}
```

#### endpoint PUT '/update'

recebe como parâmetro um json com o campo
```
{
  "id": id da tarefa a ser atualizada e não pode ser vazio,
  "task": não pode ser vazio,
  "status": não pode ser vazio,
}
```

#### endpoint DELETE '/delete'

recebe como parâmetro um json com o campo
```
{
  "id": id da tarefa a ser deletada e não pode ser vazio,
}
```
---

### Comandos básicos

---

#### Iniciar aplicação
- npm start

#### Rodar testes de Integração
- npm run test-integration

#### Rodar testes Unitários
- npm run test-unity

---

## Repositório do Front-End

`https://github.com/cae07/TodoFrontEnd`

# Divirta-se
