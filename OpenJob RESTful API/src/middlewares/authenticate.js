const AuthenticationError = require('../exceptions/AuthenticationError');
const TokenManager = require('../utils/TokenManager');

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new AuthenticationError('Token akses tidak ditemukan'));
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new AuthenticationError('Format token akses tidak valid'));
  }

  try {
    const payload = TokenManager.verifyAccessToken(token);
    req.auth = {
      id: payload.id,
    };
    return next();
  } catch (error) {
    return next(new AuthenticationError('Token akses tidak valid'));
  }
};

module.exports = authenticate;
