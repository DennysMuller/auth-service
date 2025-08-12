const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { registerController, loginController } = require('./src/controller/userController');
const authMiddleware = require('./src/middleware/authMiddleware');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.use(bodyParser.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth API',
      version: '1.0.0',
      description: 'API de autenticação para testes e automação',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/controller/userController.js', './app.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post('/register', registerController);
app.post('/login', loginController);

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.login}!` });
});

app.use(errorHandler);

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Endpoint protegido por JWT
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Token não informado ou inválido
 */

module.exports = app;
