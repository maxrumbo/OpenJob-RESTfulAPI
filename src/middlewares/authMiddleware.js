const jwt = require('jsonwebtoken');
const AuthenticationError = require('../utils/AuthenticationError');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    return next(new AuthenticationError('Invalid or expired access token'));
  }
};

module.exports = authMiddleware;
