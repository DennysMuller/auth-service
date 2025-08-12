# Histórico do Chat - Projeto AUTH-SERVICE

## 1. Solicitação Inicial
- Construção de uma API REST simples para login, separando Controller, Service e Model.
- Regras: login/senha obrigatórios, não permitir usuários duplicados, uso de JWT, banco em memória.
- Separação de arquivos: app.js e server.js.
- Documentação Swagger e endpoint para renderização.
- README.md explicando uso.
- 5 testes automatizados isolando Controller do Service (Sinon, Mocha, SuperTest, Chai).

## 2. Estrutura Inicial Criada
- Pastas e arquivos: src/model.js, src/service.js, src/controller.js, src/middleware.js, app.js, server.js, README.md, test/controller.test.js.
- package.json com dependências e scripts.
- Instalação das dependências (npm install).

## 3. Reorganização em Pastas
- Estrutura sugerida:
  - src/model/userModel.js
  - src/service/userService.js
  - src/controller/userController.js
  - src/middleware/authMiddleware.js
  - src/middleware/errorHandler.js
  - test/
  - app.js, server.js, README.md, package.json na raiz
- Ajuste dos imports e caminhos nos arquivos.

## 4. Correção de Erro npm (ETARGET)
- Erro: No matching version found for swagger-ui-express@^4.7.1.
- Solução: Alteração para versão ^4.6.3 no package.json.
- Instalação das dependências concluída.

## 5. Criação do .gitignore
- Exclusão de node_modules, logs, arquivos temporários, cache, VSCode, cobertura de testes.

## 6. Documentação Swagger
- Swagger não exibia operações.
- Adição de comentários JSDoc nas rotas do controller e app.js.
- Configuração do esquema JWT (bearerAuth) no Swagger.
- Agora as rotas aparecem corretamente em /api-docs.

## 7. Testes Automatizados
- Testes criados em test/controller.test.js usando Mocha, Chai, Sinon e SuperTest.
- Testes cobrem registro, login, erros e acesso protegido.

## 8. Erro em Teste Automatizado
- Teste falhou ao tentar acessar a rota protegida com JWT válido.
- Motivo provável: O token usado no teste é simulado (stub) e não é realmente válido para o middleware JWT, pois o middleware espera um token gerado pelo jwt.sign, mas o stub retorna apenas 'jwt-token'.
- Solução: Para testar corretamente, é necessário gerar um token real usando o mesmo segredo do serviço, ou mockar o middleware de autenticação para aceitar o token stub.
- O restante dos testes passou normalmente, indicando que o Controller e Service estão funcionando, mas o middleware de autenticação está validando o token de forma real.

## 9. Orientação para Mockar Token JWT em Teste
- Para que o teste da rota protegida funcione, é necessário fornecer um token JWT válido.
- Solução sugerida: No teste, gere um token real usando o mesmo segredo do serviço, com jwt.sign({ login: 'user1' }, SECRET).
- Exemplo:

```js
const jwt = require('jsonwebtoken');
const { SECRET } = require('../src/service/userService');
const token = jwt.sign({ login: 'user1' }, SECRET);
```
- Use esse token no header Authorization do teste:

```js
.set('Authorization', `Bearer ${token}`)
```
- Assim, o middleware aceitará o token e o teste passará normalmente.

## 10. Correção do Teste da Rota Protegida
- O teste 'deve acessar rota protegida com JWT válido' foi ajustado para gerar um token JWT real usando o segredo do serviço.
- Agora o teste utiliza:

```js
const jwt = require('jsonwebtoken');
const { SECRET } = require('../src/service/userService');
const token = jwt.sign({ login: 'user1' }, SECRET);
```
- O token é enviado no header Authorization:

```js
.set('Authorization', `Bearer ${token}`)
```
- Isso garante que o middleware aceite o token e o teste passe corretamente.

## Observações Gerais
- Banco de dados em memória.
- API pronta para automação de testes.
- Estrutura modular e documentada.
- Suporte para JWT e Swagger.

---

Este arquivo resume todas as ações, correções e decisões tomadas durante a construção e ajuste do projeto AUTH-SERVICE via ChatGPT.
