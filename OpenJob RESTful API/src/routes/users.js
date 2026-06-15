const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const UserService = require('../services/UserService');
const CacheService = require('../services/CacheService');
const { createUserSchema, updateUserSchema } = require('../validators/users');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - username
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User successfully created
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
 *                   example: "User berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       400:
 *         description: Bad request / validation error
 */
router.post(
  '/',
  validate(createUserSchema),
  asyncHandler(async (req, res) => {
    const userId = await UserService.createUser(req.body);

    res.status(201).json({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        id: userId,
      },
    });
  }),
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const user = await CacheService.get(`user:${req.params.id}`);
      res.setHeader('X-Data-Source', 'cache');
      return res.json({
        status: 'success',
        data: JSON.parse(user),
      });
    } catch (error) {
      const user = await UserService.getUserById(req.params.id);
      await CacheService.set(`user:${req.params.id}`, JSON.stringify(user));

      res.setHeader('X-Data-Source', 'database');
      res.json({
        status: 'success',
        data: user,
      });
    }
  }),
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully updated
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
 *                   example: "User berhasil diperbarui"
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  validate(updateUserSchema),
  asyncHandler(async (req, res) => {
    await UserService.updateUserById(req.params.id, req.body);
    await CacheService.delete(`user:${req.params.id}`);

    res.json({
      status: 'success',
      message: 'User berhasil diperbarui',
    });
  }),
);

module.exports = router;
