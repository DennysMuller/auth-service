
## 11. Explicação dos Arquivos para Leigos

### userController.js
Responsável por receber as requisições de cadastro e login, validar os dados e encaminhar para o serviço. Ele decide o que responder para o usuário, como "Usuário criado" ou "Credenciais inválidas".

### authMiddleware.js
É o "porteiro" das rotas protegidas. Ele verifica se o usuário enviou um token JWT válido antes de permitir o acesso a informações protegidas.

### userModel.js
Guarda os dados dos usuários em memória (em uma variável). Não tem conexão com banco de dados externo, tudo fica salvo enquanto o servidor está rodando.

### userService.js
Faz a lógica principal: registra usuários, verifica se já existem, faz login, gera o token JWT. É onde as regras de negócio acontecem.

### server.js
É o arquivo que inicia o servidor, dizendo em qual porta ele vai rodar. Só chama o app.js e começa a escutar as requisições.

### app.js
Configura toda a aplicação: define as rotas, integra o Swagger (documentação), aplica os middlewares e exporta o app para ser usado nos testes ou pelo server.js.

---

## Detalhamento dos Testes do controller.test.js

O arquivo controller.test.js usa Mocha, Chai, Sinon e SuperTest para testar as funcionalidades da API. Cada teste verifica se a API responde corretamente em diferentes situações.

### 1. Teste: deve registrar usuário novo
```js
sinon.stub(service, 'register').returns({ login: 'user1' });
await supertest(app)
  .post('/register')
  .send({ login: 'user1', password: '123' })
  .expect(201)
  .then(res => expect(res.body.login).to.equal('user1'));
```
- Simula o cadastro de um usuário novo.
- "Stub" faz o método register sempre retornar sucesso.
- Envia uma requisição POST para /register com login e senha.
- Espera resposta 201 (criado) e verifica se o login retornado é igual ao enviado.

### 2. Teste: deve retornar erro ao registrar usuário duplicado
```js
sinon.stub(service, 'register').throws({ status: 409, message: 'Usuário já existe.' });
await supertest(app)
  .post('/register')
  .send({ login: 'user1', password: '123' })
  .expect(409)
  .then(res => expect(res.body.message).to.equal('Usuário já existe.'));
```
- Simula tentativa de cadastrar um usuário já existente.
- "Stub" faz o método register lançar erro de duplicidade.
- Envia requisição POST para /register.
- Espera resposta 409 (conflito) e verifica se a mensagem de erro está correta.

### 3. Teste: deve logar usuário com sucesso
```js
sinon.stub(service, 'loginUser').returns({ token: 'jwt-token' });
await supertest(app)
  .post('/login')
  .send({ login: 'user1', password: '123' })
  .expect(200)
  .then(res => expect(res.body.token).to.equal('jwt-token'));
```
- Simula login bem-sucedido.
- "Stub" faz loginUser sempre retornar um token.
- Envia POST para /login.
- Espera resposta 200 e verifica se o token está presente.

### 4. Teste: deve retornar erro ao logar com credenciais inválidas
```js
sinon.stub(service, 'loginUser').throws({ status: 401, message: 'Credenciais inválidas.' });
await supertest(app)
  .post('/login')
  .send({ login: 'user1', password: 'errado' })
  .expect(401)
  .then(res => expect(res.body.message).to.equal('Credenciais inválidas.'));
```
- Simula tentativa de login com senha errada.
- "Stub" faz loginUser lançar erro de credenciais.
- Envia POST para /login.
- Espera resposta 401 (não autorizado) e verifica mensagem de erro.

### 5. Teste: deve acessar rota protegida com JWT válido
```js
const jwt = require('jsonwebtoken');
const { SECRET } = require('../src/service/userService');
const token = jwt.sign({ login: 'user1' }, SECRET);
await supertest(app)
  .get('/protected')
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .then(res => expect(res.body.message).to.include('Bem-vindo, user1'));
```
- Gera um token JWT válido para o usuário.
- Envia GET para /protected com o token no header Authorization.
- Espera resposta 200 e verifica se a mensagem de boas-vindas contém o login do usuário.

---
Esses testes garantem que a API responde corretamente em situações comuns de autenticação e cadastro.