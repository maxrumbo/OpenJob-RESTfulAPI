const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const CategoryService = require('../services/CategoryService');
const { categorySchema } = require('../validators/categories');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await CategoryService.getCategories();

    res.json({
      status: 'success',
      data: {
        categories,
      },
    });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const category = await CategoryService.getCategoryById(req.params.id);

    res.json({
      status: 'success',
      data: category,
    });
  }),
);

router.post(
  '/',
  authenticate,
  validate(categorySchema),
  asyncHandler(async (req, res) => {
    const categoryId = await CategoryService.createCategory(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Kategori berhasil ditambahkan',
      data: {
        id: categoryId,
      },
    });
  }),
);

router.put(
  '/:id',
  authenticate,
  validate(categorySchema),
  asyncHandler(async (req, res) => {
    await CategoryService.updateCategoryById(req.params.id, req.body);

    res.json({
      status: 'success',
      message: 'Kategori berhasil diperbarui',
    });
  }),
);

router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    await CategoryService.deleteCategoryById(req.params.id);

    res.json({
      status: 'success',
      message: 'Kategori berhasil dihapus',
    });
  }),
);

module.exports = router;
