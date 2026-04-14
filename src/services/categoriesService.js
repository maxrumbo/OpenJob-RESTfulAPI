const pool = require('../config/database');
const { nanoid } = require('nanoid');
const InvariantError = require('../utils/InvariantError');
const NotFoundError = require('../utils/NotFoundError');

const addCategory = async ({ name, description }) => {
  const id = `category-${nanoid(16)}`;

  const result = await pool.query(
    `INSERT INTO categories (id, name, description)
     VALUES ($1, $2, $3) RETURNING id`,
    [id, name, description || null],
  );

  if (!result.rows.length) {
    throw new InvariantError('Failed to create category');
  }

  return result.rows[0].id;
};

const getCategories = async () => {
  const result = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM categories ORDER BY name ASC',
  );
  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM categories WHERE id = $1',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Category not found');
  }

  return result.rows[0];
};

const editCategoryById = async (id, { name, description }) => {
  const result = await pool.query(
    `UPDATE categories SET name = $1, description = $2, updated_at = NOW()
     WHERE id = $3 RETURNING id`,
    [name, description || null, id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Category not found');
  }

  return result.rows[0].id;
};

const deleteCategoryById = async (id) => {
  const result = await pool.query(
    'DELETE FROM categories WHERE id = $1 RETURNING id',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Category not found');
  }
};

module.exports = { addCategory, getCategories, getCategoryById, editCategoryById, deleteCategoryById };
