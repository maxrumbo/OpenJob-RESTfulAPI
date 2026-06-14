const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const AuthenticationService = require('../services/AuthenticationService');
const UserService = require('../services/UserService');
const TokenManager = require('../utils/TokenManager');
const { loginSchema, refreshTokenSchema } = require('../validators/authentications');

const router = express.Router();

router.post(
  '/',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const user = await UserService.verifyUserCredential(email || username, password);
    const accessToken = TokenManager.generateAccessToken({ id: user.id });
    const refreshToken = TokenManager.generateRefreshToken({ id: user.id });

    await AuthenticationService.addRefreshToken(refreshToken);

    res.json({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
  }),
);

router.put(
  '/',
  validate(refreshTokenSchema),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await AuthenticationService.verifyRefreshToken(refreshToken);
    const payload = TokenManager.verifyRefreshToken(refreshToken);
    const accessToken = TokenManager.generateAccessToken({ id: payload.id });

    res.json({
      status: 'success',
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
  }),
);

router.delete(
  '/',
  authenticate,
  validate(refreshTokenSchema),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await AuthenticationService.verifyRefreshToken(refreshToken);
    TokenManager.verifyRefreshToken(refreshToken);
    await AuthenticationService.deleteRefreshToken(refreshToken);

    res.json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }),
);

module.exports = router;
