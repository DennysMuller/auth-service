const jwt = require('jsonwebtoken');
const { SECRET } = require('../service/userService');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token não informado.' });
  }
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
