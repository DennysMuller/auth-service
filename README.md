# AUTH-SERVICE

API REST simples para autenticação de usuários, com separação entre Controller, Service e Model, uso de JWT, documentação Swagger e testes automatizados.

## Integração Contínua (CI)

Este projeto executa automaticamente os testes em cada push ou pull request usando Github Actions.

- O pipeline instala as dependências e executa `npm test` após o clone do repositório.
- O status da execução pode ser acompanhado na aba 'Actions' do Github.

## Instalação

```bash
npm install
```

## Executando a API

```bash
node server.js
```

## Documentação Swagger

Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) para visualizar a documentação interativa.

## Endpoints

- `POST /register` - Registra novo usuário
- `POST /login` - Realiza login e retorna JWT
- `GET /protected` - Endpoint protegido por JWT

## Testes Automatizados

```bash
npm test
```

## Tecnologias
- Node.js
- Express
- JWT
- Swagger
- Mocha, Chai, Sinon, SuperTest

## Observações
- Banco de dados em memória (variáveis)
- Não permite usuários duplicados
- Login exige login e senha
