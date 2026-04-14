const categoriesService = require('../services/categoriesService');

const createCategory = async (req, res, next) => {
  try {
    const categoryId = await categoriesService.addCategory(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: { categoryId },
    });
  } catch (error) {
    return next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.getCategories();
    return res.status(200).json({
      status: 'success',
      data: { categories },
    });
  } catch (error) {
    return next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoriesService.getCategoryById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    return next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    await categoriesService.editCategoryById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoriesService.deleteCategoryById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
