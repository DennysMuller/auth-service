const service = require('../service/userService');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login:
 *                   type: string
 *       400:
 *         description: Login e senha obrigatórios
 *       409:
 *         description: Usuário já existe
 */
function registerController(req, res, next) {
  try {
    const { login, password } = req.body;
    const user = service.register(login, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login e retorna JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Login e senha obrigatórios
 *       401:
 *         description: Credenciais inválidas
 */
function loginController(req, res, next) {
  try {
    const { login, password } = req.body;
    const result = service.loginUser(login, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerController,
  loginController
};
