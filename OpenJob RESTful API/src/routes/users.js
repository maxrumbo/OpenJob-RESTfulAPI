const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const UserService = require('../services/UserService');
const CacheService = require('../services/CacheService');
const { createUserSchema, updateUserSchema } = require('../validators/users');

const router = express.Router();

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
