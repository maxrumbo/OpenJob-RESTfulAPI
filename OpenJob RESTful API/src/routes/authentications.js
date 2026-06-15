const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const AuthenticationService = require('../services/AuthenticationService');
const UserService = require('../services/UserService');
const TokenManager = require('../utils/TokenManager');
const { loginSchema, refreshTokenSchema } = require('../validators/authentications');

const router = express.Router();

/**
 * @swagger
 * /authentications:
 *   post:
 *     summary: User login (Authentication)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             anyOf:
 *               - required:
 *                   - email
 *               - required:
 *                   - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Authentication berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGc..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGc..."
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /authentications:
 *   put:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGc..."
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Access token berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       400:
 *         description: Invalid refresh token
 */
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

/**
 * @swagger
 * /authentications:
 *   delete:
 *     summary: User logout
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGc..."
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Refresh token berhasil dihapus"
 *       401:
 *         description: Unauthorized
 */
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
