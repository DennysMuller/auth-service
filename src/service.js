const { users } = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'supersecret';

function register(login, password) {
  if (!login || !password) {
    throw { status: 400, message: 'Login e senha obrigatórios.' };
  }
  if (users.find(u => u.login === login)) {
    throw { status: 409, message: 'Usuário já existe.' };
  }
  const hash = bcrypt.hashSync(password, 8);
  users.push({ login, password: hash });
  return { login };
}

function loginUser(login, password) {
  if (!login || !password) {
    throw { status: 400, message: 'Login e senha obrigatórios.' };
  }
  const user = users.find(u => u.login === login);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw { status: 401, message: 'Credenciais inválidas.' };
  }
  const token = jwt.sign({ login }, SECRET, { expiresIn: '1h' });
  return { token };
}

module.exports = {
  register,
  loginUser,
  SECRET
};
