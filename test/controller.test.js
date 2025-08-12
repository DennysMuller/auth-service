const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../app');
const service = require('../src/service/userService');
const { expect } = chai;

describe('Controller', () => {
  afterEach(() => sinon.restore());

  it('deve registrar usuário novo', async () => {
    sinon.stub(service, 'register').returns({ login: 'user1' });
    await supertest(app)
      .post('/register')
      .send({ login: 'user1', password: '123' })
      .expect(201)
      .then(res => expect(res.body.login).to.equal('user1'));
  });

  it('deve retornar erro ao registrar usuário duplicado', async () => {
    sinon.stub(service, 'register').throws({ status: 409, message: 'Usuário já existe.' });
    await supertest(app)
      .post('/register')
      .send({ login: 'user1', password: '123' })
      .expect(409)
      .then(res => expect(res.body.message).to.equal('Usuário já existe.'));
  });

  it('deve logar usuário com sucesso', async () => {
    sinon.stub(service, 'loginUser').returns({ token: 'jwt-token' });
    await supertest(app)
      .post('/login')
      .send({ login: 'user1', password: '123' })
      .expect(200)
      .then(res => expect(res.body.token).to.equal('jwt-token'));
  });

  it('deve retornar erro ao logar com credenciais inválidas', async () => {
    sinon.stub(service, 'loginUser').throws({ status: 401, message: 'Credenciais inválidas.' });
    await supertest(app)
      .post('/login')
      .send({ login: 'user1', password: 'errado' })
      .expect(401)
      .then(res => expect(res.body.message).to.equal('Credenciais inválidas.'));
  });

  it('deve acessar rota protegida com JWT válido', async () => {
    sinon.stub(service, 'loginUser').returns({ token: 'jwt-token' });
    sinon.stub(service, 'register').returns({ login: 'user1' });
    const jwt = require('jsonwebtoken');
    const { SECRET } = require('../src/service/userService');
    const token = jwt.sign({ login: 'user1' }, SECRET);
    await supertest(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(res => expect(res.body.message).to.include('Bem-vindo, user1'));
  });
});
