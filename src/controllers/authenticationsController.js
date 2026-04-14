const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');
const authenticationsService = require('../services/authenticationsService');
const InvariantError = require('../utils/InvariantError');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY);
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const id = await usersService.verifyUserCredential(username, password);

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    await authenticationsService.addRefreshToken(refreshToken);

    return res.status(201).json({
      status: 'success',
      message: 'Login successful',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await authenticationsService.verifyRefreshToken(refreshToken);

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch (err) {
      throw new InvariantError('Invalid refresh token');
    }

    const accessToken = generateAccessToken(payload.id);

    return res.status(200).json({
      status: 'success',
      message: 'Access token refreshed',
      data: { accessToken },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authenticationsService.deleteRefreshToken(refreshToken);

    return res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login, refreshAccessToken, logout };
