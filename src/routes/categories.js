const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { CategoryPayloadSchema } = require('../validators/categories');

// PUBLIC
router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);

// PROTECTED
router.post('/', authMiddleware, validate(CategoryPayloadSchema), categoriesController.createCategory);
router.put('/:id', authMiddleware, validate(CategoryPayloadSchema), categoriesController.updateCategory);
router.delete('/:id', authMiddleware, categoriesController.deleteCategory);

module.exports = router;
