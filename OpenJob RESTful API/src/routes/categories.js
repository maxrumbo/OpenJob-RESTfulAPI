const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const CategoryService = require('../services/CategoryService');
const { categorySchema } = require('../validators/categories');

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 */
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

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
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

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
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

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
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
