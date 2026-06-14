require('dotenv').config();

const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');
const InvariantError = require('../exceptions/InvariantError');

const requiredEnv = ['ACCESS_TOKEN_KEY', 'REFRESH_TOKEN_KEY'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} belum diatur`);
  }
});

const TokenManager = {
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '3h',
    });
  },

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
  },

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
