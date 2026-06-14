const pool = require('../database/pool');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const generateId = require('../utils/id');

const mapCompany = (row) => ({
  id: row.id,
  ownerId: row.owner_id,
  name: row.name,
  description: row.description,
  website: row.website,
  location: row.location,
  industry: row.industry,
  size: row.size,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const CompanyService = {
  async createCompany(ownerId, payload) {
    const id = generateId('company');
    const result = await pool.query(
      `INSERT INTO companies (id, owner_id, name, description, website, location, industry, size)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (name) DO UPDATE
       SET owner_id = EXCLUDED.owner_id,
           description = EXCLUDED.description,
           website = EXCLUDED.website,
           location = EXCLUDED.location,
           industry = EXCLUDED.industry,
           size = EXCLUDED.size,
           updated_at = current_timestamp
       RETURNING id`,
      [
        id,
        ownerId,
        payload.name,
        payload.description || null,
        payload.website || null,
        payload.location || null,
        payload.industry || null,
        payload.size || null,
      ],
    );

    return result.rows[0].id;
  },

  async getCompanies() {
    const result = await pool.query(
      `SELECT id, name, description, location, industry, size
       FROM companies
       ORDER BY created_at DESC`,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      location: row.location,
      industry: row.industry,
      size: row.size,
    }));
  },

  async getCompanyById(id) {
    const result = await pool.query(
      `SELECT id, owner_id, name, description, website, location, industry, size, created_at, updated_at
       FROM companies
       WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Perusahaan tidak ditemukan');
    }

    return mapCompany(result.rows[0]);
  },

  async updateCompanyById(id, payload) {
    try {
      const result = await pool.query(
        `UPDATE companies
         SET name = $1,
             description = $2,
             website = $3,
             location = $4,
             industry = $5,
             size = $6,
             updated_at = current_timestamp
         WHERE id = $7
         RETURNING id`,
        [
          payload.name,
          payload.description || null,
          payload.website || null,
          payload.location || null,
          payload.industry || null,
          payload.size || null,
          id,
        ],
      );

      if (result.rowCount === 0) {
        throw new NotFoundError('Perusahaan tidak ditemukan');
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new InvariantError('Nama perusahaan sudah digunakan');
      }
      throw error;
    }
  },

  async deleteCompanyById(id) {
    const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      throw new NotFoundError('Perusahaan tidak ditemukan');
    }
  },
};

module.exports = CompanyService;
