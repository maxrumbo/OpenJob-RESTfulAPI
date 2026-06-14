const pool = require('../database/pool');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const generateId = require('../utils/id');

const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const CategoryService = {
  async createCategory(payload) {
    const id = generateId('category');
    const result = await pool.query(
      `INSERT INTO categories (id, name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (name) DO UPDATE
       SET description = EXCLUDED.description,
           updated_at = current_timestamp
       RETURNING id`,
      [id, payload.name, payload.description || null],
    );

    return result.rows[0].id;
  },

  async getCategories() {
    const result = await pool.query(
      `SELECT id, name, description, created_at
       FROM categories
       ORDER BY name ASC`,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
    }));
  },

  async getCategoryById(id) {
    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM categories
       WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    return mapCategory(result.rows[0]);
  },

  async updateCategoryById(id, payload) {
    try {
      const result = await pool.query(
        `UPDATE categories
         SET name = $1,
             description = $2,
             updated_at = current_timestamp
         WHERE id = $3
         RETURNING id`,
        [payload.name, payload.description || null, id],
      );

      if (result.rowCount === 0) {
        throw new NotFoundError('Kategori tidak ditemukan');
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new InvariantError('Nama kategori sudah digunakan');
      }
      throw error;
    }
  },

  async deleteCategoryById(id) {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }
  },
};

module.exports = CategoryService;
